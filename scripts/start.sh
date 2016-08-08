#!/bin/bash

# if there was a private key url specified, copy it so it can be used to pull the REPO
mkdir -p /root/.ssh
curl $PRIVATE_KEY_URL -o /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa && echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config
ssh-keyscan github.com >> /root/.ssh/known_hosts

npm start
