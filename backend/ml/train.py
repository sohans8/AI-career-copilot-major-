# Training script for Career Copilot ML Baseline Models.
import sys
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ml.data.generate_synthetic_dataset import generate_synthetic_profiles
from ml.models.baseline_ml import StreamMLModel

def train_baseline_models():
    data_dir = Path(__file__).parent / 'data'
    models_dir = Path(__file__).parent / 'models'
    dataset_path = data_dir / 'synthetic_student_dataset.csv'
    test_path = data_dir / 'held_out_test_set.csv'

    if not dataset_path.exists():
        print(f'Generating synthetic dataset at {dataset_path}...')
        df = generate_synthetic_profiles(num_samples_per_archetype=50, random_seed=42)
        df.to_csv(dataset_path, index=False)
    else:
        df = pd.read_csv(dataset_path)

    print(f'Loaded dataset with {len(df)} samples.')

    # Stratified Train/Test Split (80% Train, 20% Held-Out Test)
    df_train, df_test = train_test_split(
        df, test_size=0.20, random_state=42, stratify=df['target_stream_id']
    )

    df_test.to_csv(test_path, index=False)
    print(f'Split dataset: {len(df_train)} train samples, {len(df_test)} held-out test samples saved to {test_path}.')

    # Train Logistic Regression Model
    print('\nTraining Logistic Regression model...')
    lr_model = StreamMLModel(model_type='logistic_regression', random_state=42)
    lr_model.fit(df_train, target_col='target_stream_id')
    lr_path = models_dir / 'logistic_regression_model.pkl'
    lr_model.save(lr_path)
    print(f'Saved Logistic Regression model to {lr_path}')

    # Train Random Forest Model
    print('\nTraining Random Forest model...')
    rf_model = StreamMLModel(model_type='random_forest', random_state=42)
    rf_model.fit(df_train, target_col='target_stream_id')
    rf_path = models_dir / 'random_forest_model.pkl'
    rf_model.save(rf_path)
    print(f'Saved Random Forest model to {rf_path}')

    print('\nTRAINING COMPLETED SUCCESSFULLY!')

if __name__ == '__main__':
    train_baseline_models()