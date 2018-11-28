var i = 0;

function displaySelected(){
    document.getElementById("addQuest").style.display = "none";
    document.getElementById("selected").style.display = "block";
    document.getElementById("selectSubj").style.display = "none";
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
                child = document.createElement("option");
                child.innerHTML = sub[i].subject.replace('_', ' ');
                child.setAttribute('value', `${sub[i].ID}`);
                document.getElementById("selectSubj").append(child);
            }
		}
	};
	req3.send();
}

function addQuest(){
    displaySelected();
    document.getElementById("addquestion").style.display = "block";
    document.getElementById("selectSubj").style.display = "block";
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
            console.log(child.value);
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