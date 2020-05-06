from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from MeshGenerator import views

urlpatterns = [
    path('visualizationMesh/<uuid:project_id>', views.getVisualizationMesh.as_view()),
    path('mesher/<uuid:project_id>', views.mesher.as_view()),
    path('uploadStep/<uuid:project_id>/<slug:filename>', views.uploadStep.as_view())
]