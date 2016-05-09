FROM node:6.1
RUN mkdir /src
WORKDIR /src

COPY package.json /src
RUN npm install

COPY . /src
CMD ["npm","start"] 