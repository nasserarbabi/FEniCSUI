from rest_framework.response import Response
from dashboard.models import projects
from .mesher import gmsh, mshReader
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.views.generic import TemplateView
from rest_framework.parsers import FormParser, FileUploadParser
from AnalysesHub.models import AnalysisConfig
import json
import os
import shutil



class mesher(APIView):
    parser_classes = [FormParser]

    def get(self, request, *args, **kwargs):
        """ 
        Returns the mesh data from the database, if exists.
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        config = get_object_or_404(AnalysisConfig, project=project)
        if config.mesh:
            return Response(data=config.mesh, status=200)

    def post(self, request, *args, **kwargs):
        """
        Create and save computational mesh. Returns visualization mesh to the front end
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        meshSize = float(request.data['meshSize'])
        mesh = gmsh(project.id)
        mesh.generateMesh(meshSize)
        meshData = mshReader(project.id)

        # save mesh to database
        config = get_object_or_404(AnalysisConfig, project=project)
        config.mesh = meshData.readFile()
        config.visualizationMesh = meshData.bufferedMesh
        config.save()

        
        # return buffered geometry for visualization in ThreeJS
        return Response(meshData.bufferedMesh)


class uploadStep(APIView):
    parser_classes = [FileUploadParser]

    def post(self, request, filename, format=None, *args, **kwargs):
        """
        Create and save computational mesh from uploaded step. Returns visualization mesh to the front end
        """
        project_id = kwargs['project_id']
        project = get_object_or_404(projects, id=project_id)
        stepFile = request.data['file']
        folderPath = os.path.abspath(
            "../FEniCSUI/media/{}".format(project_id))
        os.makedirs(folderPath, exist_ok=True)
        with open('{}/stepFile.step'.format(folderPath), 'wb+') as destination:
            for chunk in stepFile.chunks():
                destination.write(chunk)

        meshSize = .2
        mesh = gmsh(project.id)
        mesh.generateMesh(meshSize)
        meshData = mshReader(project.id)

        # save mesh to database
        config = get_object_or_404(AnalysisConfig, project=project)
        config.mesh = json.loads(meshData.readFile())
        config.visualizationMesh = meshData.bufferedMesh
        config.save()

        # return buffered geometry for visualization in ThreeJS
        return Response(meshData.bufferedMesh)

class getVisualizationMesh(APIView):
    parser_classes = [FileUploadParser]

    def get(self, request, *args, **kwargs):
        """
        returns the visualization mesh
        """
        project_id = kwargs['project_id']
        project = get_object_or_404(projects, id=project_id)
        config = get_object_or_404(AnalysisConfig, project=project)
        if (config.visualizationMesh): 
            return Response(config.visualizationMesh)
        else:
            return Response(data="No geometry has imported", status=404)

