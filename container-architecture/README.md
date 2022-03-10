## Getting Started

### Building and Running Docker Image

```bash
docker build -t color-to-rgb .
docker run -d -p 80:8000 color-to-rgb
```

### Setting up and Deploying on ECR + ECS

```bash
Commands
------------
1. Build Docker Image
docker build -t color-to-rgb .

2. Run container /w image
docker run -d -p 80:8000 color-to-rgb

3. Login to ECR
aws ecr get-login-password --region {region} | docker login --username AWS --password-stdin {account-id}.dkr.ecr.{region}.amazonaws.com

4. Tag the version
docker tag test:latest {account-id}.dkr.ecr.{region}-1.amazonaws.com/YOURREPO:YOURTAG

5. Upload
docker push {account-id}.dkr.ecr.{region}-1.amazonaws.com/YOURREPO:YOURTAG
```

### Video Tutorial of Setting up

[https://www.youtube.com/watch?v=zs3tyVgiBQQ](https://www.youtube.com/watch?v=zs3tyVgiBQQ)
