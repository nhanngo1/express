const MongoClient = require('mongodb').MongoClient;

module.exports = new class {

    connect(url) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
                if (err)
                    reject(err)
                resolve(client);
            })
        })
    }

    createCollection(client, dbName, collectionName) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName, function(err) {
                if (err)
                    reject(err)
                resolve();
            })
        })
    }

    findRecords(client, dbName, collectionName) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({}).toArray(function(err, result) {
                if (err)
                    reject(err)
                resolve(result);
            })
        })
    }

    findOneRecord(client, dbName, collectionName, filter) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName).findOne(filter, function(err, result) {
                if (err)
                    reject(err)
                resolve(result);
            })
        })
    }

    insertRecord(client, dbName, collectionName, data) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName).insertOne(data, function(err) {
                if (err)
                    reject(err)
                resolve();
            })
        })
    }

    deleteRecord(client, dbName, collectionName, filter) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName).deleteOne(filter, function(err) {
                if (err)
                    reject(err)
                resolve();
            })
        })
    }

    updateRecord(client, dbName, collectionName, filter, updateData) {
        const db = client.db(dbName);
        return new Promise((resolve, reject) => {
            db.collection(collectionName).updateOne(filter, { $set: updateData }, function(err) {
                if (err)
                    reject(err)
                resolve();
            })
        })
    }
}