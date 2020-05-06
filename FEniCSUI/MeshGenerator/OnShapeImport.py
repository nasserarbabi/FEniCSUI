"""OnShape API requests
"""

from onshape_client.client import Client
import json
import os
import time
import shutil


import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class OnShape():

    def __init__(self, _did, _wid, _eid):
        self.did = _did
        self.wvm = "w"
        self.wid = _wid
        self.eid = _eid
        self.client = Client(keys_file=os.path.abspath(
            '../.onshape_client_config.yaml'))

    def getVisualizationMesh(self):
        '''
        function to get visualization mesh from OnShape
        input:
            -
        output:
            JSON:: three.js buffered geometry points data
        '''

        mesh = self.client.part_studios_api.get_part_studio_tessellated_faces(
            self.did, self.wvm, self.wid, self.eid)
        bufferedMesh = {}
        nn = 1
        for section in mesh:
            for face in section['faces']:
                bufferedMesh[nn] = []
                for facet in face['facets']:
                    for vertex in facet['vertices']:
                        for ii in range(3):
                            bufferedMesh[nn].append(vertex[ii])
                nn+=1
        return json.dumps(bufferedMesh)

    def getBoundingBox(self):
        '''
        retrive bounding box

        output:
            JSON:: bounding box data
        '''
        boundingBox = self.client.part_studios_api.get_part_studio_bounding_boxes(
            self.did, self.wvm, self.wid, self.eid)
        return json.dumps(boundingBox)

    def getStepFile(self, project_id):
        '''
        this function sent API calls to OnShape in three steps to retrive STEP file
        1) API call to translate the part studio to step file
        2) get status of the file conversion
        3) download the results, rename it to "stepFile.step" and move to media/project_id/

        input: 
            str:: project_id: id of the current project

        output: 
            file:: file in media/project_id/stepFile.step
        '''

        bt_translate_format_params = {
            "formatName": "STEP",
            "includeExportIds": True,
            "storeInDocument": False,
        }

        stepFileInfo = self.client.part_studios_api.create_part_studio_translation(
            self.did, self.wvm, self.wid, self.eid, bt_translate_format_params)

        for i in range(100):
            status = self.client.translation_api.get_translation(
                stepFileInfo['id'])
            if status['request_state'] == "DONE":
                resultExternalDataId = status['result_external_data_ids'][0]
                break
            time.sleep(0.5)

        stepPath = self.client.documents_api.download_external_data(
            self.did, resultExternalDataId)
        print(stepPath)
        os.makedirs(os.path.abspath(
            "../FEniCSUI/media/{}".format(project_id)), exist_ok=True)
        shutil.move(stepPath.name, os.path.abspath(
            "../FEniCSUI/media/{}".format(project_id))+'/stepFile.step')

    def getFaces(self):
        '''
        gets tessellated faces from OnShape

        output:
            JSON:: tessellated faces from OnShape
        '''
        faces = self.client.part_studios_api.get_part_studio_tessellated_faces(
            self.did, self.wvm, self.wid, self.eid)[0]['faces']
        return json.dumps({"1":faces})

    def getEdges(self):
        '''
        gets tessellated edges from OnShape
        WARNING: up to 1/1/2020, this function returns None if the geometry is shell type

        output:
            JSON:: tessellated edges from OnShape
        '''
        edges = self.client.part_studios_api.get_part_studio_tessellated_edges(
            self.did, self.wvm, self.wid, self.eid)[0]['edges']
        return json.dumps(edges)


if __name__ == "__main__":
    did = "f87645b7e71dc92c919fe957"
    wid = "6302b12dbdb97ffb7a7be8fd"
    eid = "19a9e4c7042dcaac6237be5c"
    part = OnShape(did, wid, eid)
