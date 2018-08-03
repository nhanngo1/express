const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./exercise-request');
const path = require('path')

const mongodbHelper = require('./mongodb-helper');
const url = 'mongodb://localhost:27017'
const dbName = 'nodejs-course'
const collectionName = 'users'
const port = 3000;

app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/dataJson', async(req, res) => {
    console.log('GET /dataJson')
    let client = await mongodbHelper.connect(url)
    let users = await mongodbHelper.findRecords(client, dbName, collectionName)
    client.close()
    res.json(users);
})

app.get('/', async(req, res) => {
    console.log('GET /')

    let client = await mongodbHelper.connect(url)
    let users = await mongodbHelper.findRecords(client, dbName, collectionName)
    client.close()

    if (!users)
        res.render('index-mongodb', "")
    else
        res.render('index-mongodb', { usersInfo: users })
})

app.get('/users/:user', async(req, res) => {

    let user = req.params.user;
    console.log(`GET users/${user}`)

    // create connection to db
    let client = await mongodbHelper.connect(url);

    // find the user to check if user exist in db
    let filter = { "login": user };
    let selectedUser = await mongodbHelper.findOneRecord(client, dbName, collectionName, filter)

    // get user info from github if user does not exist in db
    if (selectedUser === null) {
        console.log("user is not found in local db")
        selectedUser = await util.getUserDataFromGithub(user)

        // if user is found on github, insert user info into db
        if (selectedUser.message == undefined) {
            console.log("insert record")
            await mongodbHelper.insertRecord(client, dbName, collectionName, selectedUser)
        }

        // get all users info in db
        let users = await mongodbHelper.findRecords(client, dbName, collectionName)

        // close db connection
        await client.close();

        // response user info to view
        res.json(users)

    } else {
        console.log("user is available in local db")
    }
})


app.post('/users/:user', async(req, res) => {

    let data = req.body;
    let { user } = req.params;
    let filter = { "login": user };
    console.log(`POST users/${user}`)

    // create connection to db
    let client = await mongodbHelper.connect(url);

    // update db
    await mongodbHelper.updateRecord(client, dbName, collectionName, filter, data)

    // get all users info in db
    let users = await mongodbHelper.findRecords(client, dbName, collectionName)

    // close db connection
    client.close();

    res.send(users);
})

app.delete('/users/:user', async(req, res) => {
    let { user } = req.params;
    console.log(`DELETE users/${user}`);
    let filter = { "login": user };

    // create connection to db
    let client = await mongodbHelper.connect(url);

    // delete record
    await mongodbHelper.deleteRecord(client, dbName, collectionName, filter)

    // get all users info in db
    let users = await mongodbHelper.findRecords(client, dbName, collectionName)

    // close db connection
    client.close();

    res.send(users);
})

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
});