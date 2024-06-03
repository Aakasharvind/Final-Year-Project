from flask import make_response, render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE
from transplantAI.utils.common_functions import user_valid
from transplantAI.utils.kidney_rejection_prediction_utils import get_ckd_prediction
from .. import db


db = db.db
kidney_rejection_prediction = Blueprint("kidney_rejection_prediction", __name__)



# Kidney Rejection routes

@kidney_rejection_prediction.route("/kidney_rejection_prediction", methods=["GET"])
def kidney_rejection_prediction_():
    if user_valid(request=request):
        return render_template("kidney_rejection_prediction.html", name=request.cookies.get(FIRST_NAME_COOKIE), role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')

@kidney_rejection_prediction.route("/kidney_rejection_prediction", methods=["POST"])
def kidney_rejection_prediction_process():
    if user_valid(request=request):
        print(dict(request.form))
        return get_ckd_prediction(dict(request.form))
    return redirect('/login')
