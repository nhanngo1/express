const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./exercise-request');

app.use(bodyParser());
//app.use(router);

app.get('/', (req, res, ) => {
    console.log('get')
    res.send('hello');
})

app.get('/users/:user', (req, res) => {
    console.log('Im in get ')
    let user = req.params.user;
    res.send(util.getUserData(user))

})


app.listen(3000, () => {
    console.log("Server is listening to port 3000")
})