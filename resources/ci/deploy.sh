#!/usr/bin/env bash

CLONE_PATH=$1
DEPLOY_PATH=$2
NGINX_PATH=/etc/nginx/conf.d/cpanel.conf

WD=`pwd`
counter=0

print_status(){
  ((counter=counter+1))
  echo
  echo "${counter}:    $1"
  echo
}

cd "$CLONE_PATH"
git checkout master

mv resources/gitignore/src/app/config/setting.var.ts src/app/config/setting.var.ts

print_status "Installing Node Packages"
npm install --no-progress

print_status "Running Deploy Tasks"
gulp deploy:web
gulp deploy:server
gulp deploy:cpanel

print_status "Configuring NGINX"
cd ${WD}
mv ${CLONE_PATH}/resources/docker/nginx.conf ${NGINX_PATH}
cd ${CLONE_PATH}

print_status "Installing Node Packages for Web Server"
cp package.json build/app/server/package.json
cd build/app/server
npm install --production --no-progress

cd "$WD"
if [ -d "$DEPLOY_PATH" ]; then
  print_status "Stopping Previously Running Containers"
  cd "$DEPLOY_PATH"
  docker-compose stop
  docker-compose down
  cd "$WD"
fi

rm -rf "${DEPLOY_PATH}"
mkdir -p "${DEPLOY_PATH}"
mv ${CLONE_PATH}/build/app "${DEPLOY_PATH}/app"
mv ${CLONE_PATH}/resources/docker/docker-compose.yml "${DEPLOY_PATH}/docker-compose.yml"

print_status "Starting Containers"
cd "$DEPLOY_PATH"
docker-compose up -d --build

print_status "All done"
exit 0