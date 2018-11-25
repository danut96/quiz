var i = 0;
var score = 0;
var life = ["", "&#10084", "&#10084;&#10084", "&#10084;&#10084;&#10084"];
document.addEventListener('DOMContentLoaded', () => {
	window.onscroll = function() {myFunction();}
	var navbar = document.getElementById("navbar");
	var sticky = navbar.offsetTop;
	function myFunction() {
		if (window.pageYOffset >= sticky) {
		navbar.classList.add("sticky")
		} else {
		navbar.classList.remove("sticky");
		}
	}
});

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleAns(b){
	for(let i = 0; i < questions.length; i++){
		shuffle(b[i]);
	}
	return b;
}

var n = 0;
var questions;
var answers;
var answ_id;
var userAns;
var shuffled;
var shuffAns;

function hmm(x){
	score = 0;
	document.getElementById("questProgressBar").style.width = '0%';
	document.getElementById("endGame").style.display = "none";
	document.getElementById("question").innerHTML = '';
	document.getElementById("answers").innerHTML = '<li></li><li></li><li></li><li></li>';
	questions = [];
	answers = [];
	shuffAns = [];
	quest_id = [];
	answ_id =[];
	shuffled = [];
	n = x;
	document.getElementById("startGame").style.display = "block";
	i = 0;
	var myReq = new XMLHttpRequest();
	myReq.open('GET', '/quiz/'+ n);
	myReq.onreadystatechange = function (){
			if(myReq.readyState === 4 && myReq.status === 200) {
				var a = JSON.parse(myReq.responseText);
				var x = 0;
				var i = 0;
				var poz = 0;
				while(i < a.length){
					answers[x] = [];
					shuffAns[x] = [];
					answ_id[x] = [];
					questions[x] = a[i].question;
					shuffled[x] = x;
					quest_id[x] = a[i].ID;
					var p = 0;
					while(i < a.length && a[poz].ID === a[i].ID && i < a.length ){
						shuffAns[x][p] = p;
						answers[x][p] = a[i].answer;
						answ_id[x][p] = a[i].ans_id;
						p++;
						i++;
					}
					poz += p;
					x++;
					
			}
		}
	}
	myReq.send();
}

function startGame(){
	shuffle(shuffled);
	shuffleAns(shuffAns);
	score = 0;
	change();
	document.getElementById("startGame").style.display = "none";
	document.getElementById("endGame").style.display = "none";
}


function change(){
	if(i >= questions.length || l === 0){
		// update user's score
		if(questions.length > 0)updateScore();
		document.getElementById("questProgressBar").style.width = '60%'; 
		document.getElementById("question").innerHTML = '';
	    document.getElementById("answers").innerHTML = '<li></li><li></li><li></li><li></li>';
		document.getElementById("endGame").style.display = "block";
		document.getElementById('final').innerHTML = `Quiz-ul s-a terminat. <br> Scor: ${score} / ${questions.length}`;
	}else{
		document.getElementById("questProgressBar").style.width = `${ i / questions.length * 60}% `; 
		document.getElementById("questProgressBar").innerHTML = `${i + 1}/${questions.length}`;
		document.getElementById("question").innerHTML = questions[shuffled[i]];
		var myNode = document.getElementById("answers");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
		for(let j = 0; j < answers[shuffled[i]].length; j++){
			createAnswer(i, j);
		}
	}
	i++;
}

function createAnswer(i, j){
	var child = document.createElement("LI");
	child.innerHTML = answers[shuffled[i]][shuffAns[shuffled[i]][j]];
	child.className = 'ans';
	child.onclick = () => {
		// compare result to correct ans and update score
		var req = new XMLHttpRequest();
		req.open('POST', '/checkAnswer');
		req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		req.onreadystatechange = () => {
			if (req.readyState === 4 && req.status === 200) {
				if(JSON.parse(req.responseText) === 1){
					score++;
				}else{
					if(l > 0 && $('#life').length > 0){
						l--;
						document.getElementById("life").innerHTML = life[l];
					}
				}
				if(i === questions.length - 1){
					document.getElementById('final').innerHTML = `Quiz-ul s-a terminat. <br> Scor: ${score} / ${questions.length}`;
					//updateScore();
				}					
				change();
			}
		}
		req.send(JSON.stringify({
			q_id : quest_id[shuffled[i]],
			anss : answ_id[shuffled[i]][shuffAns[shuffled[i]][j]]
		}));
		if($('#timer').length > 0){
			clearInterval(id);
			timer();
		}
		//then change the question
		
	}
	document.getElementById("answers").appendChild(child);
}

function onChallenge(){
	score = 0;
	l = 3;
	document.getElementById("life").innerHTML = life[l];
	document.getElementById("startGame").style.display = "block";
	document.getElementById("questProgressBar").style.width = '0%';
	document.getElementById("endGame").style.display = "none";
	document.getElementById("question").innerHTML = '';
	document.getElementById("answers").innerHTML = '<li></li><li></li><li></li><li></li>';
	questions = [];
	answers = [];
	quest_id = [];
	shuffAns = [];
	answ_id =[];
	shuffled = [];
	i = 0;
	var challReq = new XMLHttpRequest();
	challReq.open('POST', '/challenge');
	challReq.onreadystatechange = function (){
			if(challReq.readyState === 4 && challReq.status === 200) {
				//get result and update the quiz
				var a = JSON.parse(challReq.responseText);
				var x = 0;
				var i = 0;
				var poz = 0;
				while(i < a.length){
					answers[x] = [];
					answ_id[x] = [];
					shuffAns[x] = [];
					questions[x] = a[i].question;
					quest_id[x] = a[i].ID;
					shuffled[x] = x;
					var p = 0;
					while(i < a.length && a[poz].ID === a[i].ID && i < a.length){
						answers[x][p] = a[i].answer;
						shuffAns[x][p] = [p];
						answ_id[x][p] = a[i].ans_id;
						p++;
						i++;
					}
					poz += p;
					x++;
				}
			}
	}
	challReq.send();
}

