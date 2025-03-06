let ele=document.getElementById("textbox");
function add(num)
{
    ele.value += num;
}
function calculate()
{
    ele.value=eval(ele.value);
}
function clearall(){
    ele.value=""
}
function addmin()
{
    ele.value=(-1)*ele.value;
}
function back(){
    ele.value=ele.value.slice(0,-1);
}

function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
