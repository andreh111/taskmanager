from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .mongo_utils import log_event
from rest_framework_simplejwt.views import TokenObtainPairView
from .signals import send_notification_email


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    permission_classes = [permissions.IsAuthenticated]  # Restrict to authenticated users

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

        # Log the event with user ID
        if self.request.user and self.request.user.is_authenticated:
            user_id = self.request.user.id  # Get user ID
            log_event('task_created', {'user_id': user_id, 'task': serializer.instance.id})

            # Trigger Celery task for email notification
            send_notification_email.delay(self.request.user.email, serializer.instance.id)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Log the event of user registration
        log_event('user_registered', {'user_id': user.id})

        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response(res, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Perform the standard behavior of TokenObtainPairView
        response = super().post(request, *args, **kwargs)

        # Log the event if the token is successfully obtained
        if response.status_code == 200:
            # Extract username from the request
            username = request.data.get('username', 'Unknown')

            # Log the event with the username
            log_event('token_obtained', {'username': username})

        return response