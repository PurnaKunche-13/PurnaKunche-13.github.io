let dec = document.getElementById("deb");
let inc = document.getElementById("inb");
let rese = document.getElementById("res");
let con = document.getElementById("contenttext");
let feedback;
let name;
let count=0
dec.onclick = function () {
    if (count >0) {
        count--;
        con.textContent = count;
    }
    else {
        con.textcontent = 0;
    }
    
}
inc.onclick = function () {
    count++;
    con.textContent = count;
}
res.onclick = function () {
    //count=0;
    //con.textContent = count;
    count = 0;
    
    con.textContent="Start newly"
}
