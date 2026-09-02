import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
# Synthetic Student Dataset Generator for Career Copilot ML Experimentation.
import random
import pandas as pd
from pathlib import Path
from app.services.data_service import DataService

STREAM_BROAD_PATHWAY = {
    'S01': 'Science',
    'S02': 'Science',
    'S03': 'Science',
    'S04': 'Commerce',
    'S05': 'Commerce',
    'S06': 'Humanities',
    'S07': 'Humanities',
    'S08': 'Other',
    'S09': 'Other',
    'S10': 'Other',
    'S11': 'Other',
    'S12': 'Humanities',
}

ARCHETYPES = [
    {
        'archetype': 'Engineering & Tech Aspirant',
        'stream_id': 'S01',
        'subjects': ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Applied Mathematics'],
        'skills': ['Logical Thinking', 'Problem Solving', 'Numerical Ability', 'Programming', 'System Architecture'],
        'interests': ['Technology', 'Engineering', 'Artificial Intelligence & Data', 'Cybersecurity & Networks', 'Robotics & Automation'],
    },
    {
        'archetype': 'Medical & Life Sciences Aspirant',
        'stream_id': 'S02',
        'subjects': ['Biology', 'Chemistry', 'Physics', 'Biotechnology', 'Psychology'],
        'skills': ['Observation', 'Diagnostic Acumen', 'Research', 'Analytical Thinking', 'Empathy'],
        'interests': ['Medicine & Healthcare', 'Biotechnology & Genetics', 'Pharmacy & Pharmacology', 'Science & Research', 'Public Health'],
    },
    {
        'archetype': 'Interdisciplinary STEM Aspirant',
        'stream_id': 'S03',
        'subjects': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
        'skills': ['Logical Thinking', 'Problem Solving', 'Research', 'Statistical Reasoning', 'Data Interpretation'],
        'interests': ['Science & Research', 'Biotechnology & Genetics', 'Artificial Intelligence & Data', 'Technology', 'Renewable Energy'],
    },
    {
        'archetype': 'Quantitative Finance & Business',
        'stream_id': 'S04',
        'subjects': ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'Applied Mathematics'],
        'skills': ['Numerical Ability', 'Financial Analysis', 'Budgeting', 'Analytical Thinking', 'Decision Making'],
        'interests': ['Finance & Accounting', 'Investments & Banking', 'Economics', 'Business & Entrepreneurship', 'E-Commerce & Digital Business'],
    },
    {
        'archetype': 'Business Operations & Trade',
        'stream_id': 'S05',
        'subjects': ['Accountancy', 'Business Studies', 'Economics', 'Marketing & Sales', 'Entrepreneurship'],
        'skills': ['Entrepreneurial Thinking', 'Negotiation', 'Operations Management', 'Customer Relations', 'Time Management'],
        'interests': ['Business & Entrepreneurship', 'Marketing & Brand Strategy', 'Supply Chain & Logistics', 'E-Commerce & Digital Business', 'Retail Operations'],
    },
    {
        'archetype': 'Liberal Arts & Governance',
        'stream_id': 'S06',
        'subjects': ['History', 'Political Science', 'Sociology', 'English Language & Literature', 'Philosophy'],
        'skills': ['Communication', 'Writing', 'Critical Evaluation', 'Active Listening', 'Rhetoric'],
        'interests': ['History & Culture', 'Public Policy & Governance', 'Government & Public Service', 'International Relations & Diplomacy', 'Languages & Literature'],
    },
    {
        'archetype': 'Creative Design & Visual Arts',
        'stream_id': 'S07',
        'subjects': ['Fine Arts', 'Graphic Design', 'Animation & VFX', 'Fashion Studies', 'English Language & Literature'],
        'skills': ['Creativity', 'Design Thinking', 'Visual Composition', 'Color Theory', 'Illustration'],
        'interests': ['Design & Visual Arts', 'Animation & Motion Graphics', 'Fashion & Apparel', 'Game Design & Interactive Media', 'Photography & Videography'],
    },
    {
        'archetype': 'Applied Tech & Vocational Trades',
        'stream_id': 'S08',
        'subjects': ['Computer Science', 'Electronics', 'Robotics', 'Engineering Graphics', 'Web Development'],
        'skills': ['Troubleshooting & Debugging', 'Technology Aptitude', 'Circuit Design', 'Hardware Diagnostics', 'CAD Modeling'],
        'interests': ['Technology', 'Robotics & Automation', 'Renewable Energy', 'Architecture & Built Environment', 'Applied Trades'],
    },
    {
        'archetype': 'Agriculture & Environmental Sciences',
        'stream_id': 'S09',
        'subjects': ['Agriculture', 'Environmental Science', 'Biology', 'Chemistry', 'Economics'],
        'skills': ['Observation', 'Research', 'Data Interpretation', 'Risk Assessment', 'Project Management'],
        'interests': ['Environmental Studies & Sustainability', 'Science & Research', 'Renewable Energy', 'Agriculture & Forestry', 'Public Health'],
    },
    {
        'archetype': 'Legal & Public Administration',
        'stream_id': 'S10',
        'subjects': ['Legal Studies', 'Political Science', 'History', 'English Language & Literature', 'Economics'],
        'skills': ['Rhetoric', 'Negotiation', 'Contract Negotiation', 'Critical Evaluation', 'Compliance & Ethics'],
        'interests': ['Law', 'Public Policy & Governance', 'Human Rights & Advocacy', 'Government & Public Service', 'International Relations & Diplomacy'],
    },
    {
        'archetype': 'Paramedical & Allied Health',
        'stream_id': 'S11',
        'subjects': ['Biology', 'Chemistry', 'Community Health', 'Medical Diagnostics', 'Nutrition & Dietetics'],
        'skills': ['Diagnostic Acumen', 'Empathy', 'Customer Relations', 'Active Listening', 'Teamwork'],
        'interests': ['Nursing & Patient Care', 'Nutrition & Dietetics', 'Physiotherapy', 'Public Health', 'Mental Health & Wellbeing'],
    },
    {
        'archetype': 'Media & Digital Broadcasting',
        'stream_id': 'S12',
        'subjects': ['Mass Media Studies', 'Creative Writing', 'Film Studies', 'English Language & Literature', 'Sociology'],
        'skills': ['Storytelling', 'Scriptwriting', 'Public Speaking', 'Editing & Proofreading', 'Copywriting'],
        'interests': ['Journalism & Mass Media', 'Media & Communication', 'Film & Cinematography', 'Music & Audio Arts', 'Photography & Videography'],
    },
]

