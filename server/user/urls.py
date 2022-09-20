from django.urls import path
from .views import Users

urlpatterns = [
    path('users/', Users.as_view()),
]
