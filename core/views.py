from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Query, Note
from .serializers import QuerySerializer, NoteSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'limit'

class QueryViewSet(viewsets.ModelViewSet):
    queryset = Query.objects.all().order_by('-created_at')
    serializer_class = QuerySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        query = self.get_object()
        note_text = request.data.get('note_text')
        note = Note.objects.create(query=query, note_text=note_text)
        return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='notes/(?P<note_id>[^/.]+)')
    def delete_note(self, request, pk=None, note_id=None):
        try:
            note = Note.objects.get(pk=note_id, query_id=pk)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
