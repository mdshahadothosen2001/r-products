from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from wishlist.models import Wishlist
from wishlist.serializers import WishlistSerializer
from user.models import UserAccount as User


# ✅ GET wishlist list
class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user.id)


# ✅ POST add to wishlist
class WishlistAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "Product ID required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=request.user.id)
        wishlist, created = Wishlist.objects.get_or_create(
            user=user, product_id=product_id
        )

        if not created:
            return Response({"message": "Already in wishlist"}, status=status.HTTP_200_OK)

        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ✅ DELETE wishlist item
class WishlistDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            wishlist_item = Wishlist.objects.get(pk=pk, user=request.user.id)
            wishlist_item.delete()
            return Response({"message": "Removed from wishlist"}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
