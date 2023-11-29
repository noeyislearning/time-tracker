from datetime import timedelta
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


class WeeklyTotalDurationView(generics.RetrieveAPIView):
    serializer_class = TrackRetrieveSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')  # Extract user_id from URL parameters

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

        return Response({
            "start_date": start_date_str,
            "end_date": end_date_str,
            "total_duration_within_week": total_duration_formatted
        })
