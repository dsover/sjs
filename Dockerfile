FROM node:latest

# setup docker environment

#install and clean up
RUN apt-get update

# Make sure nodeJS & ffmpeg are installed
RUN node -v
RUN npm version

ADD . /app/
WORKDIR /app

RUN npm install --production
ENTRYPOINT ["npm"]
CMD ["start"]
# CMD ["node", "server"]
