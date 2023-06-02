from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    is_admin = models.BooleanField(default=True)
    
class Post(models.Model):
    title = models.CharField(max_length=200)
    title_tag = models.CharField(max_length=200)
    author = models.CharField(max_length=50, null=True)
    date = models.DateField(auto_now=False, blank=True, null=True)
    category = models.CharField(max_length=200, null=True)
    article = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.title
    

class School(models.Model):
    name = models.CharField(max_length=50)
    start = models.DateField(auto_now=False, blank=True, null=True)
    finish = models.DateField(auto_now=False, blank=True, null=True)
    description = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return self.name

class Subject(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    subject = models.CharField(max_length=25,blank=True,null=True)
    grade = models.CharField(max_length=10,blank=True,null=True)

    def __str__(self):
        return self.name
    

class Company(models.Model):
    name = models.CharField(max_length=50)
    position = models.CharField(max_length=50)
    start = models.DateField(auto_now=False, blank=True, null=True)
    finish = models.DateField(auto_now=False, blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to = 'company_image/')
    description = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'