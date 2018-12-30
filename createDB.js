var sql = require('mysql');
var cmd = require('node-cmd');

function createDB(){
    var con = sql.createConnection({
        host: "localhost",
        user: "root",
        password: "password"
    });

    con.connect(err => {
        if(err) throw err;
        console.log("Connected.");
        con.query("CREATE DATABASE quiz", (err, res) => {
            if(err) throw err;
            else{
                console.log("Database created.");
                cmd.run("mysql -u root -ppassword quiz < quiz.sql");
                con.end();
            }
        });
    });

}

createDB();