(Assuming using DigitalOcean)

1. Edit ./build_itrust.sh
  a. Update SSHKEY_PATH to point to private key used to log into spawned droplet.
  b. update MYSQL_PASSWORD to desired password for iTrust password
2. npm install

3. update do.js
  a. ssh_key id in data params for createDroplet.
  b. Update inventory output droplet header (currently [iTrust]) to match ansible script host.

4. update playbook.yml
  a. update email_username (if desired, not used)


Jenkins:
1. If everything before has been set up
2. chmod +x build_itrust.sh
3. execute script