var l = 3;
var id;

function timer(){
	var width = 0;
	document.getElementById('timer').style.width = '0%';
	id = setInterval(frame, 5);
    function frame() {
        if (i <= questions.length && width >= 100 && l > 0) {
			clearInterval(id);
			// put -1 as answer 
			var req = new XMLHttpRequest();
			req.open('POST', '/checkAnswer');
			req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			req.onreadystatechange = () => {
				if (req.readyState === 4 && req.status === 200) {
					if(JSON.parse(req.responseText) === 1) score++;
					if(i === questions.length - 1){
						//updateScore();
						document.getElementById('final').innerHTML = `Quiz-ul s-a terminat. <br> Scor: ${score} / ${questions.length}`;
					}
				}
			}
			if(i < questions.length){
				req.send(JSON.stringify({
					q_id : quest_id[shuffled[i]],
					anss : -1
				}));
			}
			// -1 life
			if (l > 0) {
				l--;
				document.getElementById("life").innerHTML = life[l];
			}
			// if no life left, end the game
			change();
			if(i <= questions.length + 1) timer();
		}
		if(i === questions.length + 1 || l === 0) return;
        width += 0.1; 
        document.getElementById('timer').style.width = width + '%'; 
    }
}

function updateScore(){
	req = new XMLHttpRequest();
	req.open('POST', '/updateScore');
	req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	req.onreadystatechange = () => {
		if(req.status === 200 && req.readyState === 4){
			console.log(score / parseInt(questions.length));
		}
	};
	req.send(JSON.stringify({
		subject: n,
		userScore: score / questions.length,
		month: new Date().getMonth() + 1
	}));
}


// ------------------------- LOGIN / SIGN UP ----------------------------------


function user(){

	if($("#subjects").length) createSubject();
	if($("#dropdown-content").length) createSubject();

	for (var i = 0; i < document.links.length; i++) {
		if (document.links[i].href == document.URL) {
			document.links[i].className = 'active';
		}
	}

	if($("#top10").length) topPlayers();
};

// ------------------------------------ TOP PLAYERS PAGE -------------------------------------//

function topPlayers(){
	var table = document.getElementById("top10");
	req2 = new XMLHttpRequest();
	req2.open('POST', '/top');
	req2.onreadystatechange = () => {
		if(req2.status === 200 && req2.readyState === 4 && $("#top10 tr").length === 1){
			var scores = JSON.parse(req2.responseText);
			// sort by scores
			scores.sort((p1, p2) => p2.total_score - p1.total_score);
			// display top 10 players
			for(let i = 0; i < scores.length; i++){
				var row = table.insertRow();
				row.insertCell(0).innerHTML = i + 1;
				row.insertCell(1).innerHTML = scores[i].username;
				row.insertCell(2).innerHTML = scores[i].total_score;
			}
		}
	}
	req2.send();
}


//------------------------------- PROFILE PAGE -------------------------------------//

function profilePage(){
	user();
	google.charts.load('visualization', '1', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	function drawChart(){
		var data = google.visualization.arrayToDataTable([
			['Year', 'Sales' ],
			['2004',  1000      ],
			['2005',  1170],
			['2006',  660],
			['2007',  1030]
		]);
		var options = {
			title: 'Company Performance',
			curveType: 'function',
			legend: { position: 'bottom' }
		  };
		var chart = new google.visualization.LineChart(document.getElementById('chart'));
		chart.draw(data, options);
	}
}

function createListOfSubjects(sub){
	for(let i = 0; i < sub.length; i++){
		var child = document.createElement('LI');
		var str = sub[i].subject.replace('_', ' ');
		child.innerHTML = str;
		child.onclick = () => {
			hmm(sub[i].ID); 
			document.getElementById('selectedQuiz').innerHTML = sub[i].subject.replace('_', ' ');
		}
		document.getElementById('subjects').appendChild(child);
	}
}

function createDropdownSubj(sub){
	document.getElementById("dropbtn").innerHTML = sub[0].subject;
	for(let i = 0; i < sub.length; i++){
		var child = document.createElement('a');
		var str = sub[i].subject.replace('_', ' ');
		child.innerHTML = str;
		child.href = `/dropdown/${sub[i].ID}`;
		child.onclick = () => {document.getElementById("dropbtn").innerHTML = sub[i].subject.replace('_', ' ');}
		document.getElementById('dropdown-content').appendChild(child);
	}
}

function createSubject(){
	req3 = new XMLHttpRequest();
	req3.open('GET', '/subjects');
	req3.onreadystatechange = () => {
		if(req3.readyState === 4 && req3.status === 200){
			sub = JSON.parse(req3.responseText);
			if($("#sidebar").length) createListOfSubjects(sub);
			if($("#dropdown-content").length) createDropdownSubj(sub);
		}
	};
	req3.send();

}