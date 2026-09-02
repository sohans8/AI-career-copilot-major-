# Recommendation service for Career Copilot Phase 1.
import sys
import pathlib
from typing import Any, Dict, List, Optional, Set, Tuple
import pandas as pd
import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from app.services.data_service import DataService

AMP = chr(38)

STREAM_INT_WEIGHTS: Dict[str, Dict[str, float]] = {
    'S01': {'STEM': 1.0, 'Services ' + AMP + ' Trades': 0.2, 'Business': 0.2, 'Healthcare': 0.2, 'Social Science': 0.1, 'Humanities': 0.1, 'Creative': 0.1},
    'S02': {'Healthcare': 1.0, 'STEM': 0.8, 'Social Science': 0.3, 'Services ' + AMP + ' Trades': 0.2, 'Business': 0.1, 'Humanities': 0.1, 'Creative': 0.1},
    'S03': {'STEM': 1.0, 'Healthcare': 0.9, 'Business': 0.2, 'Social Science': 0.2, 'Services ' + AMP + ' Trades': 0.2, 'Humanities': 0.1, 'Creative': 0.1},
    'S04': {'Business': 1.0, 'STEM': 0.7, 'Social Science': 0.4, 'Services ' + AMP + ' Trades': 0.3, 'Humanities': 0.1, 'Creative': 0.1, 'Healthcare': 0.1},
    'S05': {'Business': 1.0, 'Services ' + AMP + ' Trades': 0.7, 'Social Science': 0.5, 'Humanities': 0.3, 'Creative': 0.3, 'STEM': 0.1, 'Healthcare': 0.1},
    'S06': {'Social Science': 1.0, 'Humanities': 1.0, 'Creative': 0.5, 'Business': 0.3, 'Healthcare': 0.2, 'Services ' + AMP + ' Trades': 0.2, 'STEM': 0.1},
    'S07': {'Creative': 1.0, 'Humanities': 0.6, 'Services ' + AMP + ' Trades': 0.4, 'STEM': 0.3, 'Business': 0.3, 'Social Science': 0.2, 'Healthcare': 0.1},
    'S08': {'STEM': 0.9, 'Services ' + AMP + ' Trades': 0.9, 'Creative': 0.5, 'Business': 0.4, 'Social Science': 0.2, 'Healthcare': 0.2, 'Humanities': 0.1},
    'S09': {'STEM': 0.8, 'Healthcare': 0.7, 'Services ' + AMP + ' Trades': 0.5, 'Business': 0.4, 'Social Science': 0.3, 'Humanities': 0.1, 'Creative': 0.1},
    'S10': {'Social Science': 1.0, 'Humanities': 0.6, 'Business': 0.5, 'Services ' + AMP + ' Trades': 0.2, 'Creative': 0.2, 'Healthcare': 0.1, 'STEM': 0.1},
    'S11': {'Healthcare': 1.0, 'Services ' + AMP + ' Trades': 0.5, 'Social Science': 0.4, 'STEM': 0.4, 'Humanities': 0.2, 'Business': 0.1, 'Creative': 0.1},
    'S12': {'Humanities': 1.0, 'Creative': 1.0, 'Social Science': 0.7, 'Services ' + AMP + ' Trades': 0.4, 'Business': 0.3, 'STEM': 0.1, 'Healthcare': 0.1},
}

