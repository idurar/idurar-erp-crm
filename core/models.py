from django.db import models

class Query(models.Model):
    customer_name = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=[("Open", "Open"), ("InProgress", "InProgress"), ("Closed", "Closed")], default="Open")
    resolution = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Note(models.Model):
    query = models.ForeignKey(Query, related_name='notes', on_delete=models.CASCADE)
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)