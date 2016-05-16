var postgresPersistence = require('jive-persistence-postgres');

var persistence;

exports.persistence = function (persistenceDB) {
    if (persistenceDB)
        return persistenceDB;
    if (persistence)
        return persistence;
    else {
        persistence = new postgresPersistence({
            "databaseUrl": "pg://postgres:postgres@localhost:5432/gpstracker"
        });
        return persistence;
    }
}