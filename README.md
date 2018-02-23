# csc519-cm-build
Repository for our groups Configuration Management Build Milestone

## Contributions

| Team Member   | Unity ID | Contribution   
| ------------- | ----------- | ------------ 
| Seth Butler      | scbutle2 |   iTrust post-build configuration       
| Akshit Patel     | aapatel8 |   checkbox.io + iTrust.io build jobs
| Kunal Kulkarni | krkulkar | Jenkins automation
| Rezvan Mahdavi Hezaveh  |  rmahdav |   checkbox.io post-build configuration

## Configuration Management Build Milestone

### Setting up Jenkins and its Configuration

setUpJenkins_playbook.yml is the playbook which automates setting up Jenkins on a VM. It makes use of a groovy script, named jenkins_script.groovy.j2 for the purpose of creating a sample user named admin, with his password as admin.

### Checkbox Configuration

To configure Checkbox.io we have following files:
* main_digitalocean.js :  This creates a digital ocean droplet and save its ip in inventory file.
* checkbox.yml : Which configure the digital ocean droplet to run Checkbox.io. The following tasks are done in the playbook:
  - Install python to use ansible.
  - Add environment variables to /etc/enviroment files using variable file in template folder.
  - Restart the server to set environment variables.
  - Install git.
  - Install nodejs and npm.
  - Install nginx.
  - Install mongodb which has four steps: Import mongodb public key, Create a list file for mongodb, Update apt-get to have mongodb package and Install mongodb.
  - Start mongodb service.
  - install python setuptools and pymongo using it to be able to create mongodb user.
  - Create an admin user for mongodb.
  - Clone the checkbox.io repository and Install packages.
  - Changing permission of the /root/checkbox/public_html to make it executable. Whithout this we got 500 error on the server. It should be applied to /root/ , /root/checkbox and /root/checkbox/public_html.
  - Add default file to nginx using default file in templates folder.
  - Add nginx.conf file to /etc/nginx using nginx.config file in templates folder.
  - Reload nginx to apply new configuration.
  - Install forever to manage running application.
  - Run the checkbox.io using forever.
* Templates : There exist some files we used in playbook.
  - default: Which is default file to configure nginx. We changed the root to the root of the application on the server.
  - nginx.config: Which is nginx.conf file to configure nginx.
  - variables: The list of variables to save as environment variables on the server. This files contains the following variables:
    - MONGO_PORT
    - MONGO_IP
    - MONGO_USER
    - MONGO_PASSWORD
    - MAIL_USER
    - MAIL_PASSWORD
    - MAIL_SMTP

After running checkbox.yml on inventory file, Checkbox.io is accessible using the ip address of the server.

## Screencast
