from hashlib import sha512
import uuid
import random
from flask import make_response, render_template, request, redirect, Blueprint
from transplantAI.constants import (
    DASHBOARD_URL,
    DATABASE_CONNECTION_ERROR_MSG,
    FIRST_NAME_COOKIE,
    LOGIN_ERROR_MSG,
    ROLE_COOKIE,
    SESSION_COOKIE,
    USERNAME_COOKIE,
    BLOCKCHAIN_URL
)
from transplantAI.utils.common_functions import user_valid
import requests
from .. import db


db = db.db
auth = Blueprint("auth", __name__)


def validate_user(user_information):
    user_data = db.user_data.find_one({"username": user_information["username"]})
    if (
        user_data
        and str(sha512(user_information["password"].encode()).hexdigest())
        == user_data["password"]
    ):
        return user_data["first_name"], user_data["role"]
    return False, ""


def update_user_session_key(username, session_key):
    response = db.user_data.update_one(
        {"username": username}, {"$set": {"session_key": session_key}}
    )
    return response.matched_count == 1


def set_new_session_key():
    user_session_key = uuid.uuid4().hex
    if update_user_session_key(
        username=request.form["username"], session_key=user_session_key
    ):
        return user_session_key
    return False


def set_cookies(session_key, user_first_name, role):
    if session_key:
        response = make_response(redirect(DASHBOARD_URL))
        response.set_cookie(USERNAME_COOKIE, request.form["username"])
        response.set_cookie(FIRST_NAME_COOKIE, user_first_name)
        response.set_cookie(SESSION_COOKIE, session_key)
        response.set_cookie(ROLE_COOKIE, role)
        return response


def add_new_user(user_information):
    user_information = dict(user_information)
    del user_information["rpassword"]
    user_information["password"] = str(
        sha512(user_information["password"].encode()).hexdigest()
    )
    user_information["session_key"] = uuid.uuid4().hex
    user_information["appointments"] = []
    user_information["medical_data"] = {}
    if db is not None:
        db.user_data.insert_one(dict(user_information))

        try:
            data = {
                'user' : 'Patient',
                'fullname' : user_information['first_name']+user_information['last_name'],
                'age' : str(random.randint(20,60)),
                'gender' : random.choice(['Male','Female']),
                'medical_id' : user_information['username'],
                'blood_type' : random.choice(['O+','O-','A+','A-','AB+','AB-']),
                'organ' : random.choice(['Left Kidney','Right Kidney']),
                'weight' : str(random.randint(30,120)),
                'height' : str(random.randint(130,230))
            }
            response = requests.post(BLOCKCHAIN_URL+'/register',data=data)
            print(response.json())

        except Exception:
            print('Blockchain err!!!')
        return True
    print("Cannot connect to database!")
    return False


# Authentication routes


# New user creation route
@auth.route("/register_user", methods=["GET"])
def register_user():
    if user_valid(request=request):
        return redirect(DASHBOARD_URL)
    return render_template("register.html", page_title="TransplantAI - Register")


@auth.route("/register_user", methods=["POST"])
def register_new_user():
    if add_new_user(user_information=request.form):
        session_key = set_new_session_key()
        if session_key:
            return set_cookies(
                session_key=session_key, user_first_name=request.form["first_name"], role=""
            )
    return render_template(
        "login.html",
        page_title="TransplantAI - Login",
        login_error_message=DATABASE_CONNECTION_ERROR_MSG,
    )


# Logout route
@auth.route("/logout")
def logout_user():
    response = make_response(redirect("/login"))
    update_user_session_key(
        username=request.cookies.get(USERNAME_COOKIE), session_key=""
    )
    response.set_cookie(USERNAME_COOKIE, "", expires=0)
    response.set_cookie(FIRST_NAME_COOKIE, "", expires=0)
    response.set_cookie(SESSION_COOKIE, "", expires=0)
    return response


# Login routes
@auth.route("/login", methods=["GET"])
def login():
    if user_valid(request=request):
        return redirect(DASHBOARD_URL)
    return render_template(
        "login.html", page_title="TransplantAI - Login", login_error_message=""
    )


@auth.route("/login", methods=["POST"])
def login_user():
    user_first_name, role = validate_user(user_information=request.form)
    if user_first_name:
        session_key = set_new_session_key()
        return set_cookies(session_key=session_key, user_first_name=user_first_name, role=role)
    
    return render_template(
        "login.html",
        page_title="TransplantAI - Login",
        login_error_message=LOGIN_ERROR_MSG,
    )
