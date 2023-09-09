from flask import Flask, request, jsonify
from pymongo import MongoClient, InsertOne
import json


app = Flask(__name__)



client = MongoClient("mongodb://localhost:27017")
myDB = client['SkillTreeDB']




# \     POST/GET
# \     generate/login/logout/path/node/signup
# \     <id>


@app.route("/generate", methods=["POST"])
def generate():
    pass

@app.route("/login", methods=["POST"])
def login():
    pass

@app.route("/logout", methods=["POST"])
def logout():
    pass

@app.route("/path/<int:id>", methods=["GET", "POST"])
def path():
    pass

@app.route("/node/<int:id>", methods=["POST"])
def node():
    pass

@app.route("/signup", methods=["POST"])
def signup():
    content = request.json
    collection = myDB['users']
    # myDict = json.loads(content)
    requesting = []
    requesting.append(InsertOne(content))
    result = collection.bulk_write(requesting)
    return {"success": True}



@app.route("/<type>/<action>/<int:id>")       #/<type>/<action>/<id>
def hello(type,action,id):
    if type == "post":
        return {"message": "THIS IS A POST"}
    return {"message": "other"}






if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)