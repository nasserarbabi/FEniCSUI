from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from dashboard.models import projects
from .models import AnalysisConfig, SolverResults, SolverProgress
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework import status
import docker
import os
from base64 import b64encode
import json


class solverConfig(APIView):

    parser_classes = [FormParser, MultiPartParser]

    def get(self, request, *args, **kwargs):
        """
        return a list of entries within a given category
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        category = request.query_params.get('category')
        parentConfig = AnalysisConfig.objects.get(project=project)
        jsonHelper = json.loads(parentConfig.config)

        if category in jsonHelper:
            return Response(data=jsonHelper[category], status=status.HTTP_200_OK)
        else:
            return Response(data="The category {} does not exist".format(category), status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        """
        create a new category for solver configuration
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        data = request.data.dict()
        category = request.query_params.get('category')
        parentConfig = AnalysisConfig.objects.get(project=project)
        jsonHelper = json.loads(parentConfig.config)

        # if there is no category similar to the user request
        if category not in jsonHelper:
            jsonHelper[category] = []
            jsonHelper[category].append(data)

        # check if the entry with the same name exists
        elif not list(filter(lambda name: name["Name"] == data["Name"], jsonHelper[category])):
            jsonHelper[category].append(data)
        else:
            return Response(data="an entry with the same name exists", status=400)

        parentConfig.config = json.dumps(jsonHelper)
        parentConfig.save()
        return Response(data=jsonHelper[category], status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        """
        Edit an existing category entry's data
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        data = request.data.dict()
        category = request.query_params.get('category')
        list_id = int(request.query_params.get('id'))
        parentConfig = AnalysisConfig.objects.get(project=project)
        jsonHelper = json.loads(parentConfig.config)
        if category in jsonHelper:
            if list_id >= 0 and list_id < len(jsonHelper[category]):

                # check if an entry with the same name exists
                if not list(filter(lambda name: name["Name"] == data["Name"], jsonHelper[category])) or jsonHelper[category][list_id]["Name"] == data["Name"]:
                    jsonHelper[category][list_id] = data
                    parentConfig.config = json.dumps(jsonHelper)
                    parentConfig.save()
                    return Response(data=jsonHelper[category], status=status.HTTP_200_OK)
                else:
                    return Response(data="an entry with the same name exists", status=400)
            else:
                return Response(data="No entry with the id={}".format(list_id), status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data="The category {} does not exist".format(category), status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, *args, **kwargs):
        """
        Delete an entry from the category
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        category = request.query_params.get('category')
        list_id = int(request.query_params.get('id'))
        parentConfig = AnalysisConfig.objects.get(project=project)
        jsonHelper = json.loads(parentConfig.config)
        if jsonHelper[category]:
            if list_id >= 0 and list_id < len(jsonHelper[category]):
                jsonHelper[category].pop(int(list_id))
                parentConfig.config = json.dumps(jsonHelper)
                parentConfig.save()
                return Response(data=jsonHelper[category], status=status.HTTP_200_OK)
            else:
                return Response(data="No entry with the id={}".format(list_id), status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data="The category {} does not exist".format(category), status=status.HTTP_204_NO_CONTENT)


class Categories(APIView):

    parser_classes = [FormParser, MultiPartParser]

    def get(self, request, *args, **kwargs):
        """
        Return the existing categories in the solver config
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        config = json.loads(AnalysisConfig.objects.get(
            project=project).config).keys()
        return Response(data=config, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """
        DELETE the existing categories in the solver config
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        category = request.query_params.get('category')
        parentConfig = AnalysisConfig.objects.get(project=project)
        jsonHelper = json.loads(parentConfig.config)
        if category in jsonHelper:
            del jsonHelper[category]
            parentConfig.config = json.dumps(jsonHelper)
            parentConfig.save()
            return Response(data=jsonHelper, status=status.HTTP_410_GONE)
        else:
            return Response(data="The category {} does not exist!".format(category), status=status.HTTP_404_NOT_FOUND)


class getConfiguration(APIView):

    parser_classes = [FormParser, MultiPartParser]

    def get(self, request, *args, **kwargs):
        """
        Get the solver config to be submitted to the analysis
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        config = AnalysisConfig.objects.filter(project=project).values()[0]
        config.pop('visualizationMesh', None)
        return Response(data=config, status=status.HTTP_200_OK)


class solvers(APIView):

    parser_classes = [FormParser, MultiPartParser]

    def get(self, request, *args, **kwargs):
        """
        Runs the related solver defined in url parameters
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        # set progress to initial
        progress = get_object_or_404(SolverProgress, project=project)
        progress.progress = {'status': 'RECEIVED', 'percent': '0'}
        progress.save()

        # initiate related solver
        solver = request.query_params.get('solver')

        client = docker.from_env()
        solverPath = os.path.abspath('./solvers')
        try:
            client.containers.run(
                "quay.io/fenicsproject/stable:current",
                volumes={solverPath: {
                    'bind': '/home/fenics/shared', 'mode': 'rw'}},
                working_dir="/home/fenics/shared",
                # runs solver.py with three arguments to be passed in to python file
                command=["`python3 {}.py {}`".format(solver, project.id)],
                auto_remove=True,
                detach=True)
        except:
            message = '''please check if the docker is running. If you are woking with WSL, 
            make sure it has access to the windows docker. Instructions can be fount 
            at: https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly'''
            print(message)
            return Response(data=message, status=500)
        return Response(data="submitted to analysis", status=status.HTTP_200_OK)


class resutls(APIView):

    parser_classes = [JSONParser]

    def get(self, request, *args, **kwargs):
        """
        Get the results saved in the database
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        if (SolverResults.objects.filter(project=project).exists()):
            resutls = SolverResults.objects.filter(project=project).values()[0]
        else:
            resutls = "not found"
        return Response(data=resutls, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        save results from server to database
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        data = request.data
        if SolverResults.objects.filter(project=project).exists():
            solverResults = get_object_or_404(SolverResults, project=project)
            solverResults.result = data
            solverResults.save()
        else:
            SolverResults.objects.create(project=project, result=data)

        return Response(data="results updated", status=status.HTTP_201_CREATED)


class solverProgress(APIView):
    parser_classes = [JSONParser]

    def get(self, request, *args, **kwargs):
        """
        Get the progress
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        if (SolverProgress.objects.filter(project=project).exists()):
            progress = get_object_or_404(SolverProgress, project=project)
        else:
            progress = "no solver has been started yet"
        return Response(data=progress.progress, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Update the progress from solver
        """
        project = get_object_or_404(projects, id=kwargs['project_id'])
        data = request.data
        if SolverProgress.objects.filter(project=project).exists():
            progress = get_object_or_404(SolverProgress, project=project)
            progress.progress = data
            progress.save()
        else:
            SolverProgress.objects.create(project=project, progress=data)

        return Response(data=get_object_or_404(SolverProgress, project=project).progress, status=status.HTTP_201_CREATED)
