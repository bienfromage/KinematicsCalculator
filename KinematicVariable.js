"use strict";

let KinematicVariable = function(name){
  this.fullName = name;
  this.value = 0;
  this.getVal = false;
  this.hasVal = false;
};