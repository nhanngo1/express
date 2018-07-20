const https = require('https')
const fs = require('fs');
const url = require('url');

const GITHUB_TOKEN = '974d3fefc667101ef1c4b52a339b5e3b1f0eb495';

function writeFile(name, data) {
    fs.writeFile(name, JSON.stringify(data), function(err) {
        if (err)
            throw err;
        console.log('data saved.');
    })
}

// get data from internet then save to local file data.json
function getUserData(user) {
    let data = "";
    let resBody = "";
    let selectedUser = "";
    try {
        data = require('./data.json');
        data = JSON.parse(data);
        console.log(data.length);

        selectedUser = data.find(item => {
            return item.login == user
        })
    } catch (err) {
        console.log(`findUser error ${err.message}`)
    }

    if (selectedUser) {
        console.log(`${user} info is available is local db`);
        //return selectedUser;
    } else {
        console.log("get user from github");

        let link = url.parse(`https://api.github.com/users/${user}`);
        let options = {
            hostname: link.hostname,
            path: link.path,
            method: "GET",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        }

        let req = https.request(options, async(res) => {
            try {
                data = require('./data.json').toString();
            } catch (err) {
                console.log(`data error ${err.message}`)
            }

            res.setEncoding("UTF-8");

            res.once('data', function() {
                console.log('start retrieving data...')
            })

            res.on('data', function(chunk) {
                resBody += chunk;
            })

            res.on('end', () => {

                data = data.replace("[", "");
                data = data.replace("]", "");
                if (data === "")
                    data = "[" + resBody + "]"
                else
                    data = "[" + data + "," + resBody + "]"
                selectedUser = resBody
                writeFile('data.json', data);

                // fs.writeFile('data.json', JSON.stringify(data), function(err) {
                //     if (err)
                //         throw err;
                //     console.log('data saved.');
                //     selectedUser = resBody
                // })
            })
        })

        req.on("error", function(err) {
            console.log(`request error ${err.message}`)
        })

        req.end();
    }
    return selectedUser;
}

exports.getUserData = getUserData;
exports.writeFile = writeFile;