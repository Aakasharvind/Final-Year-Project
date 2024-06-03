from flask import render_template, request, redirect, Blueprint
from transplantAI.constants import FIRST_NAME_COOKIE, ROLE_COOKIE, SESSION_COOKIE
from transplantAI.utils.chatbot_utils import chatbot_response
from transplantAI.utils.common_functions import user_valid
from .. import db


db = db.db
chatbot = Blueprint("chatbot", __name__)
introduction = "Ask all your questions related to kidney transplantations."



@chatbot.route("/chatbot", methods=["GET"])
def chatbot_():
    if user_valid(request=request):
        return render_template("chatbot.html", name=request.cookies.get(FIRST_NAME_COOKIE), initial_chat_response=introduction, role=request.cookies.get(ROLE_COOKIE))
    return redirect('/login')


@chatbot.route("/chatbot", methods=["POST"])
def chatbot__():
    if user_valid(request=request):
        data  = dict(request.form)
        print(data)
        if data['user_query']:
            return chatbot_response(data['user_query'])
        return ""            
    return redirect('/login')