STREAM_SKILL_WEIGHTS: Dict[str, Dict[str, float]] = {
    'S01': {'Analytical': 1.0, 'Technical': 1.0, 'Professional ' + AMP + ' Business': 0.4, 'Creative': 0.3, 'Language ' + AMP + ' Communication': 0.2, 'Interpersonal': 0.2},
    'S02': {'Analytical': 1.0, 'Technical': 0.7, 'Interpersonal': 0.6, 'Professional ' + AMP + ' Business': 0.4, 'Language ' + AMP + ' Communication': 0.3, 'Creative': 0.2},
    'S03': {'Analytical': 1.0, 'Technical': 0.9, 'Interpersonal': 0.6, 'Professional ' + AMP + ' Business': 0.4, 'Language ' + AMP + ' Communication': 0.3, 'Creative': 0.2},
    'S04': {'Analytical': 1.0, 'Professional ' + AMP + ' Business': 1.0, 'Technical': 0.5, 'Interpersonal': 0.5, 'Language ' + AMP + ' Communication': 0.4, 'Creative': 0.2},
    'S05': {'Professional ' + AMP + ' Business': 1.0, 'Interpersonal': 0.9, 'Language ' + AMP + ' Communication': 0.6, 'Analytical': 0.5, 'Creative': 0.4, 'Technical': 0.2},
    'S06': {'Language ' + AMP + ' Communication': 1.0, 'Interpersonal': 1.0, 'Analytical': 0.7, 'Professional ' + AMP + ' Business': 0.5, 'Creative': 0.5, 'Technical': 0.2},
    'S07': {'Creative': 1.0, 'Technical': 0.6, 'Language ' + AMP + ' Communication': 0.5, 'Professional ' + AMP + ' Business': 0.4, 'Analytical': 0.3, 'Interpersonal': 0.3},
    'S08': {'Technical': 1.0, 'Analytical': 0.8, 'Professional ' + AMP + ' Business': 0.7, 'Interpersonal': 0.4, 'Creative': 0.4, 'Language ' + AMP + ' Communication': 0.3},
    'S09': {'Analytical': 0.9, 'Technical': 0.7, 'Professional ' + AMP + ' Business': 0.6, 'Interpersonal': 0.5, 'Language ' + AMP + ' Communication': 0.3, 'Creative': 0.2},
    'S10': {'Language ' + AMP + ' Communication': 1.0, 'Interpersonal': 1.0, 'Professional ' + AMP + ' Business': 0.8, 'Analytical': 0.6, 'Creative': 0.3, 'Technical': 0.2},
    'S11': {'Interpersonal': 1.0, 'Analytical': 0.8, 'Technical': 0.7, 'Professional ' + AMP + ' Business': 0.5, 'Language ' + AMP + ' Communication': 0.4, 'Creative': 0.2},
    'S12': {'Language ' + AMP + ' Communication': 1.0, 'Creative': 1.0, 'Interpersonal': 0.8, 'Professional ' + AMP + ' Business': 0.5, 'Analytical': 0.4, 'Technical': 0.3},
}

