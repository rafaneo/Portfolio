from django import forms
from ckeditor.widgets import CKEditorWidget

from .models import(
    Post,
)


class ArticleForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'title_tag', 'author', 'category', 'article']
        widgets = {
                    'title': forms.TextInput(attrs={'size': 40}),                
                }