from django.urls import path, include
from . import views
from django.contrib.auth.views import LoginView
from . import forms

urlpatterns = [
    path('dashboard/', views.dashboard, name="dashboard" ),
    path('dashboard/newProject', views.newProject, name="newProject" ),
    path('', views.redirect), # this redirects the main page to dashboard
    path('app/<uuid:project_id>/', views.app, name="app" ),
    
]