#!/bin/sh

cd /var/lib/jenkins/workspace/postBuild/
npm install
node mainDOITrust.js
ansible-playbook -i inventoryITrust postBuildITrust.yml -l iTrust