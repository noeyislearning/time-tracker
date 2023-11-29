from django.urls import path
from .views import (
    TrackList,
    TrackRetrieveUpdateDestroy,
    TrackCreate,
    TrackRetrieve,
    TrackListCreate,
    UserTrackList,
    StopTrackView,
    WeeklyTotalDurationView,
)

# Application namespace
app_name = "tracks"


urlpatterns = [
    # Tracks
    path("", TrackList.as_view(), name="list"),
    path("c/", TrackCreate.as_view(), name="create"),
    path("lc/", TrackListCreate.as_view(), name="list_create"),
    path("r/<pk>/", TrackRetrieve.as_view(), name="retrieve"),
    path(
        "rud/<pk>/",
        TrackRetrieveUpdateDestroy.as_view(),
        name="retrieve_update_destroy",
    ),
    # Actions
    path("stop/<pk>/", StopTrackView.as_view(), name="stop_track"),
    # Analytics
    path(
        "wtd/<user_id>/",
        WeeklyTotalDurationView.as_view(),
        name="weekly_total_duration",
    ),
    # User
    path("u/<user_id>/", UserTrackList.as_view(), name="user_tracks"),
]
