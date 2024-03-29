from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from django.utils.translation import gettext_lazy as _
# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    dev_id = models.CharField(max_length=50, unique=True, null=True)
    dev_model = models.CharField(max_length=100, null=True)
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
    display = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'



class Project(models.Model):

    class ProjectRoles(models.TextChoices):

        PROJECT_MANAGER = _("Project Manager"), "project manager"
        DEVELOPER_PROGRAMMER =  _("Developer Programmer"), "developer programmer"
        QUALITY_ASSURANCE = _("Quality Assurance"), "quality assurance"
        TEAM_LEAD = _("Team Lead"), "team lead"
        NONE =  _("Unassigned"), "unassigned"
    
    class SourceType(models.TextChoices):

        FREEWARE = _("Freeware"), "freeware"
        SHAREWARE =  _("Shareware"), "shareware"
        OPEN_SOURCE = _("Open Source"), "open source"
        CLOSED_SOURCE = _("Closed Source"), "closed source"

    name = models.CharField(max_length=50)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    role = models.CharField(max_length=20, choices=ProjectRoles.choices, default=ProjectRoles.NONE)
    source_type = models.CharField(max_length=20, choices=SourceType.choices, default=SourceType.OPEN_SOURCE)
    public = models.BooleanField(default=True)
    description = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.name + "Primary Key -> " + str(self.pk)



class Qualifications(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500, null=True, blank=True)
    grade = models.CharField(max_length=10, null=True, blank=True)
    Institution = models.CharField(max_length=50)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Qualifications"

class Logs(models.Model):
    date = models.DateField(auto_now=True, blank=True, null=True)
    file = models.FileField(upload_to='logs/')

    class Meta:
        verbose_name_plural = "Logs"