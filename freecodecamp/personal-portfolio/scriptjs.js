const anch = document.getElementById("anchor");
console.log(anch);
anch.addEventListener("click", link);
console.log(anch);
function link(e) {
  e.preventDefault();
  console.log("dfjd");
}
