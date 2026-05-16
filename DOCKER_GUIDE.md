# AquaShield Docker Guide 🐳

This guide provides instructions on how to containerize and run the **AquaShield** Water Potability Prediction System using Docker.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- The `models/water_model.pkl` file must exist in the project root (run `python model.py` to generate it if missing).

## 1. Build the Docker Image
Open your terminal in the project root and run:
```bash
docker build -t aquashield-api .
```
- `-t aquashield-api`: Tags the image with a friendly name.
- `.`: Tells Docker to use the current directory for the build context.

## 2. Run the Container
Once the build is complete, start the container:
```bash
docker run -p 8000:8000 --name aquashield-container aquashield-api
```
- `-p 8000:8000`: Maps port 8000 on your machine to port 8000 in the container.
- `--name aquashield-container`: Gives the running container a specific name.

## 3. Test the API
Once the container is running, access the following in your browser:
- **Interactive Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

## Troubleshooting 🛠️

### Port 8000 Already in Use
If you get an error saying `Bind for 0.0.0.0:8000 failed`, it means another process is using port 8000.
**Solution**: Use a different host port:
```bash
docker run -p 8080:8000 aquashield-api
```
Then access it at `http://localhost:8080`.

### Missing Model File
If the container starts but logs show `FileNotFoundError: models/water_model.pkl`, ensure you have the model file in your local `models/` folder before building the image.
**Solution**: Run `python model.py` locally first, then rebuild the image.

### Docker Daemon Issues
If you see `error during connect: This error may indicate that the docker daemon is not running`, ensure Docker Desktop is started.

### Dependency Issues
If `pip install` fails during build, ensure your `requirements.txt` is up to date and doesn't have conflicting versions.

## Useful Docker Commands
- **Stop the container**: `docker stop aquashield-container`
- **Remove the container**: `docker rm aquashield-container`
- **View logs**: `docker logs -f aquashield-container`
- **List images**: `docker images`
