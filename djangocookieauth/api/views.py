import json

from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

@require_POST
def login_view(request):
    """
    Handles user login requests. This view expects a POST request with a JSON
    body containing 'username' and 'password'. It authenticates the user and 
    logs them in if the credentials are correct.

    Args:
        request (HttpRequest): The HTTP request object containing metadata about 
        the request, including POST data.

    Returns:
        JsonResponse: A JSON response indicating the result of the login attempt.
        - On success: {"detail": "Successfully logged in"} with a 200 status code.
        - On failure: {"detail": "Invalid credentials"} or 
            {"detail" : "Please provide both username and password"} with a 400 status code.
    """
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({
            "detail" : "Please provide both username and password"
            }, status=400)
    
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({
            "detail": "Invalid credentials"
            }, status=400)

    login(request, user)
    return JsonResponse({"detail": "Successfully logged in"})

def logout_view(request):
    """
    Checks if the user is authenticated and returns a JSON response indicating the authentication status.

    Args:
        request (HttpRequest): The HTTP request object containing metadata about the request.

    Returns:
        JsonResponse: A JSON response with the user's authentication status.
        - {"isauthenticated": False} if the user is not authenticated.
        - {"isauthenticated": True} if the user is authenticated.
    """

    if not request.user.is_authenticated:
        return JsonResponse({
            "detail": "You are not logged in!",
        }, status=400)
        
    logout(request)
        
    return JsonResponse({
        "detail": "Successfully logged out!",
    })
    
        
@ensure_csrf_cookie
def session_view(request):
    """
    Checks if the user is authenticated and returns a JSON response indicating the authentication status.

    Args:
        request (HttpRequest): The HTTP request object containing metadata about the request.

    Returns:
        JsonResponse: A JSON response with the user's authentication status.
        - {"isauthenticated": False} if the user is not authenticated.
        - {"isauthenticated": True} if the user is authenticated.
    """
    if not request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": False,
        })
        
    return JsonResponse({
        "isAuthenticated": True,
    })
    
    
def whoami_view(request):
    """
    Returns the username of the authenticated user.

    Args:
        request (HttpRequest): The HTTP request object containing metadata about the request.

    Returns:
        JsonResponse: A JSON response with the username of the authenticated user.
        - {"isauthenticated": False} if the user is not authenticated.
        - {"username": request.user.username} if the user is authenticated.
    """
    if not request.user.is_authenticated:
        return JsonResponse(
            {"isauthenticated": False}
        )
    return JsonResponse({
        "username": request.user.username,
    })