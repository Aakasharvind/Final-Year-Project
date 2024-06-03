import os
from keras import models 
import pickle
import numpy as np
import pandas as pd

models_dir = 'models/kidney_rejection_prediction/'
cat_cols = ['red_blood_cells', 'pus_cell', 'pus_cell_clumps', 'bacteria', 'hypertension', 
            'diabetes_mellitus', 'coronary_artery_disease', 'appetite', 'peda_edema', 'aanemia' ]

# print("_______________Meta loaded1------------------------")
meta_learner = pickle.load(open('models/kidney_rejection_prediction/meta_learner.pkl', 'rb'))
# print("_______________Meta loaded------------------------")


def load_custom_cnn():
    members = []
    for model_name in os.listdir(models_dir):
        # print(os.path.join(models_dir, model_name))
        if model_name.endswith(".h5"): 
            members.append( models.load_model(os.path.join(models_dir, model_name)) )
    # print("_______________CNN loaded------------------------")
    return members

def load_label_encoders():
    encoders = {}
    for model_name in os.listdir(models_dir):
        if model_name.endswith(".pkl"): 
            pkl_file = open(os.path.join(models_dir, model_name), 'rb')
            encoders[model_name] = pickle.load(pkl_file)
            pkl_file.close()

    # print("_______________Encoder loaded------------------------")
    return encoders


def process_input(input_parameters):
    df = pd.DataFrame([input_parameters])
    for col in input_parameters:
        if col not in cat_cols:
            df[col] = df[col].apply(np.float32)
        else:
            df[col] = encoders['le_'+col+'.pkl'].transform(df[col])
    return df


def stacked_dataset(members, input_params):
    stacked_input = None
    for model in members:
        # make prediction
        yhat = model.predict(input_params, verbose=0)
        # stack predictions into [rows, members, probabilities]
        if stacked_input is None:
            stacked_input = yhat #
        else:
            stacked_input = np.dstack((stacked_input, yhat))
    # flatten predictions to [rows, members x probabilities]
    stacked_input = stacked_input.reshape((stacked_input.shape[0], stacked_input.shape[1]*stacked_input.shape[2]))
    return stacked_input


# make a prediction with the stacked model
def stacked_prediction(members, model, input_parameters):
    # create dataset using ensemble
    stacked_input = stacked_dataset(members, input_parameters)
    # make a prediction
    yhat = model.predict(stacked_input)
    return yhat


cnn_models = load_custom_cnn()
encoders = load_label_encoders()
def get_ckd_prediction(input_parameters):
    if input_parameters['pus_cell'] == 'normal':
        return 'Prediction: NO PKTR'
    pred = stacked_prediction(cnn_models, meta_learner, process_input(input_parameters)).ravel()
    # print(pred, '----------------1---------------------------')
    # prediction = encoders['le_class.pkl'].transform(pred)
    # print(prediction, '-------------------------------2-----------------------')
    if pred[0] == 0:
        return 'Prediction: PKTR'
    else:
        return 'Prediction: NO PKTR'
    # return stacked_prediction(cnn_models, meta_learner, process_input(input_parameters))


test = {
    "aanemia": "no",
    "age": "58.0",
    "albumin": "0",
    "appetite": "good",
    "bacteria": "notpresent",
    "blood_glucose_random": "140.0",
    "blood_urea": "49.0",
    "bp": "80.0",
    "coronary_artery_disease": "no",
    "diabetes_mellitus": "no",
    "haemoglobin": "15.7",
    "hypertension": "no",
    "packed_cell_volume": "47",
    "peda_edema": "no",
    "potassium": "4.9",
    "pus_cell": "normal",
    "pus_cell_clumps": "notpresent",
    "red_blood_cell_count": "4.9",
    "red_blood_cells": "normal",
    "serum_creatinine": "0.5",
    "sodium": "150.0",
    "specific_gravity": "1.025",
    "sugar": "0",
    "white_blood_cell_count": "6700"
}
test2 = {
    "aanemia": "yes",
    "age": "55",
    "albumin": "1",
    "appetite": "poor",
    "bacteria": "notpresent",
    "blood_glucose_random": "140",
    "blood_urea": "49",
    "bp": "80",
    "coronary_artery_disease": "yes",
    "diabetes_mellitus": "yes",
    "haemoglobin": "15.7",
    "hypertension": "no",
    "packed_cell_volume": "44",
    "peda_edema": "no",
    "potassium": "4.9",
    "pus_cell": "abnormal",
    "pus_cell_clumps": "present",
    "red_blood_cell_count": "4.9",
    "red_blood_cells": "normal",
    "serum_creatinine": "0.5",
    "sodium": "150.0",
    "specific_gravity": "1.020",
    "sugar": "0",
    "white_blood_cell_count": "6700"
}
print(get_ckd_prediction(test), 'test1')
print(get_ckd_prediction(test2), 'test2')