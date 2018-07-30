const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./exercise-request');
const path = require('path')
const fs = require('fs');

app.use(bodyParser());
//app.use(router);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/dataJson', (req, res) => {
    console.log('GET /dataJson')
    data = fs.readFileSync("./data.json").toString();
    try {
        res.json(JSON.parse(data));
    } catch (err) {
        res.json([]);
    }
})

app.get('/', (req, res) => {
    console.log('GET /')
    let users = util.getUsersDataFromJsonFile();
    if (!users)
        res.render('index', "")
    else
        res.render('index', { usersInfo: users })
})

app.get('/users/:user', async(req, res) => {
    console.log('GET users/user ')
    let user = req.params.user;
    let selectedUser = util.findUser(user)

    if (!selectedUser) {
        console.log("user is not found in local db")
        selectedUser = await util.getUserDataFromGithub(user)

        if (selectedUser.message == undefined) {
            console.log("write file")
            util.writeFile(selectedUser);
        }

        data = require("./data.json")
        console.log("get new data")
        let users = util.getUsersDataFromJsonFile();
        console.log(users.length)

        res.json(users)

    } else {
        console.log("user is available in local db")
    }
})


app.post('/users/:index', (req, res) => {
    console.log('POST users/index ')
    let data = req.body;
    let { index } = req.params;

    let users = util.getUsersDataFromJsonFile();


    Object.assign(users[index], data);
    // save user to file
    util.writeFile(users[index]);

    users = util.getUsersDataFromJsonFile();
    res.send(users);
})

app.delete('/users/:index', (req, res) => {
    let { index } = req.params;
    console.log(index);
    let users = fs.readFileSync('./data.json')
    try {
        users = JSON.parse(users) || []
    } catch (error) {
        users = []
    }

    users.splice(index, 1);
    fs.writeFileSync('./data.json', JSON.stringify(users))

    users = util.getUsersDataFromJsonFile();
    res.send(users);
})

app.listen(5000, () => {
    console.log("Server is listening to port 5000")
})