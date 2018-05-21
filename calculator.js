"use strict";

let state = 0;

let v = {value:0,getVal:false,hasVal:false};
let vo = {value:0,getVal:false,hasVal:false};
let a = {value:0,getVal:false,hasVal:false};
let t = {value:0,getVal:false,hasVal:false};
let x = {value:0,getVal:false,hasVal:false};

function changeState(){
  switch(state){
    case 0:
      state++;
      break;
    case 1:
      setInstructions("Choose which variables you already know");
      setBody("<label class='label'>vo (initial velocity)<input type='checkbox' id='vo'></label><label class='label'>v (final velocity)<input type='checkbox' id='v'></label><label class='label'>a (acceleration)<input type='checkbox' id='a'></label><label class='label'>t (time)<input type='checkbox' id='t'></label><label class='label'>x (displacement)<input type='checkbox' id='x'></label><button class='button' onclick='changeState()'>Continue</button>");
      state++;
      break;
    case 2:
      if(document.getElementById("v").checked)
        v.getVal = true;
      if(document.getElementById("vo").checked)
        vo.getVal = true;
      if(document.getElementById("a").checked)
        a.getVal = true;
      if(document.getElementById("t").checked)
        t.getVal = true;
      if(document.getElementById("x").checked)
        x.getVal = true;
      state++;
      changeState();
      break;
    case 3:
      if(vo.getVal){
        setInstructions("Input value for initial velocity vo");
        setBody("<input type='number' id='inputBox'><button class='button' onclick=''>Next</button>");
      }
      break;
  }
}

function setInstructions(newInstructions){
  document.getElementById("instructions").innerHTML=newInstructions;
}

function setBody(bodyHTML){
  document.getElementById("interactionBody").innerHTML=bodyHTML;
}

function setVo(){
  vo.value=document.getElementById("inputBox").value;
  vo.hasVal=true;
  vo.getVal=false;
  changeState();
}