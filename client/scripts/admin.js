var i = 0;

function displaySelected(){
    document.getElementById("addQuest").style.display = "none";
    document.getElementById("selected").style.display = "block";
    document.getElementsByClassName("selectSubj")[0].style.display = "none";
}

function addSub(){
    displaySelected();
    document.getElementById("addsubject").style.display = "block";
}

function createSubject(){
    req3 = new XMLHttpRequest();
	req3.open('GET', '/subjects');
	req3.onreadystatechange = () => {
	    if(req3.readyState === 4 && req3.status === 200){
			sub = JSON.parse(req3.responseText);
			for(let i = 0; i < sub.length; i++){
                if(i === 0){
                    child4 = document.createElement("option");
                    child4.setAttribute('value', ``);
                    document.getElementsByClassName("selectSubj")[2].append(child4);
                }       
                child = document.createElement("option");
                child2 = document.createElement("option");
                child3 = document.createElement("option");
                child.innerHTML = sub[i].subject.replace('_', ' ');
                child2.innerHTML = sub[i].subject.replace('_', ' ');
                child3.innerHTML = sub[i].subject.replace('_', ' ');
                child.setAttribute('value', `${sub[i].ID}`);
                child2.setAttribute('value', `${sub[i].ID}`);
                child3.setAttribute('value', `${sub[i].ID}`);
                document.getElementsByClassName("selectSubj")[0].append(child);   
                document.getElementsByClassName("selectSubj")[1].append(child2);  
                document.getElementsByClassName("selectSubj")[2].append(child3);
            }
		}
	};
	req3.send();
}

function addQuest(){
    displaySelected();
    document.getElementById("addquestion").style.display = "block";
    document.getElementsByClassName("selectSubj")[0].style.display = "block";
    createSubject();
    createAns();
    }

function createAns(){
    child = document.createElement("input");
    rad = document.createElement("input");
    rad.setAttribute('type', 'radio');
    rad.setAttribute('value', i);
    rad.setAttribute('name', `correct`);
    child.setAttribute('name', i);
    child.setAttribute('placeholder', `raspuns ${i + 1}`);
    child.setAttribute('type', 'text');
    document.getElementById("ans").append(child);
    document.getElementById("ans").append(rad);
    child.oninput = (e) => {
        var children = document.getElementById("ans");
        var c = children.childNodes[children.childNodes.length- 2];
        var r = children.childNodes[children.childNodes.length- 1];
        if(c.value.length > 0){
            createAns();
            e.stopPropagation();
        }
        if(i >= 1 && children.childNodes[children.childNodes.length- 4].value.length === 0){
            i--;
            children.removeChild(c);
            children.removeChild(r);
        }
    }
    i++;
}

function deleteUser(){
    displaySelected();
    document.getElementById("deleteuser").style.display = "block";
}

function admin(){
    displaySelected();
    document.getElementById("administrator").style.display = "block";
}

function modifyQuest(){
    displaySelected();
    // document.getElementsByClassName("selectSubj")[0].style.display.removeAttribute('form');
    document.getElementsByClassName("selectSubj")[1].style.display = "block";
    createSubject();
}

function reqQuest(){
    document.getElementsByClassName("modify")[0].style.display = 'block';
    var list = document.getElementById("questList");
    while (list.hasChildNodes()) {   
        list.removeChild(list.firstChild);
    }
    list.style.display = "block";
    // literal questions and answers
    questions = [];
    answers = [];
    // questions and answers by their id's (same arrays as above, but not literal)
	quest_id = [];
	answ_id =[];
    var e = document.getElementsByClassName("selectSubj")[1];
    var b = e.value;
    var req = new XMLHttpRequest();
    req.open('GET', `/quiz/${b}`);
    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status === 200) {
            var a = JSON.parse(req.responseText);
            var x = 0;
            var i = 0;
            var poz = 0;
            while(i < a.length){
                answers[x] = [];
                answ_id[x] = [];
                questions[x] = a[i].question;
                quest_id[x] = a[i].ID;
                var p = 0;
                while(i < a.length && a[poz].ID === a[i].ID && i < a.length){
                    answers[x][p] = a[i].answer;
                    answ_id[x][p] = a[i].ans_id;
                    p++;
                    i++;
                }
                poz += p;
                x++;
            }
        }
        // create List Item for each question and define onclick attribute
        for(let i = 0; i < questions.length; i++){
            var child = document.createElement("LI");
            var childSpan = document.createElement("SPAN");
            childSpan.innerHTML = questions[i];
            childSpan.contentEditable = true;
            child.appendChild(childSpan);
            var child2 = document.createElement("UL");
            child2.style.display = "none";
            for(let j = 0; j < answers[i].length; j++){
                var child3 = document.createElement("LI");
                var child3Span = document.createElement("SPAN");
                child3Span.contentEditable = true;
                child3Span.innerHTML = answers[i][j];
                child3.appendChild(child3Span);
                child2.appendChild(child3);
            }
            child.appendChild(child2);
            list.appendChild(child);
        }
        $('#questList').find('SPAN').click(function(e){
            $(this).parent().children('UL').toggle();
        });
    }
    req.send();
}

