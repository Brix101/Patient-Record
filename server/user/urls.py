from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.Users.as_view()),
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
]
