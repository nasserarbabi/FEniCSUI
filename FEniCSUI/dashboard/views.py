from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import projects
from .forms import newProjectForm
from AnalysesHub.models import AnalysisConfig
import shutil
import os

def redirect(request):
    return HttpResponseRedirect(
        reverse("dashboard"))

def dashboard(request):


    # delete a project
    if request.method == 'POST':
        rmProject_id = request.POST.dict()['removeProject']

        # delete database entry
        projects.objects.filter(id=rmProject_id).delete()

        # delete media files, if exists
        projectFilesPath = os.path.abspath("./media/{}/stepFile.step".format(rmProject_id))
        if os.path.isfile(projectFilesPath):
            folderPath = os.path.dirname(projectFilesPath)
            shutil.rmtree(folderPath)

    projectList = projects.objects.all().values('id', 'name', 'description')
    return render(request, 'dashboard.html', { "projectList": list(projectList)})



def newProject(request):

    projectExist = False
    if request.method == 'POST':
        form = newProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            if  not projects.objects.filter(name=project.name).exists():
                project.save()
                AnalysisConfig.objects.create(project=project)
                return HttpResponseRedirect("/dashboard")
            else:
                projectExist = True
    else:
        form = newProjectForm()
    return render(request, 'newProject.html', { 'form': form, "projectExist": projectExist})



def app(request, project_id):
    project = get_object_or_404(projects, id=project_id)
    return render(request, 'frontend/app.html', {"project_id": project_id, "projectName":project.name})
