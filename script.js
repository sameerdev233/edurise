function login() {
  let name = document.getElementById("name").value;

  if (name == "") {
    alert("Pehle apna naam likho");
    return;
  }

  localStorage.setItem("studentName", name);

  alert("Welcome " + name);
}
const rows = [...document.querySelectorAll("table tr")].slice(1);

rows.sort((a, b) => {
    return parseInt(b.cells[2].innerText) - parseInt(a.cells[2].innerText);
});

const table = document.querySelector("table");

rows.forEach((row, index) => {
    row.cells[0].innerText = ["🥇","🥈","🥉"][index] || (index + 1);
    table.appendChild(row);
});
function login() {
    const name = document.getElementById("username").value.trim();

    if (name === "") {
        alert("Apna naam likho");
        return;
    }

<input type="text" id="username" placeholder="Enter Name">
<button onclick="login()">Login</button>
    alert("Welcome " + name + "!");
}
let score = Number(localStorage.getItem("score")) || 0;

function checkAnswer(answer) {updateLeaderboard();

    if(answer === "Patna"){
        score += 10;
        document.getElementById("result").innerHTML =
        "✅ Correct! Score: " + score;
    } else {
        document.getElementById("result").innerHTML =
        "❌ Wrong Answer";
    }

    localStorage.setItem("score", score);
}
function updateLeaderboard() {

    const name = localStorage.getItem("playerName") || "Guest";
    const score = Number(localStorage.getItem("score")) || 0;

    let players = JSON.parse(localStorage.getItem("players")) || [];

    // Purana record hatao
    players = players.filter(p => p.name !== name);

    // Naya record add karo
    players.push({
        name: name,
        score: score
    });

    // Highest score upar
    players.sort((a, b) => b.score - a.score);

    // Save
    localStorage.setItem("players", JSON.stringify(players));

    // Table me dikhao
    const board = document.getElementById("leaderboard");
    board.innerHTML = "";

    players.forEach((player, index) => {
        const medal = ["🥇", "🥈", "🥉"][index] || (index + 1);

        board.innerHTML += `
        <tr>
            <td>${medal}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        </tr>`;
    });
}

// Page load par
updateLeaderboard();
