import uuid
from flask import make_response, render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE, SESSION_COOKIE, USERNAME_COOKIE
from transplantAI.utils.common_functions import user_valid
from .. import db


db = db.db
schedule = Blueprint("schedule", __name__)



def get_user_appointments(username):
    if db is not None:
        user_appointments = db.user_data.find_one({'username': username})['appointments']
        return user_appointments
    return False


def get_all_appointments():
    if db is not None:
        user_appointments = []
        raw_data = list(db.user_data.find({}, {'appointments': 1, '_id': 0}))
        for row in raw_data:
            if 'appointments' in row and len(row['appointments']):
                user_appointments.extend(row['appointments'])

        return user_appointments
    return False

def add_new_event(username, event_details):
    event_details['id'] = uuid.uuid4().hex
    event_details['start'] += ':00.00'
    event_details['end'] += ':00.00'
    if db is not None:
        user_appointments = db.user_data.update_one({'username': username}, {'$push': {'appointments': event_details}})
        return user_appointments
    return False

def delete_new_event(username, event_details):
    if db is not None:
        user_appointments = db.user_data.update_one({'username': username}, {'$pull': {'appointments': {'id': event_details['id']}}})
        return user_appointments
    return False




# AI Chatbot routes

@schedule.route("/schedule", methods=["GET"])
def schedule_():
    if user_valid(request=request):
        return render_template("schedule.html", name=request.cookies.get(FIRST_NAME_COOKIE), role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')


@schedule.route("/get_all_schedule", methods=["GET"])
def get_user_schedule_():
    if user_valid(request=request): 
        return get_all_appointments()
    else:
        return redirect("/login")
    

@schedule.route("/get_user_schedule", methods=["GET"])
def get_user_appointments_():
    if user_valid(request=request): 
        return get_user_appointments(request.cookies.get(USERNAME_COOKIE))
    else:
        return redirect("/login")

    
@schedule.route("/add_new_event", methods=["POST"])
def add_new_event_():
    if user_valid(request=request): 
        if add_new_event(request.cookies.get(USERNAME_COOKIE), dict(request.form)):
            return redirect("/schedule")
        else:
            return "DB Error!"
    else:
        return redirect("/login")


@schedule.route("/delete_user_events", methods=["POST"])
def delete_new_event_():
    if user_valid(request=request): 
        if delete_new_event(request.cookies.get(USERNAME_COOKIE), dict(request.form)):
            return redirect("/schedule")
        else:
            return "DB Error!"
    else:
        return redirect("/login")

