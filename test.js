"use strict";

let p1p = document.getElementById("p1-board-placement");

p1p.addEventListener("click", function(e){
    e.target.classList.add("s");
});

let p2p = document.getElementById("p2-board-placement");

/** Form logic **/
let p1f = document.getElementById("p1-ship-opt"); 
let p2f = document.getElementById("p2-ship-opt");



