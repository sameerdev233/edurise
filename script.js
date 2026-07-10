let student = "";

let questions = [
    {
        question: "भारत की राजधानी क्या है?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: "Delhi"
    },
    {
        question: "10 × 10 कितना होता है?",
        options: ["50", "100", "150", "200"],
        answer: "100"
    },
    {
        question: "Water का chemical formula क्या है?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        answer: "H2O"
    }
];


let currentQuestion = 0;
let score = 0;



// Login

function login(){

    let name = document.getElementById("studentName").value;

    if(name.trim() !== ""){

        student = name;

        document.getElementById("welcome").innerHTML =
        "Welcome, " + student + " 🎓";

        alert("Login Successful");

    }

    else{

        alert("Please enter your name");

    }

}



// Class Selection

function showClass(className){

    alert(className + " selected");

}



// Notes

function openNotes(){

    document.getElementById("notesSection").scrollIntoView({
        behavior:"smooth"
    });

}



// Quiz Open

function openQuiz(){

    document.getElementById("quizSection").scrollIntoView({
        behavior:"smooth"
    });

}



// Start Quiz

function startQuiz(){

    currentQuestion = 0;
    score = 0;

    showQuestion();

}



// Show Question

function showQuestion(){

    let q = questions[currentQuestion];


    document.getElementById("question").innerHTML =
    q.question;


    let optionBox = document.getElementById("options");

    optionBox.innerHTML="";


    q.options.forEach(function(option){

        let btn = document.createElement("button");

        btn.innerHTML = option;

        btn.style.margin="10px";


        btn.onclick=function(){

            checkAnswer(option);

        };


        optionBox.appendChild(btn);

    });

}



// Check Answer

function checkAnswer(selected){

    let correct = questions[currentQuestion].answer;


    if(selected === correct){

        score += 10;

    }


    currentQuestion++;


    if(currentQuestion < questions.length){

        showQuestion();

    }

    else{

        finishQuiz();

    }

}



// Finish Quiz

function finishQuiz(){

    alert(
        "Quiz Complete! Your Score: " + score
    );


    addLeaderboard();

}



// Add Score

function addLeaderboard(){

    let table =
    document.getElementById("leaderboardData");


    let row = table.insertRow();


    row.innerHTML =
    `
    <td>New</td>
    <td>${student || "Student"}</td>
    <td>${score}</td>
    `;


    sortLeaderboard();

}



// Sort Leaderboard

function sortLeaderboard(){

    let rows =
    Array.from(
        document.querySelectorAll("#leaderboardData tr")
    );


    rows.sort(function(a,b){

        let scoreA =
        parseInt(a.cells[2].innerText);

        let scoreB =
        parseInt(b.cells[2].innerText);


        return scoreB-scoreA;

    });



    let table =
    document.getElementById("leaderboardData");


    table.innerHTML="";


    rows.forEach(function(row,index){

        if(index===0)
            row.cells[0].innerHTML="🥇";

        else if(index===1)
            row.cells[0].innerHTML="🥈";

        else if(index===2)
            row.cells[0].innerHTML="🥉";

        else
            row.cells[0].innerHTML=index+1;


        table.appendChild(row);

    });

}



// Search Function

function searchContent(){

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();


    let cards =
    document.querySelectorAll(".note");


    cards.forEach(function(card){

        let text =
        card.innerText.toLowerCase();


        if(text.includes(input)){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

}  
