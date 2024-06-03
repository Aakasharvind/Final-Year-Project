from flask import make_response, render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE
from transplantAI.utils.common_functions import user_valid
from .. import db


db = db.db
dashboard = Blueprint("dashboard", __name__)



# Dashborad routes

@dashboard.route("/dashboard", methods=["GET"])
def dashboard_():
    if user_valid(request=request):
        return render_template("dashboard.html", name=request.cookies.get(FIRST_NAME_COOKIE), role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')
