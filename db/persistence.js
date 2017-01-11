var postgresPersistence = require('jive-persistence-postgres');

var persistence;

exports.persistence = function (persistenceDB) {
    if (persistenceDB)
        return persistenceDB;
    if (persistence)
        return persistence;
    else {
        //"pg://postgres:postgres@localhost:5432/gpstracker"
        persistence = new postgresPersistence({
            "databaseUrl": process.env.DATABASE_URL || "pg://postgres:postgres@localhost:5432/gpstracker"
        });
        return persistence;
    }
}