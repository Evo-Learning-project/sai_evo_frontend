# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster


# FROM node:17.6.0-alpine3.15
FROM node:17.6-bullseye

# RUN apk add git
# RUN apk add g++ make py3-pip
RUN npm install --global node-gyp
RUN npm install -g @vue/cli
RUN npm install -g @vue/cli-service
RUN npm install -g typescript

USER node
RUN echo 'export NODE_OPTIONS=--openssl-legacy-provider' >> ~/.bashrc
# RUN export NODE_OPTIONS=--openssl-legacy-provider


# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"
