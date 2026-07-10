function login() {
  let name = document.getElementById("name").value;

  if (name == "") {
    alert("Pehle apna naam likho");
    return;
  }

  localStorage.setItem("studentName", name);

  alert("Welcome " + name);
}
