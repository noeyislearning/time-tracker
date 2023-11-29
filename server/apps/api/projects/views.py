# Import necessary modules from Django Rest Framework
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

# Import the Project model and ProjectSerializer from the current directory
from .models import Project
from .serializers import ProjectSerializer


# This view handles GET requests and returns a list of all projects
class ProjectList(generics.ListAPIView):
    # Specify the queryset to be used for this view
    queryset = Project.objects.all()
    
    # Specify the serializer to be used for this view
    serializer_class = ProjectSerializer


# This view handles POST requests and creates a new project
class ProjectCreate(generics.CreateAPIView):
    # Specify the queryset to be used for this view
    queryset = Project.objects.all()
    
    # Specify the serializer to be used for this view
    serializer_class = ProjectSerializer


# This view handles GET requests and returns a single project
class ProjectRetrieve(generics.RetrieveAPIView):
    # Specify the queryset to be used for this view
    queryset = Project.objects.all()
    
    # Specify the serializer to be used for this view
    serializer_class = ProjectSerializer


# This view handles GET, PUT, PATCH, and DELETE requests for a single project
class ProjectRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    # Specify the queryset to be used for this view
    queryset = Project.objects.all()
    
    # Specify the serializer to be used for this view
    serializer_class = ProjectSerializer


# This view handles GET requests and returns a single project with its associated tracks
class ProjectTracksList(APIView):
    # Specify the serializer to be used for this view
    serializer_class = ProjectSerializer


    # Define the method to handle GET requests
    def get(self, *args, **kwargs):
        try: 
            # Try to get the project with the given pk and its associated tracks
            project = Project.objects.prefetch_related('tracks').get(pk=self.kwargs['pk'])
            
            # Serialize the project
            serializer = ProjectSerializer(project)
            
            # Return a response with the serialized project and a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            # If the project does not exist, return a response with an error message and a 404 Not Found status
            return Response({'Error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)