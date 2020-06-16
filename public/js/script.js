
function myFunctionTab() {
  var x = document.getElementById("mysidebar");
  if (x.className === "sidebar") {
    x.className += " responsive";
  } else {
    x.className = "sidebar";
  }
}
