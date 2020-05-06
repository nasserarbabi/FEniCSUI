from rest_framework.response import Response
from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated
from .OnShapeImport import OnShape
from .models import visualizationMesh#, projects
from .mesher import gmsh, mshReader
from .serializer import bufferedGeometrySerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.views.generic import TemplateView
from rest_framework.parsers import FormParser, FileUploadParser
from AnalysesHub.models import AnalysisConfig
import json
import os
import shutil



class geometryImport(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [FormParser]

    def post(self, request, *args, **kwargs):
        project = get_object_or_404(projects, id=kwargs['project_id'])
        if (project.user == request.user):
            data = request.data
            if data["did"] and data["wid"] and data["eid"]:
                geometry = OnShape(
                    data["did"], data["wid"], data["eid"]
                )
                geometry.getStepFile(project.id)
                if visualizationMesh.objects.filter(project=project).exists():
                    record = get_object_or_404(
                        visualizationMesh, project=project.id)
                    record.mesh = geometry.getVisualizationMesh()
                    record.faces = geometry.getFaces()
                    record.edges = gmsh(project.id).visualizationEdgeMesh()
                    record.points = gmsh(project.id).visualizationPoints()
                    record.boundingBox = geometry.getBoundingBox()
                    record.save()

                else:
                    visualizationMesh.objects.create(
                        project=project,
                        mesh=geometry.getVisualizationMesh(),
                        edges=gmsh(project.id).visualizationEdgeMesh(),
                        points=gmsh(project.id).visualizationPoints(),
                        faces=geometry.getFaces(),
                        boundingBox=geometry.getBoundingBox(),
                    )
                queryset = get_object_or_404(
                    visualizationMesh, project=project)
                serializer = bufferedGeometrySerializer(queryset)
                return Response(serializer.data)
            else:
                return Response(data="Please ensure the OnShape document parameters are correct", status=400)
        else:
            return Response(data="No permission to access project", status=401)


class mesher(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [FormParser]

    def get(self, request, *args, **kwargs):
        """ 
        Returns the mesh data from the database, if exists.
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        if (project.user == request.user):
            config = get_object_or_404(AnalysisConfig, project=project)
            if config.mesh:
                return Response(data=config.mesh, status=200)
            else:
                return Response(data="No mesh found. Please make sure you have meshed the geometry", status=204)

    def post(self, request, *args, **kwargs):
        """
        Create and save computational mesh. Returns visualization mesh to the front end
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        if (project.user == request.user):
            meshSize = float(request.data['meshSize'])
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
        else:
            return Response(data="No permission to access project", status=401)


class uploadStep(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [FileUploadParser]

    def post(self, request, filename, format=None, *args, **kwargs):
        """
        Create and save computational mesh from uploaded step. Returns visualization mesh to the front end
        """
        project_id = kwargs['project_id']
        project = get_object_or_404(projects, id=project_id)
        if (project.user == request.user):
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
        else:
            return Response(data="No permission to access project", status=401)

class getVisualizationMesh(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [FileUploadParser]

    def get(self, request, *args, **kwargs):
        """
        returns the visualization mesh
        """
        project_id = kwargs['project_id']
        project = get_object_or_404(projects, id=project_id)
        if (project.user == request.user):
            config = get_object_or_404(AnalysisConfig, project=project)
            if (config.visualizationMesh): 
                return Response(config.visualizationMesh)
            else:
                return Response(data="No geometry has imported", status=404)
        else:
            return Response(data="No permission to access project", status=401)
