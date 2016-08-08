FROM node:4

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/app/

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

# Modify the REPO variable to tell the container where to pull
# ENV REPO=[repourl here]

CMD [ "scripts/start.sh" ]
