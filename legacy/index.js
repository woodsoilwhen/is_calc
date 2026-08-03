var storage = window.localStorage;
var iframe = document.getElementById("iframe");
var checkbox = document.getElementById("checkbox");

switch(storage.getItem("iframe")){
case "/is_calc/":
    iframe.src = "/is_calc/";
    break;
case "/pr_calc/":
    iframe.src = "/pr_calc/";
    break;
default:
    storage.setItem("iframe","/is_calc/");
    iframe.src = "/is_calc/";
    break;
}

function 电流线径计算() {
    iframe.src = "/is_calc/";
    storage.setItem("iframe","/is_calc/");
    checkbox.click();
}
function 功率电阻计算() {
    iframe.src = "/pr_calc/";
    storage.setItem("iframe","/pr_calc/");
    checkbox.click();
}