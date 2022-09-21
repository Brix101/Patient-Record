from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('logout/', views.LogOutView.as_view(), name='auth_logout'),
]
