from django import forms
from .models import Project

class ProjectForm(forms.ModelForm):
    area = forms.FloatField(required=False, label="Площадь (кв.м)")
    rooms = forms.IntegerField(required=False, label="Количество комнат")
    family = forms.IntegerField(required=False, label="Количество членов семьи")

    class Meta:
        model = Project
        fields = ['title', 'location', 'description']

    def clean(self):
        cleaned_data = super().clean()
        area = cleaned_data.get('area')
        rooms = cleaned_data.get('rooms')
        family = cleaned_data.get('family')
        
        room_parameters = {
            'area': area,
            'rooms': rooms,
            'family': family
        }
        cleaned_data['room_parameters'] = {k: v for k, v in room_parameters.items() if v is not None}
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.room_parameters = self.cleaned_data['room_parameters']
        if commit:
            instance.save()
        return instance