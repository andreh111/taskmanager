

## Run all docker containers: 
`docker compose up --build -d`

## All the docker containers that are managed in `docker-compose.yml` file:
- Django App
- Postgres: This is used to store our data
- MongoDB: This is used for storing event logs
- Redis & Celery: for task queuing: in our case to send emails for created tasks
  (P.S: emails only handled in dev mode using `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` in `settings.py` file. in prod mode needed to be configure smtp settings etc..

### Security not handled well => all our db passwords, API keys, etc... should be stored securely in env variables, etc... not handled in this task.



# To run the frontend 

run in `/frontend` directory `npm run dev`
