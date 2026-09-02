"""Data service layer for loading and accessing Career Copilot dataset CSV files."""

from pathlib import Path
from typing import Dict, Optional, Union
import pandas as pd


class DataService:
    """Service responsible for loading, storing, and retrieving dataset DataFrames.

    Dataset CSV files are loaded from the backend raw data directory.
    Paths are resolved using pathlib relative to the application base directory.
    """

    REQUIRED_FILES = [
        "streams.csv",
        "subjects.csv",
        "skills.csv",
        "interests.csv",
        "courses.csv",
        "careers.csv",
        "stream_recommendation_rules.csv",
        "course_career_mapping.csv",
    ]

    def __init__(
        self,
        data_dir: Optional[Union[str, Path]] = None,
        auto_load: bool = True,
    ) -> None:
        """Initialize the DataService.

        Args:
            data_dir: Optional custom path to the raw data directory.
                      Defaults to 'backend/data/raw' relative to this file location.
            auto_load: If True, automatically loads all CSV files on initialization.
        """
        if data_dir is None:
            # Resolve default path relative to this file: app/services/data_service.py -> backend/data/raw
            self.data_dir: Path = (
                Path(__file__).resolve().parent.parent.parent / "data" / "raw"
            )
        else:
            self.data_dir = Path(data_dir).resolve()

        self._dataframes: Dict[str, pd.DataFrame] = {}

        if auto_load:
            self.load_all_data()

    def _resolve_file_path(self, filename: str) -> Path:
        """Resolve path for a CSV file inside data_dir or its subdirectories.

        Args:
            filename: Name of the CSV file.

        Returns:
            Path object pointing to the existing file.

        Raises:
            FileNotFoundError: If the file cannot be located with a clear error message.
        """
        direct_path = self.data_dir / filename
        if direct_path.is_file():
            return direct_path

        # Check inside subdirectories (e.g., career_copilot_expanded_dataset)
        if self.data_dir.is_dir():
            for sub_path in self.data_dir.rglob(filename):
                if sub_path.is_file():
                    return sub_path

        raise FileNotFoundError(
            "Missing required CSV dataset file '%s' in directory '%s'. "
            "Please ensure all required CSV files are placed in '%s'."
            % (filename, self.data_dir, self.data_dir)
        )

    def load_all_data(self) -> None:
        """Load all required dataset CSV files into memory as pandas DataFrames.

        Raises:
            FileNotFoundError: If any required CSV file is missing.
            RuntimeError: If an error occurs while reading a CSV file.
        """
        for filename in self.REQUIRED_FILES:
            file_path = self._resolve_file_path(filename)
            try:
                df = pd.read_csv(file_path)
                key = (
                    filename[:-4] if filename.endswith(".csv") else filename
                )
                self._dataframes[key] = df
            except Exception as e:
                if isinstance(e, FileNotFoundError):
                    raise
                raise RuntimeError(
                    "Failed to load dataset CSV file '%s' from '%s': %s"
                    % (filename, file_path, str(e))
                ) from e

    def _get_dataframe(self, key: str) -> pd.DataFrame:
        """Internal helper to retrieve a loaded DataFrame.

        Args: 
            key: Name key of the DataFrame (without .csv extension).

        Returns:
            pandas DataFrame.

        Raises:
            KeyError: If data has not been loaded yet.
        """
        if key not in self._dataframes:
            raise KeyError(
                "Data key '%s' is not loaded. Please call load_all_data() first."
                % key
            )
        return self._dataframes[key]

    def get_streams(self) -> pd.DataFrame:
        """Retrieve the streams DataFrame."""
        return self._get_dataframe("streams")

    def get_subjects(self) -> pd.DataFrame:
        """Retrieve the subjects DataFrame."""
        return self._get_dataframe("subjects")

    def get_skills(self) -> pd.DataFrame:
        """Retrieve the skills DataFrame."""
        return self._get_dataframe("skills")

    def get_interests(self) -> pd.DataFrame:
        """Retrieve the interests DataFrame."""
        return self._get_dataframe("interests")

    def get_courses(self) -> pd.DataFrame:
        """Retrieve the courses DataFrame."""
        return self._get_dataframe("courses")

    def get_careers(self) -> pd.DataFrame:
        """Retrieve the careers DataFrame."""
        return self._get_dataframe("careers")

    def get_stream_recommendation_rules(self) -> pd.DataFrame:
        """Retrieve the stream recommendation rules DataFrame."""
        return self._get_dataframe("stream_recommendation_rules")

    def get_course_career_mapping(self) -> pd.DataFrame:
        """Retrieve the course career mapping DataFrame."""
        return self._get_dataframe("course_career_mapping")
