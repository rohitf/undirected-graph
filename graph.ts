/// <reference path="./typings/main.d.ts" />

// Rohit Falor
// graph.ts
// A graph class implemented in JavaScript
// Last modified: 2/21/2016

//DECLARE VARS
var friends: Graph;
const fileName = "data.txt";

//CLASS DEFINITIONS
//abstraction of queue data type
class Queue{
  queue: Array<any>;

  constructor(data?:Array<any>){
    this.queue = [data]
  }

  enqueue(data){
    this.queue.unshift(data);
  }

  dequeue(){
    return this.queue.pop();
  }

  isEmpty(){
    return this.queue.length <= 0
  }
}

//represents a graph node (a student)
class GraphNode {
  value: number;
  visited: boolean;

  constructor(value, visited = false) {
    this.value = value;
    this.visited = visited;
  }
}

//represents a graph (network of students)
class Graph {
  edges: number[][];
  vertices = [];

  constructor(edges: number[][]) {
    this.edges = edges;

    var flat_arr = [].concat.apply([], this.edges);
    var unique = flat_arr.filter((elem, index, self) => {
      return index == self.indexOf(elem);
    }).sort();
    this.vertices = unique.map(value => {
      return new GraphNode(value)
    })
  }

  //constructs an adjacency list to represent this graph
  adjacencyList() {
    var g = this;
    var o = {};
    for (var vertex of g.vertices) {
      var l = []
      g.edges.forEach(edge => {
        if (edge[0] == vertex.value) {
          l.push(g.getNodeByValue(edge[1]));
        }
        else if (edge[1] == vertex.value) {
          l.push(g.getNodeByValue(edge[0]));
        }
      });
      o[vertex.value] = l;
    }
    return o;
  }

  //returns graph node by value (student ID)
  getNodeByValue(nodeValue) {
    for (var v of this.vertices) {
      if (v.value == nodeValue)
        return v;
    }
  }

  //breadth first search - custom implementation
  bfs(start: number, end: number) {
    var currNode;
    var startNode = this.getNodeByValue(start);
    var endNode = this.getNodeByValue(end);

    var queue = new Queue(startNode)
    while (!queue.isEmpty()) {
      currNode = queue.dequeue();
      if (!currNode.visited) {
        currNode.visited = true;
        for (var adjNode of this.adjacencyList()[currNode.value]) {
          if (adjNode == endNode)
            return true
          queue.enqueue(adjNode);
        }
      }
    }
    return false
  }

  //API 1 - returns if any 2 nodes are connected via the graph
  isConnected(node1: number, node2: number) {
    return (this.bfs(node1, node2))? "connected": "not connected";
  }

  //API 2 - returns the number of distinct social networks in the graph (groups of students)
  distinctNetworks(){
    var count = 0;
    for (var vertex of this.vertices){
      if(!vertex.visited){
        this.bfs(vertex.value, null)
        count++;
      }
    }
    return count
  }

  //reset "visited" status of all nodes
  resetStatus(){
    for (var vertex of this.vertices) {
      vertex.visited = false
    }
  }
}


//HELPERS
//read data from file on load
(function() {
  var lr = require('line-by-line');
  
  //Read data
  var lineReader = new lr(fileName);
  var pairs = [];

  lineReader.on('line', function(line) {
    if (line.length > 1) {
      var x = line.split(" ");
      x = x.map(value => {
        return Number(value)
      });
      pairs.push(x)
    }
  });

  lineReader.on('end', function() {
    friends = new Graph(pairs);
    main();
  });

  lineReader.on('error', function(err) {
    console.log("Sorry, the file cannot be read")
  });
}())

//MAIN
//graph queries & results
function main(){
  console.log(`There are ${friends.distinctNetworks()} distinct groups`)
  friends.resetStatus();
  
  var f1, f2;

  //read command line arguments
  if (process.argv.slice(2).length > 0) {
    f1 = Number(process.argv.slice(2, 3)); 
    f2 = Number(process.argv.slice(3, 4));
  }
  else{
    f1 = friends.vertices[0].value
    f2 = friends.vertices[1].value
  }

  var c = friends.isConnected(f1, f2);
  console.log(`${f1} and ${f2} are ${c}`);
}