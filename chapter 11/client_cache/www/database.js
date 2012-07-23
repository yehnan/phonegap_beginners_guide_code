// 開啟資料庫
function initializeDB() {
    var localDatabase = openDatabase(
            "internetNews",             // 短名
            "1.0",                      // 版本
            "News From The Internet",   // 長名
            50000                     // 大小上限（byte）
        );

    return localDatabase;
}

function createStoryTable(db, callback) {
    var query = "CREATE TABLE IF NOT EXISTS stories " +
        "(title NVARCHAR(25), time DATETIME PRIMARY KEY, body TEXT);"

    db.transaction(function (trxn) {
        trxn.executeSql(
            query,  // 要執行的查詢指令
            [],     // 查詢指令的參數
            callback, // 成功時的回呼
            function (transaction, error) { // 失敗時的回呼
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
