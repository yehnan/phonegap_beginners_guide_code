// open the database
function initializeDB() {
    var localDatabase = openDatabase(
            "internetNews",             // short name
            "1.0",                      // version
            "News From The Internet",   // long name
            50000                     // maximum size in bytes
        );

    return localDatabase;
}

function createStoryTable(db, callback) {
    var query = "CREATE TABLE IF NOT EXISTS stories " +
        "(title NVARCHAR(25), time DATETIME PRIMARY KEY, body TEXT);"

    db.transaction(function (trxn) {
        trxn.executeSql(
            query,  // the query to execute
            [],     // parameters for the query
            callback,
            function (transaction, error) { //error callback
                console.log(error);
            }
        );
    });
}

function insertNewStory(db, story) {
    var query = "INSERT OR REPLACE INTO stories (title, time, body) " +
        "VALUES (?,?,?);"

    db.transaction(function (trxn) {
        trxn.executeSql(
            query,
            [story.title, story.time, story.body],
            function (transaction, resultSet) {
                console.log('success');
            },
            function (transaction, error) {
                console.log(error);
            }
        );
    });
}

function getLastStories(db, callback) {
    var query = "SELECT * FROM stories LIMIT 5;"

    db.transaction(function (trxn) {
        trxn.executeSql(
            query,  // the query to execute
            [],     // parameters for the query
            function (transaction, resultSet) {
                var i = 0,
                    currentRow,
                    stories = [];
                
                for (i; i < resultSet.rows.length; i++) {
                    currentRow = resultSet.rows.item(i);
                    stories.push(currentRow);
                }

                callback(stories);
            },
            function (transaction, error) { //error callback
                console.log(error);
            }
        );
    });
}
