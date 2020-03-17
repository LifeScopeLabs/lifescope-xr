FROM node:12

WORKDIR /usr/src/lifescope-xr

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 3003
EXPOSE 3004

CMD ["npm", "run", "build-prod"]

CMD ["npm", "run", "start"]