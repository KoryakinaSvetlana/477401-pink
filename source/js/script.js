var page_header = document.querySelector(".page-header");
var page_navigation = document.querySelector(".main-navigation");
var navigation_button = document.querySelector(".main-navigation__toggle");

page_header.classList.add("page-header--short");
page_navigation.classList.add("main-navigation--closed");

window.onload = function () {
  navigation_button.addEventListener("click", function (event) {
    page_header.classList.toggle("page-header--short");
    page_navigation.classList.toggle("main-navigation--closed");
  });
}
