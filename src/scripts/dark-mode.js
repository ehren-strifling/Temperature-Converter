"use strict";
/* - - - - - - - - - -
  DARK MODE
 - - - - - - - - - - */
 function toggleDarkMode(e) {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    e.target.innerHTML = "Enable dark mode";
  } else {
    document.body.classList.add("dark-mode");
    e.target.innerHTML = "Disable dark mode";
  }
}
[...document.getElementsByClassName("toggle-dark-mode")].forEach(e=>{
  e.addEventListener("click", toggleDarkMode);
});