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

    localStorage.setItem("playerName", name);

    alert("Welcome " + name + "!");
}
