# from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class NoteListCreate(generics.ListCreateAPIView): # ListCreate... used for two things
    # it will list all of the notes that the user has created 
    # or it will create a new note
    # so there are two functions here


    serializer_class = NoteSerializer
    # this class gets the different data and it tells us if the data is valid
    # or not. 
    # Generic views first accept the data, then pass them to the serializer 
    # that will check the data against the fields on the model and 
    # make sure that the data is accurate
    # (e.g. the title is not above the maximum lenght etc.)

    permission_classes = [IsAuthenticated] # it means you cannot call this route unless you are authenticated 
    # and you pass a valid JWT 

    def get_queryset(self):
        user = self.request.user # in django if you want to get a user that is actually authenticated and that is interacting with this route all we have to do inside our class-bassed views
        # is we write self.request.user 
        # that is gonna give us the user object, we can then use that user
        # to filter our notes 
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        # we want to do some custom configuratio when we create a new user
        # so we're overriding the create method.
        # All these generic views you can just leave them as is and as
        # long as you specify your serializer class, a permission class 
        # and a queryset it's automatically gonna work
        # it will let you create list etc. depending on the type of 
        # generic class you use.
        # But if you want some custom functionality we need to override 
        # specific methods (like get_queryset and perform_create).
        # See Django Docs.

        if serializer.is_valid():
            serializer.save(author=self.request.user) 
            # save to database and add the author field manually
            # because in the serializer extra_kwargs we set author to be read_only.
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # who can call this: anyone, even if they are not authenticated



