"use strict";
var graph_1 = require("./graph");
var students = new graph_1.Graph([[1, 2], [2, 3]]);
console.log("There are " + students.distinctNetworks() + " distinct groups");
students.resetStatus();
