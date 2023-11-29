from datetime import timedelta
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from .models import Track
from .serializers import TrackCreateSerializer, TrackRetrieveSerializer

# This view is used to list all tracks
class TrackList(generics.ListAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


# This view is used to create a new track
class TrackCreate(generics.CreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackCreateSerializer  


# This view is used to list all tracks or create a new track
class TrackListCreate(generics.ListCreateAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


# This view is used to retrieve a specific track
class TrackRetrieve(generics.RetrieveAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 


# This view is used to retrieve, update, or delete a specific track
class TrackRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackRetrieveSerializer 

# This view is used to list all tracks added by a specific user
class UserTrackList(generics.ListAPIView):
    serializer_class = TrackRetrieveSerializer

    def get_queryset(self):
        # Extract user_id from URL parameters
        user_id = self.kwargs.get('user_id')  
        
        # Filter tracks by the specified user ID
        return Track.objects.filter(added_by_id=user_id)
    

# This view is used to stop a specific track
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


# This view is used to retrieve the total duration of tracks added by a specific user within a week
class WeeklyTotalDurationView(generics.RetrieveAPIView):
    serializer_class = TrackRetrieveSerializer

    def get_queryset(self):
        # Extract user_id from URL parameters
        user_id = self.kwargs.get('user_id')  

        # Get the start and end of the week
        today = timezone.now()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        # Filter tracks within the week for the specified user ID
        return Track.objects.filter(
            added_by_id=user_id,
            start_time__date__gte=start_of_week.date(),
            start_time__date__lte=end_of_week.date()
        )

    def get(self, request, *args, **kwargs):
        tracks_within_week = self.get_queryset()

        # Calculate total duration for the tracks within the week
        total_duration = timedelta()
        for track in tracks_within_week:
            if track.start_time and track.end_time:
                duration = track.end_time - track.start_time
                total_duration += duration

        # Format the total duration as desired (e.g., HH:MM:SS)
        total_duration_formatted = str(total_duration).split('.')[0]  # Excluding milliseconds

        # Get the start and end dates of the week
        today = timezone.now()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        # Format dates as strings
        start_date_str = start_of_week.date().strftime('%Y-%m-%d')
        end_date_str = end_of_week.date().strftime('%Y-%m-%d')

        # Return the response
        return Response({
            "start_date": start_date_str,
            "end_date": end_date_str,
            "total_duration_within_week": total_duration_formatted
        })