class RecommendationService:
    def __init__(self, data_service: Optional[DataService] = None) -> None:
        self.data_service = data_service or DataService()
        self.ml_model = None
        self._load_ml_model()

    def _load_ml_model(self) -> None:
        try:
            model_path = pathlib.Path(__file__).resolve().parents[2] / 'ml' / 'models' / 'logistic_regression_model.pkl'
            if model_path.exists():
                from ml.models.baseline_ml import StreamMLModel
                self.ml_model = StreamMLModel.load(model_path)
        except Exception:
            self.ml_model = None

    def _resolve_inputs(self, profile: Dict[str, Any]) -> Tuple[List[Dict[str, str]], List[Dict[str, str]], List[str], Dict[str, List[str]]]:
        raw_skills = profile.get('skills') or profile.get('user_skills') or []
        raw_interests = profile.get('interests') or profile.get('user_interests') or []
        raw_subjects = profile.get('subjects') or profile.get('favourite_subjects') or profile.get('favorite_subjects') or []

        if isinstance(raw_skills, str): raw_skills = [raw_skills]
        if isinstance(raw_interests, str): raw_interests = [raw_interests]
        if isinstance(raw_subjects, str): raw_subjects = [raw_subjects]

        skills_df = self.data_service.get_skills()
        skill_id_map = {str(row['skill_id']).upper(): {'skill_id': str(row['skill_id']), 'skill_name': str(row['skill_name']), 'category': str(row['category'])} for _, row in skills_df.iterrows()}
        skill_name_map = {str(row['skill_name']).lower(): {'skill_id': str(row['skill_id']), 'skill_name': str(row['skill_name']), 'category': str(row['category'])} for _, row in skills_df.iterrows()}

        matched_skills: List[Dict[str, str]] = []
        seen_skill_ids: Set[str] = set()
        unrecognized_skills: List[str] = []

        for sk in raw_skills:
            sk_str = str(sk).strip()
            if not sk_str: continue
            if sk_str.upper() in skill_id_map:
                item = skill_id_map[sk_str.upper()]
                if item['skill_id'] not in seen_skill_ids:
                    seen_skill_ids.add(item['skill_id'])
                    matched_skills.append(item)
            elif sk_str.lower() in skill_name_map:
                item = skill_name_map[sk_str.lower()]
                if item['skill_id'] not in seen_skill_ids:
                    seen_skill_ids.add(item['skill_id'])
                    matched_skills.append(item)
            else:
                unrecognized_skills.append(sk_str)

        interests_df = self.data_service.get_interests()
        interest_id_map = {str(row['interest_id']).upper(): {'interest_id': str(row['interest_id']), 'interest_name': str(row['interest_name']), 'category': str(row['category'])} for _, row in interests_df.iterrows()}
        interest_name_map = {str(row['interest_name']).lower(): {'interest_id': str(row['interest_id']), 'interest_name': str(row['interest_name']), 'category': str(row['category'])} for _, row in interests_df.iterrows()}

        matched_interests: List[Dict[str, str]] = []
        seen_interest_ids: Set[str] = set()
        unrecognized_interests: List[str] = []

        for it in raw_interests:
            it_str = str(it).strip()
            if not it_str: continue
            if it_str.upper() in interest_id_map:
                item = interest_id_map[it_str.upper()]
                if item['interest_id'] not in seen_interest_ids:
                    seen_interest_ids.add(item['interest_id'])
                    matched_interests.append(item)
            elif it_str.lower() in interest_name_map:
                item = interest_name_map[it_str.lower()]
                if item['interest_id'] not in seen_interest_ids:
                    seen_interest_ids.add(item['interest_id'])
                    matched_interests.append(item)
            else:
                unrecognized_interests.append(it_str)

        subjects_df = self.data_service.get_subjects()
        subject_name_map = {str(row['subject_name']).lower(): str(row['subject_name']) for _, row in subjects_df.iterrows()}

        matched_subject_names: List[str] = []
        seen_subjects_lower: Set[str] = set()
        unrecognized_subjects: List[str] = []

        for sub in raw_subjects:
            sub_str = str(sub).strip()
            if not sub_str: continue
            if sub_str.lower() in subject_name_map:
                canonical_name = subject_name_map[sub_str.lower()]
                if sub_str.lower() not in seen_subjects_lower:
                    seen_subjects_lower.add(sub_str.lower())
                    matched_subject_names.append(canonical_name)
            else:
                unrecognized_subjects.append(sub_str)

        unrecognized_inputs = {
            'subjects': unrecognized_subjects,
            'skills': unrecognized_skills,
            'interests': unrecognized_interests,
        }
        return matched_skills, matched_interests, matched_subject_names, unrecognized_inputs

    def _get_courses_and_careers_for_stream(self, stream_id: str, limit_courses: int = 5, limit_careers: int = 3) -> List[Dict[str, Any]]:
        courses_df = self.data_service.get_courses()
        mapping_df = self.data_service.get_course_career_mapping()
        careers_df = self.data_service.get_careers()
        careers_by_id = {str(row['career_id']): {'career_id': str(row['career_id']), 'career_name': str(row['career_name']), 'domain': str(row['domain'])} for _, row in careers_df.iterrows()}
        stream_courses = courses_df[courses_df['stream_id'] == stream_id]
        course_results: List[Dict[str, Any]] = []
        for _, crow in stream_courses.head(limit_courses).iterrows():
            cid = str(crow['course_id'])
            cname = str(crow['course_name'])
            typical_subs = str(crow['typical_subjects']) if pd.notna(crow['typical_subjects']) else ''
            course_mappings = mapping_df[mapping_df['course_id'] == cid]
            related_careers: List[Dict[str, Any]] = []
            for _, mrow in course_mappings.head(limit_careers).iterrows():
                car_id = str(mrow['career_id'])
                if car_id in careers_by_id: related_careers.append(careers_by_id[car_id])
            course_results.append({'course_id': cid, 'course_name': cname, 'typical_subjects': typical_subs, 'related_careers': related_careers})
        return course_results

    def _generate_follow_up_questions(self, top_candidates: List[Dict[str, Any]], missing_categories: List[str]) -> List[str]:
        questions: List[str] = []
        if len(top_candidates) >= 2:
            s1_id = top_candidates[0]['stream_id']
            s2_id = top_candidates[1]['stream_id']
            s1_name = top_candidates[0]['stream_name']
            s2_name = top_candidates[1]['stream_name']

            if {s1_id, s2_id} == {'S01', 'S02'}:
                questions.append('Which do you enjoy more: Mathematics/Physics or Biology/health sciences?')
            elif {s1_id, s2_id} == {'S01', 'S03'}:
                questions.append('Are you more focused on pure physical engineering (PCM) or interdisciplinary biological/medical sciences (PCMB)?')
            elif s1_id in {'S01', 'S02', 'S03'} and s2_id in {'S04', 'S05'}:
                questions.append('Which do you enjoy more: solving technical/scientific problems or understanding business, economics, and finance?')
            elif s1_id in {'S01', 'S02', 'S03'} and s2_id in {'S06', 'S07', 'S12'}:
                questions.append('Do you prefer technical problem-solving or subjects involving society, history, literature, and communication?')
            elif s1_id in {'S04', 'S05'} and s2_id in {'S06', 'S07', 'S12'}:
                questions.append('Do you prefer business, commerce, and financial analysis, or liberal arts, humanities, and social sciences?')
            else:
                questions.append(f'To help clarify your recommendation, which domain interests you more: {s1_name} or {s2_name}?')

        if missing_categories:
            missing_str = ', '.join(missing_categories)
            questions.append(f'Adding your input for {missing_str} will significantly improve recommendation precision.')

        return questions

    def recommend(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        matched_skills, matched_interests, matched_subjects, unrecognized = self._resolve_inputs(profile)

        streams_df = self.data_service.get_streams()
        courses_df = self.data_service.get_courses()

        matched_skill_names = [sk['skill_name'] for sk in matched_skills]
        matched_interest_names = [it['interest_name'] for it in matched_interests]
        user_subjects_lower = set([sub.lower() for sub in matched_subjects])

        n_subs = len(matched_subjects)
        n_sks = len(matched_skills)
        n_ints = len(matched_interests)
        total_valid = n_subs + n_sks + n_ints

        missing_categories: List[str] = []
        if n_subs == 0: missing_categories.append('favourite subjects')
        if n_sks == 0: missing_categories.append('skills')
        if n_ints == 0: missing_categories.append('interests')

        # 1. Compute Rule-based scores for all 12 streams
        rule_stream_scores: Dict[str, float] = {}
        rule_breakdowns: Dict[str, Dict[str, Any]] = {}

        for _, srow in streams_df.iterrows():
            sid = str(srow['stream_id'])
            sname = str(srow['stream_name'])
            sdesc = str(srow['description']) if pd.notna(srow['description']) else ''

            c_subs_list = courses_df[courses_df['stream_id'] == sid]['typical_subjects'].dropna().tolist()
            stream_subjects: Set[str] = set()
            for cs in c_subs_list:
                for sub_item in str(cs).split(';'): stream_subjects.add(sub_item.strip().lower())

            matched_subj_set = user_subjects_lower.intersection(stream_subjects)
            subject_match_score = (len(matched_subj_set) / len(user_subjects_lower)) * 100.0 if user_subjects_lower else 50.0

            s_skill_weights = STREAM_SKILL_WEIGHTS.get(sid, {})
            skill_match_score = (sum([s_skill_weights.get(sk['category'], 0.1) for sk in matched_skills]) / len(matched_skills)) * 100.0 if matched_skills else 50.0

            s_int_weights = STREAM_INT_WEIGHTS.get(sid, {})
            interest_match_score = (sum([s_int_weights.get(it['category'], 0.1) for it in matched_interests]) / len(matched_interests)) * 100.0 if matched_interests else 50.0

            rule_score = round(0.40 * skill_match_score + 0.40 * interest_match_score + 0.20 * subject_match_score, 2)
            rule_stream_scores[sid] = rule_score

            matched_skill_display = [sk['skill_name'] for sk in matched_skills if s_skill_weights.get(sk['category'], 0) >= 0.7]
            matched_interest_display = [it['interest_name'] for it in matched_interests if s_int_weights.get(it['category'], 0) >= 0.7]
            matched_subj_display = sorted([sub.title() for sub in matched_subj_set])

            explanation_factors: List[str] = []
            if matched_skill_display: explanation_factors.append('Strong skill alignment (' + str(len(matched_skill_display)) + ' skill(s)): ' + ', '.join(matched_skill_display))
            if matched_interest_display: explanation_factors.append('High interest domain match (' + str(len(matched_interest_display)) + ' interest(s)): ' + ', '.join(matched_interest_display))
            if matched_subj_display: explanation_factors.append('Aligned with favourite subject(s): ' + ', '.join(matched_subj_display))
            if not explanation_factors: explanation_factors.append('General alignment with foundational pathway criteria.')

            rule_breakdowns[sid] = {
                'stream_id': sid,
                'stream_name': sname,
                'description': sdesc,
                'rule_score': rule_score,
                'skill_match_score': round(skill_match_score, 2),
                'interest_match_score': round(interest_match_score, 2),
                'subject_match_score': round(subject_match_score, 2),
                'matched_skills': matched_skill_display or matched_skill_names,
                'matched_interests': matched_interest_display or matched_interest_names,
                'explanation_factors': explanation_factors,
            }

        # 2. Compute ML probabilities
        ml_probs_dict: Dict[str, float] = {}
        if self.ml_model is not None and total_valid > 0:
            sep = ';'
            prof_df = pd.DataFrame([{
                'subjects': sep.join(matched_subjects),
                'skills': sep.join(matched_skill_names),
                'interests': sep.join(matched_interest_names),
            }])
            try:
                m_probs = self.ml_model.predict_proba(prof_df)[0]
                classes = list(self.ml_model.classes_)
                for idx, c in enumerate(classes):
                    ml_probs_dict[c] = float(m_probs[idx])
            except Exception:
                ml_probs_dict = {sid: 1.0 / 12.0 for sid in rule_stream_scores}
        else:
            ml_probs_dict = {sid: 1.0 / 12.0 for sid in rule_stream_scores}

        # 3. Dynamic Adaptive Hybrid Weighting & Score Computation
        # If inputs are sparse, shift weight to Rule engine (0.85 Rule / 0.15 ML)
        if total_valid <= 2 or n_sks == 0 or n_ints == 0:
            w_rule, w_ml = 0.85, 0.15
        else:
            w_rule, w_ml = 0.50, 0.50

        hybrid_stream_results: List[Dict[str, Any]] = []
        for sid, bdata in rule_breakdowns.items():
            r_score = bdata['rule_score']
            m_prob = ml_probs_dict.get(sid, 1.0 / 12.0)
            h_score = round(w_rule * r_score + w_ml * (m_prob * 100.0), 2)

            item = dict(bdata)
            item['overall_match_score'] = h_score
            item['ml_probability'] = round(m_prob, 4)
            hybrid_stream_results.append(item)

        ranked_streams = sorted(hybrid_stream_results, key=lambda x: (-x['overall_match_score'], -x['subject_match_score'], x['stream_id']))

        # 4. Uncertainty & Status Analysis
        top1 = ranked_streams[0]
        top2 = ranked_streams[1] if len(ranked_streams) > 1 else top1

        m_prob_1 = top1['ml_probability']
        m_prob_2 = top2['ml_probability']
        delta_ml_p = max(0.0, m_prob_1 - m_prob_2)

        rule_score_1 = top1['rule_score']
        rule_score_2 = top2['rule_score']
        delta_rule_s = max(0.0, rule_score_1 - rule_score_2)

        uncertainty_score = round(1.0 - max(delta_ml_p, 0.05), 2)

        # Classify recommendation status
        if total_valid <= 2 or (n_subs == 0 and total_valid <= 3):
            recommendation_status = 'needs_more_information'
            uncertainty_reason = 'Insufficient student profile details provided to establish high confidence.'
        elif delta_rule_s < 10.0 and delta_ml_p < 0.12:
            recommendation_status = 'conflicting_evidence'
            uncertainty_reason = 'Close competing scores across multiple stream domains.'
        elif delta_ml_p < 0.25 or delta_rule_s < 20.0:
            recommendation_status = 'moderate_confidence'
            uncertainty_reason = 'Moderate alignment across primary criteria.'
        else:
            recommendation_status = 'high_confidence'
            uncertainty_reason = 'Strong clear alignment with target stream requirements.'

        # 5. Format Top Recommendations
        top_recommendations: List[Dict[str, Any]] = []
        for rank, sdata in enumerate(ranked_streams[:3], 1):
            rec_item = {
                'rank': rank,
                'stream_id': sdata['stream_id'],
                'stream_name': sdata['stream_name'],
                'description': sdata['description'],
                'score': sdata['overall_match_score'],
                'overall_match_score': sdata['overall_match_score'],
                'skill_match_score': sdata['skill_match_score'],
                'interest_match_score': sdata['interest_match_score'],
                'subject_match_score': sdata['subject_match_score'],
                'ml_probability': sdata['ml_probability'],
                'uncertainty': uncertainty_score,
                'recommendation_status': recommendation_status,
                'matched_skills': sdata['matched_skills'],
                'matched_interests': sdata['matched_interests'],
                'explanation_factors': sdata['explanation_factors'],
            }

            if rank == 1:
                rec_item['recommended_courses'] = self._get_courses_and_careers_for_stream(sdata['stream_id'])
            else:
                rec_item['recommended_courses'] = []

            top_recommendations.append(rec_item)

        follow_up_questions = self._generate_follow_up_questions(top_recommendations, missing_categories)
        student_name = profile.get('name') or profile.get('student_name') or 'Student'

        return {
            'student_profile': {
                'name': str(student_name),
                'subjects': matched_subjects,
                'skills': matched_skill_names,
                'interests': matched_interest_names,
                'unrecognized_inputs': unrecognized,
            },
            'recommendation_metadata': {
                'recommendation_status': recommendation_status,
                'uncertainty_score': uncertainty_score,
                'uncertainty_reason': uncertainty_reason,
                'missing_information': missing_categories,
                'follow_up_questions': follow_up_questions,
            },
            'recommendations': top_recommendations,
        }

    def get_recommendations(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        return self.recommend(profile)
