import json
import requests


def statusUpdate(projectId, status, message):
    server = "http://host.docker.internal:8000"
    # server = "http://127.0.0.1:8000"
    url = "{}/solverProgress/{}".format(server,projectId)
    headers = {'Content-Type': 'application/json'}
    payload = json.dumps({"status": status, "message": message})
    requests.post(url, data=payload, headers=headers)


def sendFile(projectId, filePath):
    ''' send a file to the server. do not use space in the file name'''

    fileName = filePath.split("/")[-1]
    fileExtention = fileName.split(".")[-1]
    fileName = fileName.split(".")[0]

    server = "http://host.docker.internal:8000"
    # server = "http://127.0.0.1:8000"
    url = "{}/saveResults/{}/{}?fileType={}".format(server, projectId, fileName, fileExtention)
    headers = {
        'Content-Type': 'application/octet-stream'
    }
    with open(filePath, 'rb') as payload:
        requests.put(url, data = payload, headers=headers)
