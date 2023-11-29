from django.urls import path
from .views import CustomUserRegister, CustomAuthToken, RetrieveUserData, CustomLogout

# Application namespace
app_name = "users"

urlpatterns = [
    # Authentication URLs
    
    # Endpoint for user registration
    path("register/", CustomUserRegister.as_view(), name="register"),
    
    # Endpoint for user login
    path("login/", CustomAuthToken.as_view(), name="login"),
    
    # Endpoint for user logout
    path("logout/", CustomLogout.as_view(), name="logout"),

    # User-related URLs
    
    # Endpoint for retrieving user data
    path("user-data/", RetrieveUserData.as_view(), name="user-data"),
]
