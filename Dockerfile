FROM node:12.16.1
RUN mkdir /src
WORKDIR /src

COPY package.json /src
RUN npm install

COPY . /src
CMD ["npm","start"] 