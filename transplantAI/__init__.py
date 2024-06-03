from flask import Flask, render_template
from config import Config
from flask_pymongo import PyMongo
import os


db = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Common app configs
    # Cache control
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return response

    # 404 Error Page
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    # Connecting to database
    db.init_app(app)

    # Registering all the views in the views directory
    views_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "views")
    for view in os.listdir(views_dir):
        if view.startswith('__') or not view.endswith('.py'):
            continue
        
        module = __import__(
            f'{__name__}.views.{view[:-3]}',
            globals(),
            locals(),
            [view[:-3]]
        )

        blueprint = getattr(module, view[:-3])
        app.register_blueprint(blueprint)

    return app
