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

### Checkbox Configuration

To configure Checkbox.io we have following files:
* main_digitalocean.js :  This creates a digital ocean droplet and save its ip in inventory file.
* checkbox.yml : Which configure the digital ocean droplet to run Checkbox.io. The following tasks are done in the playbook:
1. Install python to use ansible
2. Add environment variables to /etc/enviroment files using variable file in template folder
3. Restart the server to set environment variables
4. Install git
5. Install nodejs and npm
6. Install nginx
7. Install mongodb which has four steps: Import mongodb public key, Create a list file for mongodb, Update apt-get to have mongodb package and Install mongodb
8. Start mongodb service
9. install python setuptools and pymongo using it to be able to create mongodb user
10. Create an admin user for mongodb
11. Clone the checkbox.io repository and Install packages
12. Changing permission of the /root/checkbox/public_html to make it executable. Whithout this we got 500 error on the server. It should be applied to /root/ , /root/checkbox and /root/checkbox/public_html.
13. Add default file to nginx using default file in templates folder
14. Add nginx.conf file to /etc/nginx using nginx.config file in templates folder
15. Reload nginx to apply new configuration
16. Install forever to manage running application
17. Run the checkbox.io using forever
* Templates : There exist some files we used in playbook.
1. default: Which is default file to configure nginx. We changed the root to the root of the application on server.
2. nginx.config: Which is nginx.conf file to configure nginx.
3. variables: The list of variables to save as environment variables on the server.

After running checkbox.yml on inventory file, Checkbox.io is accessible using the ip address of the server.

## Screencast
