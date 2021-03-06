#!/usr/bin/env bash

CLONE_PATH=$1
DEPLOY_PATH=$2
NGINX_PATH=/etc/nginx/conf.d/vesta-template-client.conf

WD=`pwd`
counter=0

print_status(){
  ((counter=counter+1))
  echo
  echo "${counter}:    $1"
  echo
}

# environmental variables
NODE_ENV=production
REACT_APP_API_ENDPOINT=https://api.vesta.bz

cd ${CLONE_PATH}
git checkout master
print_status "Cloning SubModules"
git submodule update --init src/cmn
git submodule foreach git checkout master

print_status "Executing pre-deploy Script"
chmod +x resources/ci/scripts/pre-deploy.js
./resources/ci/scripts/pre-deploy.js

#print_status "Configuring NGINX"
#sudo mv resources/ci/nginx/client.conf ${NGINX_PATH}

print_status "Installing Node Packages"
npm install

print_status "Running Deploy Tasks"
npm run build

cd ${WD}
rm -rf ${DEPLOY_PATH}
mkdir -p ${DEPLOY_PATH}
mv ${CLONE_PATH}/build ${DEPLOY_PATH}/www

#print_status "Re-Starting NGINX"
#sudo service nginx restart

print_status "All done"
exit 0