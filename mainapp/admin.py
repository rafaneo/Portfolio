from django.contrib import admin
from mainapp.models import ( 
    School,
    Subject,
    Company,
    Project,
    User,
    Post,
    Qualifications,
)
# Register your models here.
admin.site.register(School)
admin.site.register(Subject)
admin.site.register(Company)
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Project)
admin.site.register(Qualifications)