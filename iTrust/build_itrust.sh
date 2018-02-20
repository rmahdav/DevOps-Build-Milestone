#/bin/bash

export SSHKEY_PATH=/Users/Swag/.ssh/devops_rsa
export MYSQL_PASSWORD=testing
export ANSIBLE_HOST_KEY_CHECKING=False

# make droplet
node do.js

# Run ansible
ansible-playbook playbook.yml -i ./inventory
