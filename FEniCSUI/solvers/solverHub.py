''' this module takes care of server communications, and provides the 
designated solver with mesh and paramteres it needs to run'''

import requests
import json
import sys
from mesh2Fenics import meshReader
from src.navierStokes import navierStokes
import shutil


# remove the result directory 
# shutil.rmtree("./Results")
# reading args from command line, please make sure the arguments are in order
projectId = sys.argv[1]
solver = sys.argv[2]
server = "http://host.docker.internal:8000"

# local parameters for development
# projectId = '0f4abb38-9a1d-48bc-9737-cf2ade4d8373'
# solver = 'navierStokes'
# server = 'http://127.0.0.1:8000'

# get mesh
url = "{}/mesher/{}".format(server,projectId)
res = requests.get(url)
mesh = json.loads(res.json())

# create mesh sets for boundaries
meshSets = meshReader(mesh)

# get solver configuration
url = "{}/getConfig/{}".format(server,projectId)
res = requests.get(url)
config = json.loads(res.json())

if solver == "navierStokes":
    navierStokes(projectId, meshSets["feMesh"],
                 meshSets["faceSets"], meshSets["edgeSets"], config)
else:
    headers = {'Content-Type': 'application/json'}
    payload = json.dumps({"status":"FAILED", "message":{"error": "solver {} does not exist.".format(solver)}})
    conn.request("POST", "/solverProgress/{}".format(projectId), payload, headers)
    conn.close()