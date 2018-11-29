sql = require('./db.js');

module.exports = function(app, passport){

    function authenticationMiddleware(){
        return (req, res, next) => {
            if(req.isAuthenticated()) return next();
            res.redirect('/login');
        }
    }

    function admin(){
        return (req, res, next) => {
            if(req.isAuthenticated() && req.user.admin === 1) return next();
            res.redirect('/quiz');
        }
    }

    // GET ADMIN PAGE
    app.get('/modify', admin(), (req, res, next) => {
        res.render('admin.ejs', {user: req.user});
    });

    // ADD SUBJECT TO DB
    app.get('/addsubject', admin(), (req, res, next) => {
        sql.query("SELECT * FROM subjects", (err, rows) => {
            if(err) throw err; 
            sql.query(`INSERT INTO subjects VALUES(${rows.length + 1}, '${req.query.subject}')`, (err, rows) => {
                if(err)  throw err;
                res.render('admin.ejs', {user: req.user, success: 1});
            });
        });
    });

    // ADD QUESTION AND ANSWERS TO DB
    app.get('/addquestion', admin(), (req, res, next) => {
        // ADD QUESTION TO DB
        sql.query('SELECT * FROM questions', (err, rows) => {
            if(err) throw err;
            sql.query(`INSERT INTO questions VALUES(${rows.length + 1}, '${req.query.question}', ${req.query.subject})`, (err, rowws) =>{
                if(err) throw err;
            });
        });

        sql.query('SELECT * FROM answers', (err, rows) => {
            if(err) throw err;
            // ADD ANSWER IF IT DOESN'T ALREADY EXIST IN DB
            for(let i = 0; i < Object.keys(req.query).length - 4; i++){
                sql.query(`INSERT IGNORE INTO answers VALUES(${rows.length + i + 1}, '${req.query[`${i}`]}')`, (err, result) => {
                    if(err) throw err;    
                    if(i === Object.keys(req.query).length - 5) {
                        // ADD CORRECT ANSWER
                        sql.query(`SELECT * FROM answers WHERE answer = '${req.query[`${req.query.correct}`]}'`, (err, rowss) => {
                            if(err) throw err;
                            sql.query(`SELECT * FROM correct_ans`, (err, bla) => {
                                if(err) throw err;
                                sql.query(`INSERT INTO correct_ans VALUES(${bla.length + 1}, ${bla.length + 1}, ${rowss[0].ID})`);
                            });
                        });
                        // MATCH QUESTION WITH ANSWERS
                        sql.query('SELECT * FROM quiz_table', (err, rowss) => {
                            sql.query(`SELECT * FROM questions WHERE question = '${req.query.question}'`, (err, bla) => {
                                if(err) throw err;
                                for(let i = 0; i < Object.keys(req.query).length - 4; i++){
                                    sql.query(`SELECT * FROM answers where answer = '${req.query[`${i}`]}'`, (err, blab) => {
                                        if(err) throw err;
                                        sql.query(`INSERT INTO quiz_table VALUES(${rowss.length + i + 1}, ${bla[0].ID}, ${blab[0].ID})`);
                                    });
                                }
                            });
                        });
                    }  
                });
            }

        });
        res.render('admin.ejs', {user: req.user, success: 1});
    });

    // ADMIN RIGHTS TO SOME USER
    app.get('/administrator', admin(), (req, res, next) =>{
        sql.query(`UPDATE users SET admin = 1 WHERE username = '${req.query.username}'`, (err, rows) => {
            if(err) throw err;
            if(rows.length > 0) res.render('admin.ejs', {user: req.user, success: 1});
        });
        res.redirect('/logout');
    });

    // DELETE USER (CANT DELETE AN ADMIN)
    app.get('/deleteuser', admin(), (req, res, next) => {
        sql.query(`DELETE FROM users WHERE username= '${req.query.username}' AND admin = 0`, (err, rows) => {
            if(rows.length > 0) res.render('admin.ejs', {user: req.user, success: 1});
        });
        res.redirect('/logout');
    });

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
        WHERE quiz_table.quest_id = questions.ID
        ORDER BY questions.ID` , 
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

    // GET QUESTIONS (WITH RESPECT TO SUBJECTS) FROM DB

    app.get('/subjects', authenticationMiddleware(), (req, res, next) => {
        sql.query('SELECT * FROM quiz.subjects', (err, rows) => {
            if(err) throw err;
            res.send(rows);
        });
    });

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    app.get('/quiz/:id', authenticationMiddleware(),(req, res, next) => {
        sql.query(`SELECT questions.ID, questions.question, answers.answer, answers.ID as ans_id 
            FROM questions, quiz_table
            INNER JOIN answers ON quiz_table.ans_id = answers.ID  
            WHERE subjectID = ${req.params.id} AND quiz_table.quest_id = questions.ID
            ORDER BY questions.ID` ,
            function(err, result, fields){
                if(err) throw err;
                // var shuffd = [];
                // for(let i = 0; i < result.length; i++){
                //     shuffd[i] = i;
                // }
                // shuffle(shuffd);
                // if(result.length > 3) {
                //     var resultt = [];
                //     console.log(shuffd);
                //     for(let j = 0; j < 3; j++){
                //         resultt[j] = result[shuffd[j]];
                //         if(j === 3) res.send(resultt);
                //     }
                // }else{
                //     res.send(result);
                // }
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
        sql.query('SELECT username, total_score FROM users WHERE admin = 0', (err, rows) => {
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
        getScore(1);
        function getScore(month){
            sql.query(`SELECT score FROM users_score WHERE subject_id = ${req.params.id} AND id = ${req.user.id} AND month = ${month}`, (err, rows) => {
                if(err) throw err;
                scores[month - 1] =  rows.map(item => item.score).reduce((a, b) => a + b, 0);
                if(month <= 11) getScore(month + 1);
                else{
                    new Promise( (resolve, reject) => {
                        let value = true;
                        resolve("rezolvat");
                        if(!value) reject("nerezolvat");
                        res.send(scores);
                    }).then((value) => {return;});
                }
            });
        }
        // res.render('profile.ejs', {user: req.user, score: scores});
    });

    // MODIFY DB 
    app.post('/editquest', admin(), (req, res, next) => {
        for(let i = 0; i < req.body.edQ.length; i++){
        sql.query(`UPDATE questions SET question = '${req.body.edQ[i].question}' WHERE ID = ${req.body.edQ[i].id}`, (err, rows) => {
            if(err) throw err;
        })}
        for(let i = 0; i < req.body.edA.length; i++){
            for(let j = 0; j < req.body.edA[i].length; j++){
            sql.query(`UPDATE answers SET answer = '${req.body.edA[i][j].answer}' WHERE ID = ${req.body.edA[i][j].id}`, (err, rows) => {
                if(err) throw err;
                });
            }
        }
        res.redirect('/modify');
    });
}