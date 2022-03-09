FROM python:3.8.10-slim

# https://stackoverflow.com/questions/59812009/what-is-the-use-of-pythonunbuffered-in-docker-file
ENV PYTHONUNBUFFERED 1 
EXPOSE 8000
WORKDIR /app 

# Copy requirements from host, to docker container in /app 
COPY ./requirements.txt .
# Copy everything from . directory to /app in the container
COPY . . 

RUN pip install -r requirements.txt

# Run the application in the port 8000
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "main:app"]