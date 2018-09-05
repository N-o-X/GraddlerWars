# GraddlerWars
A NodeJS multiplayer quiz game using socket.io

## Usage

Starting the server:
```
npm start
```

Now just navigate to `YOURIP:3000` and start playing.

If you turned of `autoplay`, you can start and control the game using `YOURIP:3000/master`

## Installation

Just clone this repository and type:
```
npm install
```

## Docker

You can run and use GraddlerWars using Docker.

This repository contains a `docker-compose.yml` which starts a MySQL and GraddlerWars itself with a german set of questions.
The GraddlerWars container will be exposed on port 3000.

If you're using Traefik, or want to change the expose port just copy `.env.example` to `.env` and edit it to your likings before running:

```
docker-compose up -d
```