def generate_synthetic_profiles(num_samples_per_archetype: int = 50, random_seed: int = 42) -> pd.DataFrame:
    random.seed(random_seed)
    rows = []
    counter = 1
    for arch in ARCHETYPES:
        sid = arch['stream_id']
        broad_pathway = STREAM_BROAD_PATHWAY[sid]
        arch_name = arch['archetype']
        subj_pool = arch['subjects']
        sk_pool = arch['skills']
        int_pool = arch['interests']

        for _ in range(num_samples_per_archetype):
            num_subs = random.randint(2, min(4, len(subj_pool)))
            num_sks = random.randint(2, min(4, len(sk_pool)))
            num_ints = random.randint(2, min(4, len(int_pool)))

            sel_subs = random.sample(subj_pool, num_subs)
            sel_sks = random.sample(sk_pool, num_sks)
            sel_ints = random.sample(int_pool, num_ints)

            if random.random() < 0.10:
                other_arch = random.choice([a for a in ARCHETYPES if a['stream_id'] != sid])
                sel_ints.append(random.choice(other_arch['interests']))

            sep = ';'
            rows.append({
                'student_id': f'STU{counter:04d}',
                'student_name': f'Student_{counter}',
                'subjects': sep.join(sel_subs),
                'skills': sep.join(sel_sks),
                'interests': sep.join(sel_ints),
                'target_stream_id': sid,
                'target_broad_pathway': broad_pathway,
                'archetype': arch_name,
            })
            counter += 1

    df = pd.DataFrame(rows)
    return df

if __name__ == '__main__':
    output_path = Path(__file__).parent / 'synthetic_student_dataset.csv'
    df_synthetic = generate_synthetic_profiles(num_samples_per_archetype=50, random_seed=42)
    df_synthetic.to_csv(output_path, index=False)
    print(f'Generated {len(df_synthetic)} synthetic student profiles at {output_path}')
