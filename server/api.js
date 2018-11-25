sql = require('./db.js');

module.exports = function(app, passport){

    function authenticationMiddleware(){
        return (req, res, next) => {
            if(req.isAuthenticated()) return next();
            res.redirect('/login');
        }
    }


    // GET HOMEPAGE
    app.get('/quiz', authenticationMiddleware() ,(req, res, next) => {
        res.render('quiz.ejs', {user: req.user});
    });

    // GET PROFILE PAGE
    app.get('/profile', authenticationMiddleware(),(req, res, next) => {
        res.render('profile.ejs',  {user: req.user});
    });

    // GET CHALLANGE PAGE
    app.get('/challenge', authenticationMiddleware(),(req, res, next) => {
        res.render('challenge.ejs',  {user: req.user});
    });

    app.post('/challenge', authenticationMiddleware(),(req, res, next) => {
        sql.query(`SELECT answers.ID as ans_id, questions.ID, questions.question, answers.answer  
        FROM questions, quiz_table
        INNER JOIN answers ON quiz_table.ans_id = answers.ID  
        WHERE quiz_table.quest_id = questions.ID` , 
        function(err, result, fields){
            if(err) throw err;
            res.send(result);
        });
    });


    // GET INFO PAGE
    app.get('/info', (req, res, next) => {
        res.render('info.ejs',  {user: req.user});
    });

    // GET SIGNUP PAGE
    app.get('/signUp', (req, res, next) => {
        res.render('signUp.ejs', { message: req.flash('signupMessage'),  user: req.user });
    });

    // GET LOGIN PAGE
    app.get('/login', (req, res, next) => {
        res.render('login.ejs', { message: req.flash('loginMessage'), user: req.user});
    });

    // GET SUBJECTS FROM DB

    app.get('/subjects', authenticationMiddleware(), (req, res, next) => {
        sql.query('SELECT * FROM quiz.subjects', (err, rows) => {
            if(err) throw err;
            res.send(rows);
        });
    });

    app.get('/quiz/:id', authenticationMiddleware(),(req, res, next) => {
        sql.query(`SELECT questions.ID, questions.question, answers.answer, answers.ID as ans_id 
            FROM questions, quiz_table
            INNER JOIN answers ON quiz_table.ans_id = answers.ID  
            WHERE subjectID = ${req.params.id} AND quiz_table.quest_id = questions.ID` ,
            function(err, result, fields){
                if(err) throw err;
                res.send(result);
        });
    });

    // CHECK CORRECT ANS
    app.post('/checkAnswer', authenticationMiddleware(), (req, res, next) => {
        // store correct answers
        sql.query(`SELECT correct_ans.ans_id
        FROM correct_ans
        WHERE quest_id = ${req.body.q_id}`, 
        function(err, result, fields){
            if(err) throw err;
            if(req.body.anss === result[0].ans_id) res.send(JSON.stringify(1));
            else{
                res.send(JSON.stringify(0));
            }
        });
    });


    // TOP PLAYERS

    app.get('/top', authenticationMiddleware(), (req, res, next) => {
        res.render('top.ejs',  {user: req.user});
    })
    app.post('/top', authenticationMiddleware(), (req, res, next) => {
        // query db 
        sql.query('SELECT * FROM users', (err, rows) => {
            if(err) throw err;
            for(let i = 0; i < rows.length; i++){
                sql.query(`SELECT score FROM users_score WHERE id = ${i} and subject_id = 0`, (err, rows2) => {
                    if(err) throw err;
                    var score =  rows2.map(item => item.score).reduce((a, b) => a + b, 0);
                    sql.query(`UPDATE users SET total_score = '${score}' WHERE id = ${i}`);
                });
            }
        });
        sql.query('SELECT username, total_score FROM users', (err, rows) => {
            res.send(JSON.stringify(rows));
        });
    });

    // UPDATE SCORE
    app.post('/updateScore', authenticationMiddleware(), (req, res, next) => {
        // insert into db user.id, subject and score;
        sql.query(`INSERT INTO users_score VALUES('${req.user.id}', '${req.body.subject}', '${req.body.userScore}' , '${req.body.month}')`);
    });

    // SIGNUP
    app.post('/signUp', passport.authenticate('local-signup', {
        successRedirect: '/quiz',
        failureRedirect: '/signup',
        failureFlash: true // allow flash messages
    }));

    // TEST
    app.get('/test', (req, res) => {
        console.log(req.user);
    });

    //LOGIN
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/quiz', 
        failureRedirect : '/login', 
        failureFlash : true // allow flash messages
    }));

    // LOGOUT
    app.get('/logout',(req, res, next) => {
        req.logOut();
        req.session.destroy();
        res.redirect('/login');
    });
    
    // INFO ABOUT SESSION
    app.get('/session', authenticationMiddleware(),(req, res, next) => {
        res.send(req.user.username);
    });

    // PLAYER INFO
    app.get('/dropdown/:id', authenticationMiddleware(), (req, res, next) => {
        var scores = [];
        for(let i = 1; i <= 12; i++){
            sql.query(`SELECT score FROM users_score WHERE subject_id = ${req.params.id} and id = ${req.user.id} and month = ${i}`, (err, rows) => {
                if(err) throw err;
                scores[i] =  rows.map(item => item.score).reduce((a, b) => a + b, 0);
                console.log(scores);
            });
        }
        
        res.render('profile.ejs', {user: req.user, score = scores});
    });
}