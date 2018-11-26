FROM alpine:latest
RUN echo Updating existing packages, installing and upgrading python and pip.
RUN apk update && apk add --no-cache py-pip python-dev build-base
RUN pip install --upgrade pip
RUN echo Copying the Mythical Mysfits Flask service into a service directory.
WORKDIR /MythicalMysfitsService
COPY /service /MythicalMysfitsService/
RUN echo Installing Python packages listed in requirements.txt
RUN pip install -r ./requirements.txt
RUN echo Starting python and starting the Flask service...
ENTRYPOINT ["python"]
CMD ["mythicalMysfitsService.py"]
