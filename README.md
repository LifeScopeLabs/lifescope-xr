# Lifescope XR

## How to run

You need to put the aws credentials in config/

### install dependencies

npm install

### build

npm run build
npm run build-server

### start server w/ dev credentials

NODE_ENV=dev npm run start

## Deployment

### clone repo

git clone https://github.com/mohrtw/lifescope-xr.git

### add config/prod.json

### install dependencies

npm install

### build

npm run build
npm run build-server

### test site works with only production dependencies

#### delete node_modules/

#### install production dependencies

npm install --production

#### test site works

npm run start

### zip config/, dist/, static/, and package.json

zip -r xr config/ dist/ package.json static/

### upload xr.zip to elastic beanstalk