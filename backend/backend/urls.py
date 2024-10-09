from django.contrib import admin # to access the built-in admin views
from django.urls import path # to handle the url routing
from django.urls import include # to extend sub-urls from another file
from api.views import CreateUserView # class-based view to be rendered
from rest_framework_simplejwt.views import TokenObtainPairView # view to render the page to obtain the access and refresh JWTs (JSON Web Token)
from rest_framework_simplejwt.views import TokenRefreshView # view to render the page to obtain the refresh token

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"), # name for reverse url search TODO
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")), # for urls like api/notes, api/notes/delete 
]
