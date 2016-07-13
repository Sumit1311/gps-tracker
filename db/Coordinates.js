/**
 * Created by sumit on 22/6/15.
 */
var BaseDAO = require("./BaseDAO");
var util = require("util");
var q = require('q');

var tableName = "coordinates";

function Coordinates(persistence) {
    BaseDAO.call(this, persistence);
}

util.inherits(Coordinates, BaseDAO);

Coordinates.prototype.getCoordinates = function (userId) {
    var deferred = q.defer();
    var dbClient;
    this.getClient()
        .then(function (client) {
            dbClient = client;
            return client.query('SELECT longitude,lattitude FROM "' + tableName + '" WHERE "userId"=$1;',
                [userId]);
        }).then(function (details) {
            var result = details.result;
            deferred.resolve(result.rows);
        })
        .catch(function (err) {
            deferred.reject(err);
        })
        .finally(function () {
            if (dbClient)
                dbClient.release();
        });
    return deferred.promise;
};

Coordinates.prototype.saveCoordinates = function (userId, lattitude, longitude) {
    var deferred = q.defer();
    var dbClient;
    this.getClient()
        .then(function (client) {
            dbClient = client;
            return dbClient.query('SELECT longitude,lattitude FROM "' + tableName + '" WHERE "userId"=$1;',
                [userId]);
        })
        .then(function (details) {
            if (details.result.rowCount == 0) {
                return dbClient.query('INSERT INTO "' + tableName + '" ("userId","lattitude","longitude") VALUES($1,$2,$3);',
                    [userId, lattitude, longitude]);
            } else {
                return dbClient.query('UPDATE "' + tableName + '" SET lattitude=$1,longitude=$2 WHERE "userId" = $3 ;',
                    [lattitude, longitude, userId]);
            }
        }).then(function (details) {
            var result = details.result;
            deferred.resolve(details);
        })
        .catch(function (err) {
            deferred.reject(err);
        })
        .finally(function () {
            if (dbClient)
                dbClient.release();
        });
    return deferred.promise;
};

module.exports = new Coordinates();