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

#### Challenges faced:
* Restarting Jenkins: While executing the Groovy script & installing Jenkins plugins, the task was failing every time. After investing a lot of time in this particular issue, we found that after any kind of configuration change in Jenkins, we need to restart it, so that the latest changes take effect.

* Disabling the setup wizard: This particular task took up a lot of time. Initially, for skipping the default admin password Jenkins wizard, we tried disabling security in the config.xml file, which seemed to work fine. But we thought that instead of that approach, creating a sample user would be better. We were able to create a sample user via the Groovy script and the initial wizard which was asking for the default admin password was skipped. However, the next plugin wizard was still appearing. We finally came up with a script that enabled us to skip plugin wizard from appearing.

### Checkbox.io + iTrust.io build jobs



### Checkbox Configuration

To configure Checkbox.io we have following files:
* mainDOCheckbox.js :  This creates a digital ocean droplet and save its ip in inventory file.
* postBuildCheckbox.yml : Which configure the digital ocean droplet to run Checkbox.io. The most important issues that we faced are:
  - Setting the environment variables: They added in the /etc/enviroment and setup successfully after rebooting the server. 
  - Create a mongodb user: We installed pymongo and using it we were able to create a mongodb user.
  - Configure nginx: We changed the root path in the default file and then added it to /etc/nginx/sites-available.
  - Change permissions: To have the running checkbox we had to change permission of the /root/checkbox/public_html and make it executable. We applied chmod +x to /root/ , /root/checkbox and /root/checkbox/public_html.

After running checkbox.yml on inventory file, Checkbox.io is accessible using the ip address of the server.

### iTrust Setup

One of the more difficult tasks in automating the process of building and starting iTrust automatically involved setting up the digital ocean server and provided the necessary foundations for ansible to take of the process. I had to devise a technique using node that allowed me to automatically install python on the DO droplet so that ansible could run without intervention. I also was required to dynamically generate the ansible inventory file with the corresponding IP address of the newly created droplet along with the ssh key path that would provide ansible access to the droplet. The actual building of the iTrust components was not that bad. The most difficult aspect of this was ensuring that all required configuration files were being modified and storing the appropriate information, such as usernames and passwords, which were stored in environment variables. Having the environment variables be available for the jenkins server while not exposing sensitive information was also a problem that I had to surmount. This was accomplished by putting all sensitive environment variables in a seperate file that the host would export to the jenkins server.

## Screencast
https://youtu.be/6xfuTUDmyU8
