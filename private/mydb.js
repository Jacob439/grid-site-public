var mysql = require('mysql');

var con = mysql.createConnection({
    host: "XXXX",
    user: "XXXX",
    password: "XXXX",
    database: "XXXX"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "CREATE TABLE grid_data (id INT AUTO_INCREMENT PRIMARY KEY, tile INT, time TIMESTAMP)";

    con.query(sql, function (err, result) {
        //if (err) throw err;
        if (!err) {
            console.log("Result: " + result);
        } else {
            console.log("Table already exists");
        }
    });

});