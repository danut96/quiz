var LocalStrategy = require('passport-local').Strategy;
var sql = require('./db');

module.exports = function(passport){

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        sql.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows){
            done(err, rows[0]);
        });
    });


    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
            // find user
            // we are checking to see if the user trying to login already exists
            sql.query("select * from users where username = '"+ username +"'", function(err,rows){
                if (err) return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // create the user
                    var newUserMysql = new Object();

                    newUserMysql.username = username;
                    newUserMysql.password = password;

                    var x;
                    sql.query('SELECT * FROM users', function(err, result, fields){
                        if(err) throw err;
                        x = result.length;
                        var insertQuery = "INSERT INTO users (id, username, password ) values ('" + x + "','"+ username +"', '"+ password +"')";
                        sql.query(insertQuery, function(err,rows2){
                            newUserMysql.id = x;
                            return done(null, newUserMysql);
                        }); 
                    });
                }  
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
            // find user
            // we are checking to see if the user trying to login already exists
            sql.query("select * from users where username = '"+ username +"'", function(err,rows){
                if (err) return done(err);
                if (rows.length) {
                    //check if pass matches 
                    sql.query(`SELECT * FROM users where username = '${username}' and password = '${password}'`, function(err, result, fields){
                        if(err) throw err;
                        if(result.length === 1){
                            var newUserMysql = new Object();
                            newUserMysql.username = username;
                            newUserMysql.password = password;
                            newUserMysql.id = result[0].id;
                            return done(null, newUserMysql);
                        }else{
                            return done(null, false, req.flash('loginMessage', 'Incorrect password'));
                        }
                    });
                } else {
                    // no user found 
                    return done(null, false, req.flash('loginMessage', 'User does not exist'));
                }  
        });
    }));
}
