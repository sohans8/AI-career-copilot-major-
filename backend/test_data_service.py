from app.services.data_service import DataService


def main():
    data_service = DataService()

    print("Dataset loaded successfully!\n")

    print("Streams:", len(data_service.get_streams()))
    print("Subjects:", len(data_service.get_subjects()))
    print("Skills:", len(data_service.get_skills()))
    print("Interests:", len(data_service.get_interests()))
    print("Courses:", len(data_service.get_courses()))
    print("Careers:", len(data_service.get_careers()))
    print("Recommendation Rules:", len(
        data_service.get_stream_recommendation_rules()
    ))
    print("Course-Career Mappings:", len(
        data_service.get_course_career_mapping()
    ))


if __name__ == "__main__":
    main()