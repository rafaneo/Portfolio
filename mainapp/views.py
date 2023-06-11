from django.shortcuts import render, reverse
from django.shortcuts import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView, ListView, FormView, View

from mainapp.models import (
    School,
    Subject,
    Company,
    User,
    Post,
)
from mainapp.forms import(
    ArticleForm,
)

class Main(TemplateView):
    template_name = 'main.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        is_device = self.request.user_agent.is_mobile 
        context['user'] = user
        return context
    

class Education(ListView):
    model = School
    template_name = 'education.html'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["schools"] = School.objects.all()
        return context
    

class Experience(ListView):
    model = School
    template_name = 'experience.html'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["companies"] = Company.objects.all()
        return context
    
class CuriculumVitae(TemplateView):
    template_name = 'curiculum_vitae.html'


class Article(FormView):
    form_class = ArticleForm
    template_name = 'post.html'

    def form_valid(self, form):
        form.instance.save()
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("mainpage")

class BlogView(ListView):
    model = Post
    template_name = 'blog.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs )
        context['posts'] = Post.objects.all()
        return context

class Projects(TemplateView):
    template_name = 'projects.html'

class Other(TemplateView):
    template_name = 'other.html'
    