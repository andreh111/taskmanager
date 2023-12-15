

## Run all docker containers: 
`docker compose up --build -d`

## All the docker containers that are managed in `docker-compose.yml` file:
- Django App (pipenv is used to manage this project dependencies so after installing a library we need to run `pipenv requirements > requirements.txt` to freeze it in requirements file and then we need to rerun `docker compose up --build -d`
- Postgres: This is used to store our data
- MongoDB: This is used for storing event logs
- Redis & Celery: for task queuing: in our case to send emails for created tasks
  (P.S: emails only handled in dev mode using `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` in `settings.py` file. in prod mode needed to be configure smtp settings etc..

### Security not handled well => all our db passwords, API keys, etc... should be stored securely in env variables, etc... not handled in this task.



# To run the frontend 

run in `/frontend` directory `npm run dev` (check Readme.md inside `frontend/` folder)



<img width="700" alt="Screenshot 2023-12-15 at 11 29 18 AM" src="https://github.com/andreh111/taskmanager/assets/36291999/384c800e-ce96-4172-a2e3-10cc90fc67e2"> <br />

<img width="700" alt="Screenshot 2023-12-15 at 11 29 57 AM" src="https://github.com/andreh111/taskmanager/assets/36291999/290eea58-1230-472b-8e32-b05b93cd6d0b"> <br />

<img width="700" alt="tes" src="https://github.com/andreh111/taskmanager/assets/36291999/efa981e4-928c-4283-9b59-cf058dfbaaba">

