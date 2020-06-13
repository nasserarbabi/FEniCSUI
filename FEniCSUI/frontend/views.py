from rest_framework.response import Response
from rest_framework.views import APIView
import yaml


class frontEndConfig(APIView):

    def get(self, request, *args, **kwargs):
        """
        return a dictionary read from the config.yml file
        """
        with open('../config.yml') as configFile:
            config = yaml.load(configFile, Loader=yaml.FullLoader)
        return Response(config)