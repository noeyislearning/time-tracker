from django.urls import path
from .views import (
    ProjectList,
    ProjectCreate,
    ProjectRetrieve,
    ProjectRetrieveUpdateDestroy,
    ProjectTracksList
)

# Application namespace
app_name = "projects"


urlpatterns = [
    # Root API Route
    path('', ProjectList.as_view(), name='list'),

    # Create API Route
    path('c/', ProjectCreate.as_view(), name='create'),

    # Retrieve API Route
    path('r/<pk>/', ProjectRetrieve.as_view(), name='retrieve'),

    # Retieve & Update API Route
    path('rud/<pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='retrieve_update_destroy'),

    # Retrieve with Tracks API Route
    path('rwt/<pk>/', ProjectTracksList.as_view(), name='retrieve_with_tracks'),
]