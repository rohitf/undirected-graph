//How to create a graph via the Graph class

import { Graph } from "./graph";

var students = new Graph([[1, 2], [2, 3]]);
console.log(`There are ${students.distinctNetworks()} distinct groups`)
students.resetStatus();
