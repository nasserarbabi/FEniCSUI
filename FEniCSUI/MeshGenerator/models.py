from django.db import models
from dashboard.models import projects

# # this function defines a specific folder for the files required in analyses
# def analysisDirectoryPath(instance, filename):
#     # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
#     return '{}/{}'.format(instance.project.id, filename)



class visualizationMesh(models.Model):
    project = models.ForeignKey(
        projects, on_delete=models.CASCADE)
    mesh = models.TextField()
    faces = models.TextField()
    edges = models.TextField()
    points = models.TextField()
    boundingBox = models.TextField()

    def __str__(self):
        return self.project.name
