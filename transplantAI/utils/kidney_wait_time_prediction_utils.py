import numpy as np
import pandas as pd
import pickle
import os

categorical_columns = ['gender', 'blood_gp', 'age_cat', 'cPRA_cat', 'gestation', 'prior_transplant', 'underlying_disease']
prediction_columns = ['age_at_list_registration', 'gender', 'dialysis_duration', 'blood_gp', 'age_cat', 'cPRA', 'HLA_A1', 'HLA_A2', 'HLA_B1',
                      'HLA_B2', 'HLA_DR1', 'HLA_DR2', 'cPRA_cat', 'gestation', 'prior_transplant', 'underlying_disease', 
                      'number_prior_transplant', 'if_transplanted', 'duration', 'log_time_on_Dialysis']
classification_columns = ['gender', 'underlying_disease', 'blood_gp', 'age_cat', 'cPRA_cat']


label_encoders = {}
scaler = pickle.load(open('models/kidney_wait_time_prediction/scaler.pkl', 'rb'))

for cols in categorical_columns:
    label_encoders[cols] = pickle.load(open(f'models/kidney_wait_time_prediction/{cols}_label_encoder.pkl', 'rb'))


def get_cox_model():
    return pickle.load(open('models/kidney_wait_time_prediction/coxph.pkl', 'rb'))


def process_input_args(input_data):
    input_df = pd.DataFrame(input_data)
    input_subset_df = input_df[prediction_columns] 
    for col in categorical_columns:
        input_subset_df[col] = label_encoders[col].transform(input_subset_df[col])

    data = pd.DataFrame(scaler.transform(input_subset_df))
    data.columns = input_subset_df.columns
    return data


def predict_waiting_time(input_parameters):
    predicted_partial_hazard = get_cox_model().predict_partial_hazard(input_parameters)
    predicted_survival_prob = np.exp(-predicted_partial_hazard)
    expected_transplant_time = -np.log(predicted_survival_prob)
    expected_transplant_time_array = expected_transplant_time.to_numpy()
    return [time for time in expected_transplant_time_array]


def predict_wait_time(parameters):
    if parameters:
        args = parameters.to_dict() 
        input_data = { parameter: [(int(args[parameter]) if args[parameter].isnumeric() else args[parameter])] for parameter in prediction_columns }
        processed_input = process_input_args(input_data)
        wait_time_list = list(processed_input.apply(lambda row: predict_waiting_time(row), axis=1))
        return str(round(wait_time_list[0][0], 2))
    return "Server Error!"
