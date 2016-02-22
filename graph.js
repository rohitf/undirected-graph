/// <reference path="./typings/main.d.ts" />
// Rohit Falor
// graph.js
// A graph class implemented in JavaScript
// Last modified: 2/21/2016

//DECLARE VARS
var friends;
var fileName = "data.txt";

//CLASS DEFINITIONS
//abstraction of queue data type
var Queue = (function () {
    function Queue(data) {
        this.queue = [data];
    }
    Queue.prototype.enqueue = function (data) {
        this.queue.unshift(data);
    };
    Queue.prototype.dequeue = function () {
        return this.queue.pop();
    };
    Queue.prototype.isEmpty = function () {
        return this.queue.length <= 0;
    };
    return Queue;
})();

//represents a graph node (a student)
var GraphNode = (function () {
    function GraphNode(value, visited) {
        if (visited === void 0) { visited = false; }
        this.value = value;
        this.visited = visited;
    }
    return GraphNode;
})();

//represents a graph (network of students)
var Graph = (function () {
    function Graph(edges) {
        this.vertices = [];
        this.edges = edges;
        var flat_arr = [].concat.apply([], this.edges);
        var unique = flat_arr.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        }).sort();
        this.vertices = unique.map(function (value) {
            return new GraphNode(value);
        });
    }
    //constructs an adjacency list to represent this graph
    Graph.prototype.adjacencyList = function () {
        var g = this;
        var o = {};
        for (var _i = 0, _a = g.vertices; _i < _a.length; _i++) {
            var vertex = _a[_i];
            var l = [];
            g.edges.forEach(function (edge) {
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
    };
    //returns graph node by value (student ID)
    Graph.prototype.getNodeByValue = function (nodeValue) {
        for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.value == nodeValue)
                return v;
        }
    };
    //breadth first search - custom implementation
    Graph.prototype.bfs = function (start, end) {
        var currNode;
        var startNode = this.getNodeByValue(start);
        var endNode = this.getNodeByValue(end);
        var queue = new Queue(startNode);
        while (!queue.isEmpty()) {
            currNode = queue.dequeue();
            if (!currNode.visited) {
                currNode.visited = true;
                for (var _i = 0, _a = this.adjacencyList()[currNode.value]; _i < _a.length; _i++) {
                    var adjNode = _a[_i];
                    if (adjNode == endNode)
                        return true;
                    queue.enqueue(adjNode);
                }
            }
        }
        return false;
    };
    //API 1 - returns if any 2 nodes are connected via the graph
    Graph.prototype.isConnected = function (node1, node2) {
        return (this.bfs(node1, node2)) ? "connected" : "not connected";
    };
    //API 2 - returns the number of distinct social networks in the graph (groups of students)
    Graph.prototype.distinctNetworks = function () {
        var count = 0;
        for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
            var vertex = _a[_i];
            if (!vertex.visited) {
                this.bfs(vertex.value, null);
                count++;
            }
        }
        return count;
    };
    //reset "visited" status of all nodes
    Graph.prototype.resetStatus = function () {
        for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
            var vertex = _a[_i];
            vertex.visited = false;
        }
    };
    return Graph;
})();

//HELPERS
//read data from file on load
(function () {
    var lr = require('line-by-line');
    //Read data
    var lineReader = new lr(fileName);
    var pairs = [];
    lineReader.on('line', function (line) {
        if (line.length > 1) {
            var x = line.split(" ");
            x = x.map(function (value) {
                return Number(value);
            });
            pairs.push(x);
        }
    });
    lineReader.on('end', function () {
        friends = new Graph(pairs);
        main();
    });
    lineReader.on('error', function (err) {
        console.log("Sorry, the file cannot be read");
    });
}());

//MAIN
//graph queries & results
function main() {
    console.log("There are " + friends.distinctNetworks() + " distinct groups");
    friends.resetStatus();
    var f1, f2;
    //read command line arguments
    if (process.argv.slice(2).length > 0) {
        f1 = Number(process.argv.slice(2, 3));
        f2 = Number(process.argv.slice(3, 4));
    }
    else {
        f1 = friends.vertices[0].value;
        f2 = friends.vertices[1].value;
    }
    var c = friends.isConnected(f1, f2);
    console.log(f1 + " and " + f2 + " are " + c);
}