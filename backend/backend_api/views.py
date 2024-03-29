from django.shortcuts import render
from .models import *
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello World")