# Recommendation Robustness & Architectural Design Document

## 1. Hybrid Recommendation Architecture
Career Copilot combines domain rule matching ($S_{\text{rule}} \in [0, 100]$) with calibrated Logistic Regression class probabilities ($P_{\text{ML}} \in [0.0, 1.0]$) using `CalibratedClassifierCV(method="sigmoid")`.

### Adaptive Hybrid Formula:
$$S_{\text{hybrid}}(s) = \text{round}(w_{\text{rule}} \cdot S_{\text{rule}}(s) + w_{\text{ML}} \cdot (100.0 \cdot P_{\text{ML}}(s)), 2)$$

#### Dynamic Weights ($w_{\text{rule}}, w_{\text{ML}}$):
- **Sparse / Incomplete Inputs** (Total valid inputs $\le 2$ or missing skills/interests): $w_{\text{rule}} = 0.85, w_{\text{ML}} = 0.15$
- **High Uncertainty / Cross-Domain Conflicts**: $w_{\text{rule}} = 0.70, w_{\text{ML}} = 0.30$
- **Standard Complete Profile**: $w_{\text{rule}} = 0.50, w_{\text{ML}} = 0.50$

---

## 2. Uncertainty Calculation & Recommendation Status
Uncertainty $U \in [0.0, 1.0]$ is derived from top-1 vs top-2 calibrated ML probability margin $\Delta P = P_{\text{ML}}^{(1)} - P_{\text{ML}}^{(2)}$:
$$U = \text{round}(1.0 - \max(\Delta P, 0.05), 2)$$

### Recommendation Status Taxonomy:
1. `needs_more_information`: Triggered when total valid inputs $\le 2$ or critical input categories are omitted.
2. `conflicting_evidence`: Triggered when competing streams have close scores (margin $< 10.0$ or $\Delta P < 0.12$).
3. `moderate_confidence`: Triggered when margin is moderate ($0.12 \le \Delta P < 0.30$).
4. `high_confidence`: Triggered when margin is large ($\Delta P \ge 0.30, \Delta S \ge 25.0$).

---

## 3. Targeted Deterministic Follow-Up Questions
When recommendations present ambiguity or missing fields, the system generates targeted clarification questions:
- **Science PCM vs Science PCB**: *"Which do you enjoy more: Mathematics/Physics or Biology/health sciences?"*
- **Science vs Commerce**: *"Which do you enjoy more: solving technical/scientific problems or understanding business, economics, and finance?"*
- **Science vs Humanities**: *"Do you prefer technical problem-solving or subjects involving society, history, literature, and communication?"*
- **Missing Input Category**: *"Adding your favourite subjects, key skills, or specific areas of interest will improve recommendation accuracy."*

---

## 4. Synthetic Data Disclaimer & Limitations
- **Data Origin**: Benchmark data is synthetically generated across 12 stream archetypes.
- **Accuracy Realism**: The 100% clean accuracy on synthetic data does NOT translate directly to real-world students.
- **Production Requirement**: Real student feedback and choices must be logged during Phase 1 to train future empirical models.