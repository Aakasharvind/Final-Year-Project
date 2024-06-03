from flask import render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE, SESSION_COOKIE
from transplantAI.utils.common_functions import user_valid
from .. import db


db = db.db
patient_report = Blueprint("patient_report", __name__)


def get_all_patient_data():
    if db is not None:
        return list(db.user_data.find({}, {"_id": 0, "password": 0, "session_key": 0, "appointments": 0, "medical_data": 0}))
    return []

def get_complete_patient_data(username):
    if db is not None:
        # return db.user_data.find_one({}, {"_id": 0, "password": 0, "session_key": 0,"username":username})
         data = db.user_data.find_one({"username":username}, {"_id": 0, "password": 0, "session_key": 0})
         print(data)
         return data
    return []

@patient_report.route("/patient_report", methods=["GET"])
def patient_report_():
    if user_valid(request=request):
        patient_data = get_all_patient_data()
        return render_template("patient_report.html", name=request.cookies.get(FIRST_NAME_COOKIE), patient_data=patient_data, role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')

@patient_report.route("/complete_data", methods=["GET"])
def complete_data_():
    if user_valid(request=request):
        username = request.args.get('username', False)
        if username:
            patient_data = get_complete_patient_data(username)
            mental_health_assessment_data = {}
            if patient_data and 'mental_health_assessment' in patient_data:
                mental_health_assessment_data = patient_data['mental_health_assessment']
            return render_template("patient_data.html", name=request.cookies.get(FIRST_NAME_COOKIE), patient_data=patient_data,mental_health_assessment_data=mental_health_assessment_data)
        return "Error Try again!"

    return redirect('/login')
