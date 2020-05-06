import http.client
import mimetypes
import json
import sys
import time

# reading args from command line, please make sure the arguments are in order
projectId = sys.argv[1]
auth = sys.argv[2]
cookie = sys.argv[3]

# get configuration from server
conn = http.client.HTTPConnection("host.docker.internal:8000")
payload = ''
headers = {
  'Authorization': 'Basic {}'.format(auth),
  'Cookie': cookie
}
conn.request("GET", "/getConfig/{}".format(projectId), payload, headers)
res = conn.getresponse()
data = res.read()
config = json.loads(data)

# update progress
headers['Content-Type'] = 'application/json'

for i in range (20):
  payload = json.dumps({"status":"STARTED", "percent": i*5})
  conn.request("POST", "/solverProgress/{}".format(projectId), payload, headers)
  conn.close()
  time.sleep(1)

payload = json.dumps({"status":"SUCCESS", "Percent": 100})
conn.request("POST", "/solverProgress/{}".format(projectId), payload, headers)
conn.close()


# post results to server
payload = json.dumps(config)
conn.request("POST", "/results/{}".format(projectId), payload, headers)