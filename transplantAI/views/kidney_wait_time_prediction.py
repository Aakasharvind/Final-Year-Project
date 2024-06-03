from flask import make_response, render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE, SESSION_COOKIE
from transplantAI.utils.common_functions import user_valid
from transplantAI.utils.kidney_wait_time_prediction_utils import predict_wait_time
from .. import db


db = db.db
kidney_wait_time_prediction = Blueprint("kidney_wait_time_prediction", __name__)


# AI Chatbot routes

@kidney_wait_time_prediction.route("/kidney_wait_time_prediction", methods=["GET"])
def kidney_wait_time_prediction_():
    if user_valid(request=request):
        return render_template("kidney_wait_time_prediction.html", name=request.cookies.get(FIRST_NAME_COOKIE), role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')


@kidney_wait_time_prediction.route("/kidney_wait_time_prediction", methods=["POST"])
def get_wait_time():
    return predict_wait_time(request.form)
