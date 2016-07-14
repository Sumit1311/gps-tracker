FROM node:0.12

WORKDIR /src/app

RUN apt-get update && \
    apt-get install -y unzip && \
    mkdir Installations && \
    wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip -P Installations && \
    unzip Installations/ngrok-stable-linux-amd64.zip -d Installations

COPY . /src/app

RUN npm install