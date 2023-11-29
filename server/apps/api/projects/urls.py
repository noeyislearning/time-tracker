from django.urls import path
from .views import (
    ProjectList,
    ProjectCreate,
    ProjectRetrieve,
    ProjectRetrieveUpdateDestroy,
    ProjectTracksList
)

app_name = "projects"

urlpatterns = [
    path('', ProjectList.as_view(), name='list'),
    path('c/', ProjectCreate.as_view(), name='create'),
    path('r/<pk>/', ProjectRetrieve.as_view(), name='retrieve'),
    path('rud/<pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='retrieve_update_destroy'),
    path('rwt/<pk>/', ProjectTracksList.as_view(), name='retrieve_with_tracks'),
]