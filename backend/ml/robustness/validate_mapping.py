# Validation and Test Script for Course Career Mapping Repair.
import sys, pathlib, pandas as pd
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from app.services.data_service import DataService
from app.services.recommendation_service import RecommendationService

def run_validation():
    ds = DataService()
    courses = ds.get_courses()
    careers = ds.get_careers()
    mapping = ds.get_course_career_mapping()

    all_cids = set(courses['course_id'])
    all_carids = set(careers['career_id'])
    map_cids = set(mapping['course_id'])
    map_carids = set(mapping['career_id'])

    assert map_cids.issubset(all_cids), 'Validation Error: Some course_ids do not exist in courses.csv'
    assert map_carids.issubset(all_carids), 'Validation Error: Some career_ids do not exist in careers.csv'

    dup_count = mapping.duplicated(subset=['course_id', 'career_id']).sum()
    assert dup_count == 0, 'Validation Error: Found duplicate course-career pairs'

    counts_per_course = mapping.groupby('course_id').size()
    min_careers = counts_per_course.min()
    assert min_careers >= 3, 'Validation Error: Minimum mapped careers per course < 3'
    assert len(map_cids) == len(courses), 'Validation Error: Not all courses have mappings'

    print('=== TASK 6 VALIDATION PASSED SUCCESSFULLY ===')
    print('  - All course_ids exist in courses.csv: YES')
    print('  - All career_ids exist in careers.csv: YES')
    print('  - Duplicate pairs: 0')
    print('  - Mapped courses count:', len(map_cids), '/', len(courses))
    print('  - Minimum mapped careers per course:', min_careers)

    careers_by_id = {row['career_id']: (row['career_name'], row['domain']) for _, row in careers.iterrows()}
    c001_careers = []

    print('')
    print('=== TASK 7: FINAL CAREERS FOR C001 - C005 ===')
    for cid in ['C001', 'C002', 'C003', 'C004', 'C005']:
        cname = courses[courses['course_id'] == cid]['course_name'].values[0]
        c_maps = mapping[mapping['course_id'] == cid]['career_id'].tolist()
        print('')
        print(cid + ': ' + cname)
        for car_id in c_maps:
            c_title, c_dom = careers_by_id[car_id]
            print('  - ' + car_id + ': ' + c_title + ' [' + c_dom + ']')
            if cid == 'C001':
                c001_careers.append(c_title.lower())

    for prohibited in ['pharmacist', 'physiotherapist', 'dentist']:
        assert not any(prohibited in title for title in c001_careers), 'C001 contains prohibited career'
    print('')
    print('Verified C001 does NOT contain Pharmacist, Physiotherapist, or Dentist: PASSED!')

    print('')
    print('=== TASK 8: AARAV PATEL RECOMMENDATION RESULT ===')
    rec_service = RecommendationService(data_service=ds)
    aarav_profile = {
        'name': 'Aarav Patel',
        'favourite_subjects': ['Mathematics', 'Physics', 'Chemistry'],
        'skills': ['Logical Thinking', 'Problem Solving', 'Numerical Ability'],
        'interests': ['Technology', 'Engineering', 'Artificial Intelligence & Data'],
    }

    res = rec_service.recommend(aarav_profile)
    top1_rec = res['recommendations'][0]
    print('Recommended Stream Rank #1:', top1_rec['stream_name'], '(Score: ' + str(top1_rec['score']) + ')')
    print('Status:', top1_rec['recommendation_status'])

    print('')
    print('Top Recommended Courses & Careers for Aarav Patel:')
    for c_item in top1_rec['recommended_courses']:
        print('  Course: ' + c_item['course_name'] + ' (' + c_item['course_id'] + ')')
        for car in c_item['related_careers']:
            print('    -> Career: ' + car['career_name'] + ' [' + car['domain'] + ']')

if __name__ == '__main__':
    run_validation()
