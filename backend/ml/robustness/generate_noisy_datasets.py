# Script for generating noisy datasets to evaluate ML robustness.
import sys
import random
import pandas as pd
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from ml.data.generate_synthetic_dataset import ARCHETYPES, STREAM_BROAD_PATHWAY, generate_synthetic_profiles
from app.services.data_service import DataService

def generate_noisy_dataset(noise_level: float = 0.0, num_samples_per_archetype: int = 50, random_seed: int = 42) -> pd.DataFrame:
    random.seed(random_seed)
    ds = DataService()
    all_subjects = ds.get_subjects()['subject_name'].tolist()
    all_skills = ds.get_skills()['skill_name'].tolist()
    all_interests = ds.get_interests()['interest_name'].tolist()
    all_streams = list(STREAM_BROAD_PATHWAY.keys())

    base_df = generate_synthetic_profiles(num_samples_per_archetype=num_samples_per_archetype, random_seed=random_seed)
    noisy_rows = []

    for _, row in base_df.iterrows():
        r_dict = row.to_dict()
        subs = str(r_dict['subjects']).split(';')
        sks = str(r_dict['skills']).split(';')
        ints = str(r_dict['interests']).split(';')
        target_sid = r_dict['target_stream_id']

        if noise_level > 0.0:
            if random.random() < noise_level and subs:
                subs[random.randint(0, len(subs) - 1)] = random.choice(all_subjects)
            if random.random() < noise_level and sks:
                sks[random.randint(0, len(sks) - 1)] = random.choice(all_skills)
            if random.random() < noise_level and ints:
                ints[random.randint(0, len(ints) - 1)] = random.choice(all_interests)
            if random.random() < (noise_level / 2.0):
                target_sid = random.choice(all_streams)

        sep = ';'
        r_dict['subjects'] = sep.join(subs)
        r_dict['skills'] = sep.join(sks)
        r_dict['interests'] = sep.join(ints)
        r_dict['target_stream_id'] = target_sid
        r_dict['target_broad_pathway'] = STREAM_BROAD_PATHWAY[target_sid]
        noisy_rows.append(r_dict)

    return pd.DataFrame(noisy_rows)

def generate_all_noise_datasets():
    out_dir = Path(__file__).parent
    noise_levels = [0.0, 0.10, 0.20, 0.30]
    for n_level in noise_levels:
        n_pct = int(n_level * 100)
        df_noise = generate_noisy_dataset(noise_level=n_level, num_samples_per_archetype=50, random_seed=200 + n_pct)
        out_file = out_dir / f'dataset_noise_{n_pct}pct.csv'
        df_noise.to_csv(out_file, index=False)
        print(f'Generated noise dataset ({n_pct} pct noise): {len(df_noise)} rows at {out_file}')

if __name__ == '__main__':
    generate_all_noise_datasets()