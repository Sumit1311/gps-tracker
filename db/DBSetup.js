var db = require('./persistence');
var BaseDAO = require('./BaseDAO');
var util = require('util');
var q = require('q');

function DBSetup(persistence) {
    BaseDAO.call(this, persistence);
}

util.inherits(DBSetup, BaseDAO);

DBSetup.prototype.setupDatabase = function () {
    var dbClient;
    return this.getClient()
        .then(function (client) {
            dbClient = client;
            return dbClient.query('CREATE TABLE IF NOT EXISTS "coordinates"( ' +
                '"userId" INTEGER, ' +
                '"lattitude" TEXT,' +
                '"longitude" TEXT );');
        })
        .catch(function (err) {
            console.log(err);
            return q.reject(err);
        })
        .finally(function () {
            if (dbClient)
                dbClient.release();
        })
}

module.exports = new DBSetup();
