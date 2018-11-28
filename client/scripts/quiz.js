// Sticky navbar

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


// ---------------------------- LOGIN / SIGN UP ----------------------------------


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

// get total score for each player and display the best 10 of them
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
			var a = scores.length < 10 ? scores.length : 10;
			for(let i = 0; i < a ; i++){
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

var dataTable = [];
// create chart with scores data for each subject
function charty(dataTable){
	google.charts.load('visualization', '1', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	// drawChart([['Luna', 'Scorul Total'], [1, 1]]);
	function drawChart(){
		var data = new google.visualization.arrayToDataTable(dataTable);
		var options = {
			title: 'Scor / luna',
			width: 1000,
			height: 300,
			// curveType: 'function',
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
	var req = new XMLHttpRequest();
	req.open('GET', `/dropdown/${sub[0].ID}`);
	req.onreadystatechange = () => {
		if(req.readyState === 4 && req.status === 200){
			var dataTable = [];
			dataTable[0] = ['Luna', 'Scorul Total'];
			for(let i = 1; i <= 12; i++){
				dataTable[i] = [i, JSON.parse(req.responseText)[i - 1]];
			}
			charty(dataTable);
		}
	}
	req.send();
	for(let i = 0; i < sub.length; i++){
		var child = document.createElement('a');
		var str = sub[i].subject.replace('_', ' ');
		child.innerHTML = str;
		child.onclick = () => {
			document.getElementById("dropbtn").innerHTML = sub[i].subject.replace('_', ' ');
			var req = new XMLHttpRequest();
			req.open('GET', `/dropdown/${sub[i].ID}`);
			req.onreadystatechange = () => {
				if(req.readyState === 4 && req.status === 200){
					var dataTable = [];
					dataTable[0] = ['Luna', 'Scorul Total'];
					for(let i = 1; i <= 12; i++){
						dataTable[i] = [i, JSON.parse(req.responseText)[i - 1]];
					}
					charty(dataTable);
				}
			}
			req.send();
		}
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