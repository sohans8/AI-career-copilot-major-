# Evaluation script comparing Baseline Rule Engine, ML Models, and Hybrid Engine.
import sys
import json
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.metrics import classification_report, precision_recall_fscore_support

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.recommendation_service import RecommendationService
from ml.models.baseline_ml import StreamMLModel

def evaluate_all_systems():
    data_dir = Path(__file__).parent / 'data'
    models_dir = Path(__file__).parent / 'models'
    test_path = data_dir / 'held_out_test_set.csv'

    if not test_path.exists():
        raise FileNotFoundError(f'Test set not found at {test_path}. Run train.py first.')

    df_test = pd.read_csv(test_path)
    y_true = df_test['target_stream_id'].values
    n_samples = len(df_test)

    rule_service = RecommendationService()
    lr_model = StreamMLModel.load(models_dir / 'logistic_regression_model.pkl')
    rf_model = StreamMLModel.load(models_dir / 'random_forest_model.pkl')

    classes = list(lr_model.classes_)
    class_to_idx = {c: idx for idx, c in enumerate(classes)}

    preds_rule_top1, preds_rule_top3 = [], []
    preds_ml_top1, preds_ml_top3 = [], []
    preds_hybrid_top1, preds_hybrid_top3 = [], []

    for i, (_, row) in enumerate(df_test.iterrows()):
        profile = {
            'subjects': str(row.get('subjects', '')).split(';'),
            'skills': str(row.get('skills', '')).split(';'),
            'interests': str(row.get('interests', '')).split(';'),
        }

        rule_res = rule_service.recommend(profile)
        rule_recs = rule_res['recommendations']
        rule_top1 = rule_recs[0]['stream_id']
        rule_top3 = [r['stream_id'] for r in rule_recs]
        preds_rule_top1.append(rule_top1)
        preds_rule_top3.append(rule_top3)

        row_df = pd.DataFrame([row])
        proba_ml = lr_model.predict_proba(row_df)[0]
        ml_top1_idx = np.argmax(proba_ml)
        ml_top1 = classes[ml_top1_idx]
        ml_top3_indices = np.argsort(proba_ml)[::-1][:3]
        ml_top3 = [classes[idx] for idx in ml_top3_indices]
        preds_ml_top1.append(ml_top1)
        preds_ml_top3.append(ml_top3)

        rule_scores_dict = {r['stream_id']: r['overall_match_score'] / 100.0 for r in rule_recs}
        hybrid_probs = []
        for idx, c in enumerate(classes):
            r_prob = rule_scores_dict.get(c, 0.2)
            m_prob = proba_ml[idx]
            h_prob = 0.5 * r_prob + 0.5 * m_prob
            hybrid_probs.append(h_prob)

        hybrid_top1_idx = np.argmax(hybrid_probs)
        hybrid_top1 = classes[hybrid_top1_idx]
        hybrid_top3_indices = np.argsort(hybrid_probs)[::-1][:3]
        hybrid_top3 = [classes[idx] for idx in hybrid_top3_indices]
        preds_hybrid_top1.append(hybrid_top1)
        preds_hybrid_top3.append(hybrid_top3)

    def compute_metrics(y_true, top1_preds, top3_preds):
        acc_top1 = np.mean([1 if y_true[i] == top1_preds[i] else 0 for i in range(len(y_true))]) * 100.0
        acc_top3 = np.mean([1 if y_true[i] in top3_preds[i] else 0 for i in range(len(y_true))]) * 100.0
        p_macro, r_macro, f1_macro, _ = precision_recall_fscore_support(y_true, top1_preds, average='macro', zero_division=0)
        p_weight, r_weight, f1_weight, _ = precision_recall_fscore_support(y_true, top1_preds, average='weighted', zero_division=0)
        return {
            'top1_accuracy': round(acc_top1, 2),
            'top3_accuracy': round(acc_top3, 2),
            'macro_precision': round(p_macro * 100, 2),
            'macro_recall': round(r_macro * 100, 2),
            'macro_f1': round(f1_macro * 100, 2),
            'weighted_f1': round(f1_weight * 100, 2),
        }

    m_rule = compute_metrics(y_true, preds_rule_top1, preds_rule_top3)
    m_ml = compute_metrics(y_true, preds_ml_top1, preds_ml_top3)
    m_hybrid = compute_metrics(y_true, preds_hybrid_top1, preds_hybrid_top3)

    print('=== EVALUATION RESULTS ON HELD-OUT TEST SET (N=120) ===\n')
    print('System A (Rule Engine Baseline) :')
    print('  Top-1 Accuracy:', m_rule['top1_accuracy'], '%')
    print('  Top-3 Accuracy:', m_rule['top3_accuracy'], '%')
    print('  Macro F1 Score:', m_rule['macro_f1'], '%')
    print('\nSystem B (Pure ML Classifier - LogReg) :')
    print('  Top-1 Accuracy:', m_ml['top1_accuracy'], '%')
    print('  Top-3 Accuracy:', m_ml['top3_accuracy'], '%')
    print('  Macro F1 Score:', m_ml['macro_f1'], '%')
    print('\nSystem C (Hybrid Ensemble - Rule + ML) :')
    print('  Top-1 Accuracy:', m_hybrid['top1_accuracy'], '%')
    print('  Top-3 Accuracy:', m_hybrid['top3_accuracy'], '%')
    print('  Macro F1 Score:', m_hybrid['macro_f1'], '%')

if __name__ == '__main__':
    evaluate_all_systems()