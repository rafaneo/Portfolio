from django.contrib import admin
from mainapp.models import ( 
    School,
    Subject,
    Company,
    User,
    Post,
)
# Register your models here.
admin.site.register(School)
admin.site.register(Subject)
admin.site.register(Company)
admin.site.register(User)
admin.site.register(Post)