function editQuest(){
    // GET MODIFIED 
    var list = document.getElementById("questList");
    var editedQuest = [];
    for(let i = 0; i < list.childNodes.length; i++){
        editedQuest[i] = list.childNodes[i].firstChild.innerHTML;
    }
    var editedAns = [];
    for(let i = 0; i < list.childNodes.length; i++){
        editedAns[i] = [];
        for(let j = 0; j < list.childNodes[i].childNodes[1].childNodes.length; j++){
            editedAns[i][j] = list.childNodes[i].childNodes[1].childNodes[j].firstChild.innerHTML;
        }
    }
    var editedQ = [];
    var editedA = [];
    for(let i = 0; i < questions.length; i++){
        editedQ[i] = {
            id: quest_id[i],
            question: editedQuest[i]
        }
    }
    for(let i = 0; i < editedAns.length; i++){
        editedA[i] = [];
        for(let j = 0; j < editedAns[i].length; j++){
            editedA[i][j] = {
                id: answ_id[i][j],
                answer: editedAns[i][j]
            }
        }
    }  
    // SEND TO SERVER
    var req = new XMLHttpRequest();
    req.open('POST', '/editquest');
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    req.onreadystatechange = () => {
        if(req.status === 200 && req.readyState === 4 ){
            window.location = "/modify";
        }
    }
    req.send(JSON.stringify({
        edQ: editedQ, 
        edA: editedA
    }));
}

function deleteQ(){
    displaySelected();
    document.getElementById("delete").style.display = "block";
    createSubject();
}


toBeDeleted = []

function questionsToBeDeleted(){
    document.getElementsByClassName("modify")[3].style.display = "block";
    var list = document.getElementById("quest");
    while (list.hasChildNodes()) {   
        list.removeChild(list.firstChild);
    }
    list.style.display = "block";
    // literal questions and answers
    questions = [];
    answers = [];
    // questions and answers by their id's (same arrays as above, but not literal)
	quest_id = [];
	answ_id =[];
    var e = document.getElementsByClassName("selectSubj")[2];
    var b = e.value;
    var req = new XMLHttpRequest();
    req.open('GET', `/quiz/${b}`);
    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status === 200) {
            var a = JSON.parse(req.responseText);
            var x = 0;
            var i = 0;
            var poz = 0;
            while(i < a.length){
                answers[x] = [];
                answ_id[x] = [];
                questions[x] = a[i].question;
                quest_id[x] = a[i].ID;
                var p = 0;
                while(i < a.length && a[poz].ID === a[i].ID && i < a.length){
                    answers[x][p] = a[i].answer;
                    answ_id[x][p] = a[i].ans_id;
                    p++;
                    i++;
                }
                poz += p;
                x++;
            }
        }
        // create List Item for each question and define onclick attribute
        for(let i = 0; i < questions.length; i++){
            var child = document.createElement("LI");
            child.innerHTML = questions[i];
            list.appendChild(child);
            child.onclick = (e) => {
                e.stopPropagation();
                var c = document.getElementsByTagName("LI")[i].style.backgroundColor;
                if(c === ""){
                    list.getElementsByTagName("LI")[i].style.backgroundColor = "lightcoral";
                    if(!toBeDeleted.includes(quest_id[i]))toBeDeleted.push(quest_id[i]);
                }
                else{
                    list.getElementsByTagName("LI")[i].style.backgroundColor = "";
                    for(var j = toBeDeleted.length - 1; j >= 0; j--) {
                        if(toBeDeleted[j] === quest_id[i]) {
                           toBeDeleted.splice(j, 1);
                        }
                    }
                }
            }
        }
    }
    req.send();
}

function deleteSubject(){
    subj = document.getElementsByClassName("selectSubj")[2].value;
    if(subj !== ''){
        var req = new XMLHttpRequest();
        req.open('GET', `/deletesubject/${subj}`);
        req.onreadystatechange = () => {
            if(req.status === 200 && req.readyState === 4) {
                window.location = "/modify";
            }
        }
        req.send();
    }
}

function deleteqq(){
    console.log(toBeDeleted);
    var req = new XMLHttpRequest();
    req.open('POST', "/deletequestions");
    req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    req.onreadystatechange = () => {
        if(req.status === 200 && req.readyState === 4 ){
            window.location = "/modify";
        }
    }
    req.send(JSON.stringify({del: toBeDeleted}));
}