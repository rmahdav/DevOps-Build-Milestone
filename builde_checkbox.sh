#/bin/bash

# create droplet
node main_digitalocean.js

# Run ansible
ansible-playbook checkbox.yml -i inventory
