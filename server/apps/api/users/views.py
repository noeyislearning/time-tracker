from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from .serializers import RegisterUserSerializer, CustomAuthTokenSerializer

class CustomUserRegister(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    serializer_class = CustomAuthTokenSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        if user:

          # Update "is_login" field to True
          user.is_login = True
          user.save()

          return Response({
              **tokens,
              'user_id': user.pk,
              'email': user.email,
              'user_name': user.user_name,
              'first_name': user.first_name,
              'last_name': user.last_name,
              'is_login': user.is_login,
          })
    
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
class CustomLogout(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Update "is_login" field to False
            user = request.user
            user.is_login = False
            user.save()

            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'An error occurred during logout'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RetrieveUserData(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'user_id': user.pk,
            'email': user.email,
            'user_name': user.user_name,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_login': user.is_login,
        }, status=status.HTTP_200_OK)
