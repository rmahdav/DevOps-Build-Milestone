# csc519-cm-build
Repository for our groups Configuration Management Build Milestone

## Contributions

| Team Member   | Unity ID | Contribution   
| ------------- | ----------- | ------------ 
| Seth Butler      | scbutle2 |   iTrust post-build configuration       
| Akshit Patel     | aapatel8 |   checkbox.io + iTrust.io build jobs
| Kunal Kulkarni | krkulkar | Jenkins automation
| Rezvan Mahdavi Hezaveh  |  rmahdav |   checkbox.io post-build configuration

To replicate - make sure to set appropriate environment variables on host machine
Environment varibles are also required for the Jenkins server which are stored in templates/variables (not included in the repo for security purposes). These variables are added when setting up Jenkins build jobs and are used later during post-build actions.

* To create a node for Jenkins - node mainDO.js
* To setup jenkins on above node - ansible-playbook -i inventory setUpJenkins_playbook.yml -l main
* To create iTrust2 build on Jenkins server - ansible-playbook -i inventory iTrust2.yml -l main
* To create Checkbox build on Jenkins server - ansible-playbook -i inventory Checkbox.yml -l main
  * Keys needed for Jenkins and VMs created in post-build actions are stored in a keys directory (not included for security purposes)

## Configuration Management Build Milestone

### Setting up Jenkins and its Configuration

setUpJenkins_playbook.yml is the playbook which automates setting up Jenkins on a VM. It makes use of a groovy script, named jenkins_script.groovy.j2 for the purpose of creating a sample user named admin, with his password as admin.

### Checkbox.io + iTrust.io build jobs

This part included created the Checkbox and iTrust build jobs on the Jenkins server. Then, running these jobs and having the post-build actions start VMs with the appropriate applications running. The difficult part here was first getting the Jenkins jobs manually setup so that XML for the job can be retrieved after. Main issues were face during the post-build action when the appropriate tokens/passwords were needed from the host machine to be able to allow ansible to configure and the applications and have them running. One particular issue faced was setting up a jenkins user on mysql. Root was unable to receive grant privileges with Ansible and I had to come up with a workaround.

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

### iTrust Setup

One of the more difficult tasks in automating the process of building and starting iTrust automatically involved setting up the digital ocean server and provided the necessary foundations for ansible to take of the process. I had to devise a technique using node that allowed me to automatically install python on the DO droplet so that ansible could run without intervention. I also was required to dynamically generate the ansible inventory file with the corresponding IP address of the newly created droplet along with the ssh key path that would provide ansible access to the droplet. The actual building of the iTrust components was not that bad. The most difficult aspect of this was ensuring that all required configuration files were being modified and storing the appropriate information, such as usernames and passwords, which were stored in environment variables. Having the environment variables be available for the jenkins server while not exposing sensitive information was also a problem that I had to surmount. This was accomplished by putting all sensitive environment variables in a seperate file that the host would export to the jenkins server.

## Screencast
https://youtu.be/6xfuTUDmyU8