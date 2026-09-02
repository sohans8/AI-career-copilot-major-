# Baseline ML Classifiers, Vectorizers, and Calibrated Predictors.
import sys
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from app.services.data_service import DataService

class StudentProfileVectorizer:
    def __init__(self, data_service: Optional[DataService] = None) -> None:
        self.data_service = data_service or DataService()
        self.subject_vocab: List[str] = []
        self.skill_vocab: List[str] = []
        self.interest_vocab: List[str] = []
        self.feature_names: List[str] = []

    def fit(self) -> 'StudentProfileVectorizer':
        subs = self.data_service.get_subjects()
        sks = self.data_service.get_skills()
        ints = self.data_service.get_interests()
        self.subject_vocab = sorted(subs['subject_name'].astype(str).str.lower().unique().tolist())
        self.skill_vocab = sorted(sks['skill_name'].astype(str).str.lower().unique().tolist())
        self.interest_vocab = sorted(ints['interest_name'].astype(str).str.lower().unique().tolist())
        self.feature_names = ([f'sub_{s}' for s in self.subject_vocab] + [f'sk_{s}' for s in self.skill_vocab] + [f'int_{i}' for i in self.interest_vocab])
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        n_samples = len(df)
        n_features = len(self.feature_names)
        X = np.zeros((n_samples, n_features), dtype=np.float32)
        sub_offset = 0
        sk_offset = len(self.subject_vocab)
        int_offset = sk_offset + len(self.skill_vocab)
        sub_map = {s: idx for idx, s in enumerate(self.subject_vocab)}
        sk_map = {s: idx for idx, s in enumerate(self.skill_vocab)}
        int_map = {i: idx for idx, i in enumerate(self.interest_vocab)}
        sep = ';'
        for i, (_, row) in enumerate(df.iterrows()):
            raw_subs = str(row.get('subjects', '')).split(sep) if pd.notna(row.get('subjects')) else []
            raw_sks = str(row.get('skills', '')).split(sep) if pd.notna(row.get('skills')) else []
            raw_ints = str(row.get('interests', '')).split(sep) if pd.notna(row.get('interests')) else []
            for s in raw_subs:
                clean_s = s.strip().lower()
                if clean_s in sub_map: X[i, sub_offset + sub_map[clean_s]] = 1.0
            for sk in raw_sks:
                clean_sk = sk.strip().lower()
                if clean_sk in sk_map: X[i, sk_offset + sk_map[clean_sk]] = 1.0
            for it in raw_ints:
                clean_it = it.strip().lower()
                if clean_it in int_map: X[i, int_offset + int_map[clean_it]] = 1.0
        return X

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        return self.fit().transform(df)

class StreamMLModel:
    def __init__(self, model_type: str = 'logistic_regression', random_state: int = 42) -> None:
        self.model_type = model_type
        self.vectorizer = StudentProfileVectorizer()
        if model_type == 'logistic_regression':
            base_lr = LogisticRegression(max_iter=1000, random_state=random_state)
            self.model = CalibratedClassifierCV(estimator=base_lr, method='sigmoid', cv=3)
        elif model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100, random_state=random_state)
        else:
            raise ValueError(f'Unsupported model_type: {model_type}')
        self.classes_: np.ndarray = np.array([])

    def fit(self, df_train: pd.DataFrame, target_col: str = 'target_stream_id') -> 'StreamMLModel':
        X_train = self.vectorizer.fit_transform(df_train)
        y_train = df_train[target_col].values
        self.model.fit(X_train, y_train)
        self.classes_ = self.model.classes_
        return self

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        X = self.vectorizer.transform(df)
        return self.model.predict(X)

    def predict_proba(self, df: pd.DataFrame) -> np.ndarray:
        X = self.vectorizer.transform(df)
        return self.model.predict_proba(X)

    def save(self, filepath: Path) -> None:
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)

    @classmethod
    def load(cls, filepath: Path) -> 'StreamMLModel':
        with open(filepath, 'rb') as f:
            return pickle.load(f)
