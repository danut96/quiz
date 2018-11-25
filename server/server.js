var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
var flash = require('connect-flash');


app.set('views',  'client/views');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000, () => {
    console.log('server is running')
});

require('./login')(passport);

app.use(cookieParser()); // read cookies (needed for auth)

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'quiz'
};

var sessionStore = new MySQLStore(options);

app.use(session({
	secret: 'riowufhehfewnfo',
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
	//cookie: { secure: true }
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./api.js')(app, passport);