from rest_framework import serializers
from .models import visualizationMesh

class bufferedGeometrySerializer(serializers.ModelSerializer):
    class Meta:
        model = visualizationMesh
        fields = ('project','mesh','faces','edges','points','boundingBox')
