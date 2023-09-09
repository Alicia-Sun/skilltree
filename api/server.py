from typing import Any
from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient, InsertOne
import json
import uuid


app = Flask(__name__)



client = MongoClient("mongodb+srv://skilltree:skilltree@skilltree.mm3cfn3.mongodb.net/?retryWrites=true&w=majority")
db = client['SkillTreeDB']




# \     POST/GET
# \     generate/login/logout/path/node/signup
# \     <id>


# @app.route("/generate", methods=["POST"])
# def generate():
    # pass

@app.route("/login", methods=["POST"])
def login():
    content = request.json
    users = db["users"]
    sessions = db["sessions"]

    user = users.find_one({"phone": content["phone"]})
    if user is None:
        return {"success": False}

    if user["password"] != content["password"]:
        return {"success": False}

    sessid = uuid.uuid4()
    session = sessions.insert_one({"user_id": user["_id"], "id": str(sessid)})
    resp = make_response({"success": True})
    resp.set_cookie("session", str(sessid))

    return resp

@app.route("/logout", methods=["POST"])
def logout():
    content = request.json
    sessions = db["sessions"]
    session = sessions.find_one({"id": content["session"]})

    if session is None:
        resp = make_response({"success": False})
    else:
        sessions.delete_one({"id": content["session"]})
        resp = make_response({"success": True})

    resp.set_cookie("session", "", expires=0)
    return resp

# @app.route("/path/<int:id>", methods=["GET", "POST"])
# def path():
    # pass

# @app.route("/node/<int:id>", methods=["POST"])
# def node():
    # pass

@app.route("/signup", methods=["POST"])
def signup():
    content = request.json
    collection = db['users']
    requesting = []
    requesting.append(InsertOne(content))
    result = collection.bulk_write(requesting)
    return {"success": True}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
