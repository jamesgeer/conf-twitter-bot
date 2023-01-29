<div align="center">
    <h1>Conference Twitter Bot</h1>
    <p>A tool to automate the promotion of research presented at academic conferences.</p>
</div>

## Setup
- Download or clone the source code
- Install the packages using the following command:

`npm run install-packages`

## Docker
Using Docker compose, the project can be started using the following command:

`docker-compose up`

## Useful commands

`npx prisma migrate dev --name "name_of_migration"` - creates a new migration from the schema file

`docker-compose up --build` - rebuilds the containers

`wsl --shutdown` - emergency command in case Docker is using too much memory (need restart to start wsl again)

