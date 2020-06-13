from django.urls import path
from . import views

urlpatterns = [
        path('frontEndConfig/', views.frontEndConfig.as_view()),
]