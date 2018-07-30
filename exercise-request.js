const https = require('https')
const fs = require('fs');
const url = require('url');

const GITHUB_TOKEN = 'ENTER_YOUR_TOKEN_HERE';

function writeFile(user) {
    const { login } = user;

    let users = fs.readFileSync('./data.json')
    try {
        users = JSON.parse(users) || []
    } catch (error) {
        users = []
    }

    const existsUser = users.find(user => user.login.toLowerCase() === login.toLowerCase())

    if (existsUser) {
        Object.assign(existsUser, user)
    } else {
        users.push(user)
    }

    //console.log(existsUser.name)

    fs.writeFileSync('./data.json', JSON.stringify(users))
    console.log("write file finished")
}

function findUser(username) {

    let users = fs.readFileSync('./data.json')
    try {
        users = JSON.parse(users) || []
    } catch (error) {
        users = []
    }

    return users.find(user => user.login.toLowerCase() === username)
}

// get data from internet then save to local file data.json
function getUserDataFromGithub(user) {
    return new Promise((resolve, reject) => {
        let data = "";

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

            let resBody = "";
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
                console.log('retrieving data finished.')
                resolve(JSON.parse(resBody.toString()));
            })
        })

        req.on("error", function(err) {
            console.log(`request error ${err.message}`)
        })

        req.end();

    })
}

function getUsersDataFromJsonFile() {
    let users = fs.readFileSync('./data.json')
    let usersInfo = [];
    try {
        users = JSON.parse(users) || []
    } catch (error) {
        users = []
    }

    users.forEach(user => {
        let info = {
                "login": user.login,
                "name": user.name,
                "company": user.company
            }
            //console.log(info);
        usersInfo.push(info);
    })
    return usersInfo;
}

exports.getUsersDataFromJsonFile = getUsersDataFromJsonFile;
exports.getUserDataFromGithub = getUserDataFromGithub;
exports.writeFile = writeFile;
exports.findUser = findUser;