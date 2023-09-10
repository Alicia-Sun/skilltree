from typing import Any
from flask import Flask, request, jsonify, make_response
from pymongo import InsertOne
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from flask_cors import CORS
import json
import uuid
import ssl
from copy import deepcopy
from node import Node

from graph import Graph

app = Flask(__name__)
CORS(app, supports_credentials=True)

client = MongoClient("mongodb+srv://skilltree:skilltree@skilltree.ukoqkrq.mongodb.net/?retryWrites=true&w=majority", server_api=ServerApi('1'))
db = client['SkillTreeDB']




# \     POST/GET
# \     generate/login/logout/path/node/signup
# \     <id>

def get_user_id(sessid):
    sessions = db["sessions"]
    session = sessions.find_one({"id": sessid})
    if session is None:
        return None

    return session["user_id"]


@app.route("/generate", methods=["POST"])
def generate():
    user_id = get_user_id(request.cookies.get("session"))
    content = request.json
    graph = Graph(content['topic'], content['skills'])
    graphObj, description = graph.generate_graph()
    print(graphObj, description)
    nodes = list(graphObj.keys())
    objId = str(uuid.uuid4())
    nodes = [{"name": node, "description": description[node], "id": str(uuid.uuid4()), "graph_id": objId} for node in nodes]

    # {
    #   "Node A": ["Node B", "Node C"]
    # }
    nameIdDict = {}

    for n in nodes:
        nameIdDict[n['name']] = n['id']
    newGraphObj = {}
    for k in graphObj.keys():
        newGraphObj[nameIdDict[k]] = []
        for v in graphObj[k]:
            newGraphObj[nameIdDict[k]].append(nameIdDict[v])

    for node in nodes:
        db["nodes"].insert_one(node)

    obj = {
        "id": objId,
        "user_id": user_id,
        "topic": content['topic'],
        "skills": content['skills'],
        "graph": newGraphObj,
    }

    db["trees"].insert_one(obj)
    print(newGraphObj)

    del obj["_id"]
    return obj


@app.route("/user", methods=["GET"])
def user():
    sessions = db["sessions"]
    users = db["users"]
    sessid = request.cookies.get("session")

    session = sessions.find_one({"id": sessid})
    if session is None:
        return {"success": False}

    user = users.find_one({"id": session["user_id"]})
    if user is None:
        return {"success": False}

    return {"phone": user["phone"]}

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
    session = sessions.insert_one({"user_id": user["id"], "id": str(sessid)})
    resp = make_response({"success": True})
    resp.set_cookie("session", str(sessid))

    return resp

@app.route("/logout", methods=["POST"])
def logout():
    sessid = request.cookies.get("session")
    sessions = db["sessions"]
    session = sessions.find_one({"id": sessid})

    if session is None:
        resp = make_response({"success": False})
    else:
        sessions.delete_one({"id": sessid})
        resp = make_response({"success": True})

    resp.set_cookie("session", "", expires=0)
    return resp

@app.route("/graph/<int:id>", methods=["GET"])       #removed "POST"
def path(id):
    if request.method == "GET":
        res = db['trees'].find_one({"id": id})
        del res['_id']
        return res
    else:
        return {"success": False}

@app.route("/node/<string:id>", methods=["GET"])
def node(id):
    args = request.args
    db_node = db['nodes'].find_one({"id": id})
    del db_node['_id']
    if "links" in db_node:
        return db_node    


    graph = db["trees"].find_one({"id": db_node["graph_id"]})
    desc_ids = graph["graph"][db_node["id"]]
    descs = []
    for desc in desc_ids:
        descs.append(db["nodes"].find_one({"id": desc}))

    node = Node(graph["topic"], db_node["name"], descs, db_node["description"])
    node.generate_links() 

    db["nodes"].update_one({"id": id}, {"$set": {"links": node.links}})
    db_node = db['nodes'].find_one({"id": id})
    del db_node['_id']

    return db_node

@app.route("/graphs", methods=["GET"])
def graphs():
    user_id = get_user_id(request.cookies.get("session"))
    graphs = list(db["trees"].find({"user_id": user_id}))
    for graph in graphs:
        del graph["_id"]

    print(graphs)
    return {"graphs": graphs}

@app.route("/signup", methods=["POST"])
def signup():
    collection = db['users']

    content = request.json
    content["id"] = str(uuid.uuid4())
    collection.insert_one(content)
    return {"success": True}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

