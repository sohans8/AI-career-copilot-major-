# Career Copilot ML Experimentation & Model Baseline

## Overview
This directory contains the machine learning experiment pipeline for **Career Copilot Phase 1**.
It transitions the system from a pure domain-rule baseline toward a data-driven ML recommendation framework.

## Data Inspection & Sufficiency Analysis
- **Raw Catalog Dataset (ackend/data/raw/)**: Contains catalog definitions (105 subjects, 76 skills, 59 interests, 12 streams, 104 courses, 200 careers) and 1,250 domain rule pairs.
- **Data Sufficiency Determination**: Raw catalog files alone do **NOT** contain real-world student interaction logs or labeled student outcomes. stream_recommendation_rules.csv represents domain knowledge, NOT ground-truth student performance.
- **Synthetic Profile Strategy**: A transparent synthetic profile generator (ml/data/generate_synthetic_dataset.py) samples student profiles across 12 domain archetypes with controlled cross-domain noise.

## Dataset Schema (synthetic_student_dataset.csv)
| Column Name | Type | Description |
| :--- | :--- | :--- |
| student_id | String | Unique student profile ID (e.g. STU0001) |
| student_name | String | Synthetic student profile name |
| subjects | String | Semicolon-separated list of selected favourite subjects |
| skills | String | Semicolon-separated list of selected skills |
| interests | String | Semicolon-separated list of selected interests |
| 	arget_stream_id | String | Target stream class label (S01 to S12) |
| 	arget_broad_pathway | String | Broad pathway category (Science, Commerce, Humanities, Other) |
| rchetype | String | Name of domain archetype used for transparent sampling |

## Feature Representation & Encoding
Student profiles are represented using **Multi-Hot Binary Feature Encoding**:
- **Subjects Vocabulary**: 105 binary features ({\\text{subj}} \\in \\{0, 1\\}^{105}$)
- **Skills Vocabulary**: 76 binary features ({\\text{sk}} \\in \\{0, 1\\}^{76}$)
- **Interests Vocabulary**: 59 binary features ({\\text{int}} \\in \\{0, 1\\}^{59}$)
- **Total Feature Vector Dimension**:  + 76 + 59 = 240$ binary features per profile.

## Classifiers & Modeling
- **Primary Recommended Model**: **Logistic Regression** (sklearn.linear_model.LogisticRegression). Ideal for sparse multi-hot binary vectors, fast training/inference, zero deep learning overhead, and direct probability output.
- **Alternative Tree Model**: **Random Forest Classifier** (sklearn.ensemble.RandomForestClassifier).

## Train / Test Data Separation
- **Total Generated Dataset**: 600 synthetic profiles across 12 stream archetypes.
- **Stratified Split**: 80% Train split (480 samples), 20% Held-out Test split (120 samples saved to ml/data/held_out_test_set.csv).
- **Strict Preprocessing Order**: Multi-hot vectorizer vocabulary is fitted strictly on training data.

## Evaluation Metrics & Framework
- **Top-1 Accuracy**: Exact target match rate.
- **Top-3 Accuracy**: Target inclusion in top 3 stream recommendations (Emphasized for career counseling flexibility).
- **Macro F1-Score**: Unweighted average F1 across all 12 stream classes.

### Held-Out Test Set Benchmark Results (N=120)
| System / Model | Top-1 Accuracy | Top-3 Accuracy | Macro F1 Score |
| :--- | :---: | :---: | :---: |
| **System A: Rule Engine Baseline** | 91.67% | 100.00% | 91.68% |
| **System B: Pure ML (Logistic Regression)** | 100.00% | 100.00% | 100.00% |
| **System C: Hybrid Ensemble (Rule + ML)** | 100.00% | 100.00% | 100.00% |

## Execution Commands
`ash
# Generate synthetic dataset
python ml/data/generate_synthetic_dataset.py

# Train models and save train/test splits
python ml/train.py

# Evaluate all candidate systems on held-out test split
python ml/evaluate.py
`