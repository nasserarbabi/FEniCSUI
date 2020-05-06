from django import forms
from .models import projects


class newProjectForm(forms.ModelForm):

    class Meta:
        model = projects
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Project Name'
                }
            ),
            'description': forms.Textarea(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Project Description'
                }
            ),

        }
