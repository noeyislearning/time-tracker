from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from .models import Track
from .serializers import TrackCreateSerializer, TrackRetrieveSerializer

class TrackList(generics.ListAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


class TrackCreate(generics.CreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackCreateSerializer  


class TrackListCreate(generics.ListCreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


class TrackRetrieve(generics.RetrieveAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


class TrackRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


class UserTrackList(generics.ListAPIView):
    serializer_class = TrackRetrieveSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')  # Extract user_id from URL parameters
        
        # Filter tracks by the specified user ID
        return Track.objects.filter(added_by_id=user_id)
    
class StopTrackView(generics.UpdateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'EN'
        instance.end_time = timezone.now()
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
