from transplantAI.constants import FIRST_NAME_COOKIE, SESSION_COOKIE, USERNAME_COOKIE
from .. import db


db = db.db


def get_user_session_key(username):
    if db is not None:
        return db.user_data.find_one({"username": username})["session_key"]
    return False


def user_valid(request):
    if (
        request.cookies.get(USERNAME_COOKIE) != None
        and request.cookies.get(SESSION_COOKIE) != None
        and request.cookies.get(FIRST_NAME_COOKIE) != None
    ):
        return get_user_session_key(
            username=request.cookies.get(USERNAME_COOKIE)
        ) == request.cookies.get(SESSION_COOKIE)
    return False
