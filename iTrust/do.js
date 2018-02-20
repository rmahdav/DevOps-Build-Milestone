var needle = require("needle");
var os   = require("os");
var sleep = require("sleep");
var sshExec = require('ssh-exec');
var fs = require('fs');

var config = {};
config.token = process.env.DO_TOKEN;

var name = "iTrust";
var region = "nyc3"; // Fill one in from #1
var image = "ubuntu-16-04-x64"; // Fill one in from #2
var vm_user = "root";
var vm_ssh_key_path = process.env.SSHKEY_PATH;
var maxrequest = 5;
var cntr = 0;
var dropletID;

//console.log("Your token is:", config.token);

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
    createDroplet: function (dropletName, region, imageName, onResponse)
    {
        var data = {
                "name": dropletName,
                "region":region,
                "size":"512mb",
                "image":imageName,
                // Id to ssh_key already associated with account.
            //"ssh_keys":[10414827],
                "ssh_keys":[18349295],
                "backups":false,
                "ipv6":false,
                "user_data":null,
                "private_networking":null
        };

        //console.log("Attempting to create: "+ JSON.stringify(data) );

        needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
    },
    listDropletIP: function( onResponse ) {
        var url = "https://api.digitalocean.com/v2/droplets/" + dropletID;
        //console.log("URL: " + url);
        needle.get(url, {headers:headers}, onResponse)
    },
    deleteDroplet: function ( onResponse ) {
        var url = "https://api.digitalocean.com/v2/droplets/" + dropletID;

        needle.delete(url, null, {headers:headers}, onResponse);
    }
};

var listDropletRespFunc = function(err, resp) {
            var data = resp.body;

            var ip = data.droplet.networks.v4[0].ip_address;

            if ( ip === undefined && cntr <= maxrequests ) {
                cntr++;
                //console.log("ip still undefined");
                sleep.sleep(20);
                client.listDropletIP(listDropletRespFunc);
            } else {
                //ip = JSON.stringify(ip);

                sleep.sleep(30);

		sshExec('sudo apt-get update && sudo apt-get -y install python', {
		    user: vm_user,
                    host: ip,
                    key: vm_ssh_key_path
		}, function (err, stdout, stderr) {
                    console.log(err, stdout, stderr)
                }).pipe(process.stdout);

		var ansibleInventoryFile = fs.createWriteStream('inventory', {
			flags: 'w' // 'a' means appending (old data will be preserved)
		});

		ansibleInventoryFile.write("[iTrust]\n" + ip + " ansible_ssh_user=" + vm_user + " ansible_ssh_private_key_file=" + vm_ssh_key_path + "\n");

		ansibleInventoryFile.end();

                console.log("A python capable droplet has been created at: " + ip);
            }

            /*client.deleteDroplet(function (err, resp) {
                if(!err && resp.statusCode == 204) {
                    console.log("Droplet: " + dropletID + " deleted");
                } else {
                    console.log("Error deleting droplet: " + dropletID);
                    console.log("Status code: " + resp.statusCode);
                }
            });*/
            
};

client.createDroplet(name, region, image, function(err, resp, body)
{
	// StatusCode 202 - Means server accepted request.
    if(!err && resp.statusCode == 202) {
        var data = resp.body;

        dropletID = data.droplet.id;
        //console.log("dropletID: " + dropletID);

        //console.log(data);
        sleep.sleep(20);
        client.listDropletIP(listDropletRespFunc);
    }
});

// Used to get ssh keys for accoun
/*client.getKeys(function(err, resp, body) {
    console.log(body);
});*/
