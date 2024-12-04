from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('getCords', views.getCords),
    path('searchParkings', views.searchParkings, name='searchParkings'),
    path('testView', views.testView),
]