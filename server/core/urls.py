from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API (rest_framework)
    path('api-auth/', include('rest_framework.urls'), name='rest_framework'),

    # API Entry Points
    path('api/users/', include('apps.api.users.urls'), name='api_users'),
    path('api/projects/', include('apps.api.projects.urls'), name='api_projects'),
    path('api/tracks/', include('apps.api.tracks.urls'), name='api_tracks'),

    # Tokens
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
