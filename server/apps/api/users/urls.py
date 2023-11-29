from django.urls import path
from .views import CustomUserRegister, CustomAuthToken, RetrieveUserData, CustomLogout

app_name = "users"

urlpatterns = [
  
  # Authentication
  path("register/", CustomUserRegister.as_view(), name="register"),
  path("login/", CustomAuthToken.as_view(), name="login"),
  path("logout/", CustomLogout.as_view(), name="logout"),

  # User
  path("user-data/", RetrieveUserData.as_view(), name="user-data"),
]