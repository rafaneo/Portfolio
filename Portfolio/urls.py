"""Portfolio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from mainapp.views import (
    Main,
    Education,
    Experience,
    CuriculumVitae,
    Article,
    BlogView,
    Projects,
    Other,
)

from mainapp.api.api import(
    InitializeInstance,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('' ,  Main.as_view(), name="mainpage"),
    path('education', Education.as_view(), name="education"),
    path('experience', Experience.as_view(), name="experience"),
    path('projects', Projects.as_view(), name="projects"),
    path('other', Other.as_view(), name="other"),
    path('curiculum_vitae', CuriculumVitae.as_view(), name="curiculum_vitae"),
    path('post', Article.as_view(),name="post" ),
    path('blog', BlogView.as_view(),name="blog" ),
    path('endpoint', InitializeInstance.as_view(), name="end_point"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
