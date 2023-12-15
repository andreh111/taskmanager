

## Run all docker containers: 
`docker compose up --build -d`

## All the docker containers that are managed in docker-compose.yml file:
- Django App
- Postgres: This is used to store our data
- MongoDB: This is used for storing event logs
- Redis & Celery: for task queuing: in our case to send email for created tasks



# To run the frontend 

run in `/frontend` directory `npm run dev`
