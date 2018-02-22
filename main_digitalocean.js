var needle = require("needle");
var os   = require("os");
var fs = require('fs');

var config = {};
config.token = process.env.DOTOKEN;
//console.log("Your token is:", config.token);

var headers =
{
        'Content-Type':'application/json',
        Authorization: 'Bearer ' + config.token
};

var dropletId = "";

var client =
{
        listRegions: function( onResponse )
        {
                needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
        },

        listSSHKeys: function( onResponse )
        {
                needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse)
        },
        {
                needle.get("https://api.digitalocean.com/v2/droplets/" + dropletId, {headers:headers}, onResponse)
        },

        createDroplet: function (dropletName, region, imageName, onResponse)
        {
                var data =
                {
                        "name": dropletName,
                        "region":region,
                        "size":"512mb",
                        "image":imageName,
                        // Id to ssh_key already associated with account.
                        "ssh_keys":[18278180],
                        //"ssh_keys":null,
                        "backups":false,
                        "ipv6":false,
                        "user_data":null,
                        "private_networking":null
                };

                //console.log("Attempting to create: "+ JSON.stringify(data) );

                needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
        }
};

// #############################################

 var name = "rmahdav"+os.hostname();
 var region = "nyc3";
 var image = "ubuntu-16-04-x64";
 client.createDroplet(name, region, image, function(err, resp, body)
 {
        if(!err && resp.statusCode == 202)
        {
                // console.log( JSON.stringify( body, null, 3 ) );
                dropletId = resp.body.droplet.id;
                console.log("dropletId = " + dropletId);

                function getDropletInfoCallback(error, response)
                {
                        if( (response.body.droplet.networks.v4.length > 0)  && (response.body.droplet.status == "active") )
        {
                                ip_address = response.body.droplet.networks.v4[0].ip_address;
                                console.log("digitalocean server ip = " + JSON.stringify( ip_address, null, 3) );
                                // Add ip to inventory file
                                fs.appendFileSync("inventory", '\n' + '[checkbox]' + '\n' + ip_address + ' ansible_ssh_user=root ansible_ssh_private_key_file=/home/vagrant/.ssh/id_rsa');
                        }
                        else { //If creating of the droplet is on progress and ip address is not ready
                                setTimeout(function () {
                client.getDropletInfo(getDropletInfoCallback);
                                }, 2000);
                        }
                }
                client.getDropletInfo(getDropletInfoCallback);
                }
        });
