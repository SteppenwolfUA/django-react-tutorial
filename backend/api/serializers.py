from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user 
    

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id","title","content","created_at","author"] 
        extra_kwargs = {"author": {"read_only": True}} # we should be able to read who the author is but we shouldn't be able to write who the author is
        # we will manually set who the author is based on who creates this note,
        # we don't want  someone to be able to tell us who the author is
        # so if I'm signed in an I'm authenticated and I make the note 
        # then I become the author so we are specifying it as read_only 
        # which means we can't write it, just read what it is
        # we want this field to be set by the backend, not by someone who is
        # deciding who the author should be

