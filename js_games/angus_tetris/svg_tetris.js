
//----------------------------------------------------------------------
// static data

var SVG_NS ="http://www.w3.org/2000/svg";
var tickTimeReducer = 0.99;
var ROWS = 24;
var COLS = 12
//var COLS = 20;

var HPAD = 2; // horizontal padding used in laying out grids
var VPAD = 2; // ditto for vertical

var global_m = [];
var global_b = [];
var time_id;
var cc = 2; //color coordinate
var grey = "grey";
var cyan = "cyan";
var blue = "blue";
var purple = "purple";
var olive = "olive";
var orange = "orange";
var white = "white";

var SHAPE_DESCRIPTORS = [
 { color: "grey",   orientations: [ [[0,0,"grey"],[1,0,"grey"],[0,1,"blue"],[1,1,"blue"]],
								[[0,0,"blue"],[1,0,"grey"],[0,1,"blue"],[1,1,"grey"]],	
								[[0,0,"blue"],[1,0,"blue"],[0,1,"grey"],[1,1,"grey"]],	
								[[0,0,"grey"],[1,0,"blue"],[0,1,"grey"],[1,1,"blue"]]	
 ] },



  { color: "white",   orientations: [ [[0,0,"red"],[1,0,"red"],[2,0],[3,0]],

                                     [[0,0],[0,1],[0,2,"red"],[0,3,"red"]] ] },

  { color: "blue",   orientations: [ [[0,0,"green"],[1,0,"green"],[2,0],[2,1]],
                                     [[1,0,"green"],[1,1,"green"],[1,2],[0,2]],
                                     [[0,0,"green"],[0,1,"green"],[1,1],[2,1]],
                                     [[0,0,"green"],[1,0,"green"],[0,1],[0,2]] ] },

  { color: "purple", orientations: [ [[0,0],[0,1],[1,0],[2,0]],
                                     [[0,0],[1,0],[1,1],[1,2]],
                                     [[0,1],[1,1],[2,1],[2,0]],
                                     [[0,0],[0,1],[0,2],[1,2]] ] },

  { color: "olive", orientations: [ [[0,0],[0,1],[1,0],[2,0],[2,1]],
                                     [[0,0],[1,0],[0,1],[0,2],[1,2]],
                                     [[0,0],[0,1],[1,1],[2,0],[2,1]],
                                     [[0,0],[1,0],[1,1],[0,2],[1,2]] ] },

  { color: "red",    orientations: [ [[1,0],[1,1],[0,1],[0,2]],
                                     [[0,0],[1,0],[1,1],[2,1]] ] },

  { color: "yellow", orientations: [ [[0,1],[1,1],[2,1],[1,0]],
                                     [[0,0],[0,1],[0,2],[1,1]],
                                     [[0,0],[1,0],[2,0],[1,1]],
                                     [[1,0],[1,1],[1,2],[0,1]] ] }
/*
  { color: "orange", orientations: [ [[0,0],[0,1],[0,2],[1,1],[1,2],[2,2]], 
					[[0,0],[0,1],[0,2],[1,0],[1,1],[2,0]],
					[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]],
					[[0,0],[1,0],[1,1],[2,0],[2,1],[2,2]] ] }
*/
];


//----------------------------------------------------------------------
// Helper functions

// map a function over an array; accumulate output in new array:
function mapcar(f, a) {
  var res = new Array(a.length);
  for (var i=0;i<a.length;++i) {
    res[i] = f(a[i]);
  }
  return res;
}

// map a function over an array; don't accumulate output:
function mapc(f, a) {
  for (var i=0;i<a.length;++i) {
    f(a[i], i);
  }
}

// return true if predicate p is true for every element of the array:
function every(p, a) {
  for (var i=0;i<a.length;++i) {
    if (!p(a[i])) return false;
  }
  return true;
}

function suspendRedraw()
{
  // asv doesn't implement suspendRedraw, so we wrap this in a try-block:
  try {
    document.documentElement.suspendRedraw(0);
  }
  catch(e) {}
}

function unsuspendRedraw()
{
  // asv doesn't implement unsuspendRedraw, so we wrap this in a try-block:
  try {
    document.documentElement.unsuspendRedraw(0);
  }
  catch(e) {}
}

//----------------------------------------------------------------------
// Shape class 
function Shape(position) {
  // create a new shape, randomly picking a descriptor & orientation:
  this._descriptor = SHAPE_DESCRIPTORS[Math.round(Math.random()*(SHAPE_DESCRIPTORS.length-1))];
  this._orientation = Math.round(Math.random()*(this._descriptor.orientations.length-1));
  this._pos = position;
  this._orient = this._descriptor.orientations[this._orientation];
  this._cellNum=0;
}

Shape.prototype = {
  getCellArray : function() {
    var s = this;
    return mapcar(function(coord) { return [coord[0]+s._pos[0],coord[1]+s._pos[1]]; },
               this._descriptor.orientations[this._orientation]);
  },

  getColor : function(coord) {
   return this._descriptor.color;
  },

  getCellColor: function(cellNum) {
     var s = this;
     var color;
 
  try {

     console.log(this._orient + " orient")
     color  =  this._orient[this._cellNum++][cc]
     this._cellNum = this._cellNum % this._orient.length; 
   }  catch(e) {

	  color = this._descriptor.color;
   }
      return color ? color : this._descriptor.color;
   },

  move : function(dx,dy) {
      this._pos[0] += dx; this._pos[1] += dy;
  },
   rotate : function(dOrient) {
    this._orientation = (this._orientation+dOrient) % this._descriptor.orientations.length;
    if (this._orientation<0) this._orientation += this._descriptor.orientations.length;
    this._orient = this._descriptor.orientations[this._orientation];
  }
};

//----------------------------------------------------------------------
// Grid class

function Grid(cols, rows, color, bordercolor, x, y, width, height, node) {
  // Create a cols*rows grid with a 1/2-cell border.
  // Scale to fit width*height user pixels (including border).
  // Place at x,y user pixel coords.

  this._cols = cols;
  this._rows = rows;
  this._color = color;

  node.setAttribute("transform", "translate("+x+","+y+") scale("+
                                 (width/(cols+1))+","+(height/(rows+1))+") translate(0.5,0.5)");

  this._border = document.createElementNS(SVG_NS, "rect");
  this._border.setAttribute("fill", bordercolor);
  this._border.setAttribute("width", cols+1);
  this._border.setAttribute("height", rows+1);
  this._border.setAttribute("x", "-0.5");
  this._border.setAttribute("y", "-0.5");

  this._background = document.createElementNS(SVG_NS, "rect");
  this._background.setAttribute("fill", color);
  this._background.setAttribute("width", cols);
  this._background.setAttribute("height", rows);

  this._rowArray = document.createElementNS(SVG_NS, "g");
  for (var r=0;r<rows;++r) {
    var row_group = document.createElementNS(SVG_NS, "g");
    row_group.setAttribute("transform", "translate(0,"+r+")");

    for (var c=0;c<cols;++c) {
      var cell = document.createElementNS(SVG_NS, "rect");
      cell.setAttribute("x", c);
      cell.setAttribute("width", "1");
      cell.setAttribute("height", "1");
      cell.setAttribute("stroke", "blue");
      cell.setAttribute("fill", "none");
      cell.occupied = false;
      row_group.appendChild(cell);
    }
    this._rowArray.appendChild(row_group);
  }
  
  node.appendChild(this._border);
  node.appendChild(this._background);
  node.appendChild(this._rowArray);
}

Grid.prototype = {
  colorCell : function(coord, color) { try {
    this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).setAttribute("fill", color);  
}catch(e) {
alert("error: coord="+coord);
}
  },
  clearCell : function(coord) {
    this.colorCell(coord, this._color);
  },
  occupyCell : function(coord) {
// XXX ASV has a problem with expando properties, so we use attribs instead:
//    this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).occupied = true;
    this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).setAttribute("occupied", "true");
  },
  unoccupyCell : function(coord) {
//    this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).occupied = false;
    this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).setAttribute("occupied", "false");
  },
  cellInBounds : function(coord) {
    return (coord[0]>=0 && coord[1]>=0 && coord[0]<this._cols && coord[1]<this._rows);
  },
  cellOccupied : function(coord) {
//    return this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).occupied;
    return this._rowArray.childNodes.item(coord[1]).childNodes.item(coord[0]).getAttribute("occupied")=="true";
  },
  eliminateFullRows : function() {
    var g = this;
    var bo = false;
    function rowFull(r) {
      for (var c=0;c<g._cols;++c) {
        if (!g.cellOccupied([c,r])) return false;
      }
      return true;
    }

    function moveCellDown(c,r) {
      var src = g._rowArray.childNodes.item(r).childNodes.item(c);
      var dest = g._rowArray.childNodes.item(r+1).childNodes.item(c);
      dest.setAttribute("fill", src.getAttribute("fill"));
      //dest.occupied = src.occupied;
      //src.occupied = false;
      dest.setAttribute("occupied", src.getAttribute("occupied"));
      src.setAttribute("occupied", "false");
      src.setAttribute("fill", g._color);
    }
    
    function eliminateRow(row) {
      suspendRedraw();
      for (var c=0;c<g._cols;++c) {
        g.clearCell([c,row]);
        g.unoccupyCell([c,row]);
      }
      for (var r=row-1;r>=0;--r) {
        for (c=0;c<g._cols;++c) {
          if (g.cellOccupied([c,r])) 
            moveCellDown(c,r);
        }
      }
      unsuspendRedraw();
    }

    for (var r=0;r<this._rows;++r) {
      if (rowFull(r)) {
		score+=10;
  		var m = new Message(" Bonus:"+"+10", [3,7], "stroke:none;font-size:2px;fill:orange;stroke:black;stroke-width:0.04px;fill-opacity:0.8;font-family:monospace;");
		m.show()
		global_b.push(m);
        btimeout = setTimeout("Message.prototype.hide_bonus()", 3000)
        bo = true;  
        eliminateRow(r);
        ++lines;
      }
    }
    if (bo) {
      tickTime=time(tickTime);
    }
  }
};

//----------------------------------------------------------------------
// message class

function Message(txt, position, style) {
  this._node = document.createElementNS(SVG_NS, "text");
  this._node.setAttribute("style", style);
  this._node.setAttribute("x", position[0]);
  this._node.setAttribute("y", position[1]);
  this._node.appendChild(document.createTextNode(txt));
}

Message.prototype = {
  show : function() {
    suspendRedraw();
    svgR =  document.getElementById("svgroot");
    svgBoard = svgR.getElementById("board");
    svgBoard.appendChild(this._node)
 //   document.documentElement.appendChild(this._node);
    unsuspendRedraw();
  },
  hide : function(m) {
    svgR =  document.getElementById("svgroot");
    svgBoard = svgR.getElementById("board");
    global_m.length && svgBoard.removeChild(global_m.pop()._node)
//    document.documentElement.removeChild(global_m._node);
    //document.documentElement.removeChild(m._node);
    
  },
  hide_bonus : function(m) {
    svgR =  document.getElementById("svgroot");
    svgBoard = svgR.getElementById("board");
    global_b.length && svgBoard.removeChild(global_b.pop()._node);
   //document.documentElement.removeChild(global_b._node);
   // document.documentElement.removeChild(m._node);
  }
};

//----------------------------------------------------------------------
// grid <---> shape operations

function canPlace(shape, grid) {
  // can only place if all cells in shape are in bounds and not occupied:
  return every(function(coord){ return grid.cellInBounds(coord) &&
                                       !grid.cellOccupied(coord); },
                shape.getCellArray());
}

function show(shape, grid) {
  suspendRedraw();
  //mapc(function(coord){ grid.colorCell(coord, shape.getColor(coord)); },
  mapc(function(coord){ grid.colorCell(coord, shape.getCellColor()); },
       shape.getCellArray());
  unsuspendRedraw();
}

function hide(shape, grid) {
  suspendRedraw();
  mapc(function(coord){ grid.clearCell(coord); },
       shape.getCellArray());
  unsuspendRedraw();
}

function occupy(shape, grid) {
  mapc(function(coord){ grid.occupyCell(coord); },
       shape.getCellArray());
}

function move(shape, grid, dx, dy) {
  shape.move(dx,dy);
  if (!canPlace(shape, grid)) {
    shape.move(-dx,-dy);
    return false;
  }
  suspendRedraw();
  shape.move(-dx, -dy);
  hide(shape, grid);
  shape.move(dx,dy);
  show(shape, grid);
  unsuspendRedraw();
  return true;
}

function rotate(shape, grid, dOrient) {
  shape.rotate(dOrient);
  if (!canPlace(shape, grid)) {
    shape.rotate(-dOrient);
    return false;
  }
  suspendRedraw();
  shape.rotate(-dOrient);
  hide(shape, grid);
  shape.rotate(dOrient);
  show(shape, grid);
  unsuspendRedraw();
  return true;
}

function drop(shape, grid) {
  suspendRedraw();
  while (move(shape, grid, 0, 1))
    /**/;
  unsuspendRedraw();
}

//----------------------------------------------------------------------
// the game:

var board;   // grid where the action is
var preview; // grid where the next shape will be previewed
var currentShape; 
var lines;
var score;
var nextShape; 
var gameState; // "stopped", "running", "finished"
var tickTime;
function startNewGame() {
  // XXX clear grids
  score = 0;
  suspendRedraw();
  currentShape = new Shape([3,0]);
  lines = 0;
  show(currentShape, board);
  nextShape = new Shape([0,0]);
  show(nextShape, preview);
  unsuspendRedraw();
  gameState = "running";
  tickTime = 1200;
  tick();
}

function runNextShape() {
  occupy(currentShape, board);
  board.eliminateFullRows();
  score = score+1;
  var m = new Message(" Score:"+score, [1,10], "stroke:none;font-size:2px;fill:white;stroke:black;stroke-width:0.04px;fill-opacity:0.8;font-family:monospace;");
  global_m.push(m);
  m.show()
  time_id = setTimeout("Message.prototype.hide()", 2000);
  suspendRedraw();
  currentShape = nextShape;
  hide(nextShape, preview);
  currentShape.move(3,0);
  if (!canPlace(currentShape, board)) {
    unsuspendRedraw();
    return false; // game over!
  }
  show(currentShape, board);
  nextShape = new Shape([0,0]);
  show(nextShape, preview);
  unsuspendRedraw();
  return true;
}

function tick() {
  if (gameState != "running") return;

  if (!move(currentShape, board, 0, 1)) {
    if(!runNextShape()) {
      var m = new Message("Game Over! Score:"+score, [1,10], "stroke:none;font-size:2px;fill:red;stroke:black;stroke-width:0.04px;fill-opacity:0.8;font-family:monospace;");
      m.show();
      gameState = "finished";
      return; // Game over
    }
  }
  setTimeout("tick()", tickTime);
}

function time(tickTime) {
  tickTime = tickTime*tickTimeReducer;
  return tickTime;
}

function pause() {
  if (gameState == "running")
    gameState = "stopped";
}

function resume() {
  if (gameState == "stopped") {
    gameState = "running";
    tick();
  }
}

//----------------------------------------------------------------------
// user input handler

function keyHandler(event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 32: /* space */
      if (gameState == "running")
        drop(currentShape, board);
		clearTimeout(time_id);
        Message.prototype.hide();
      break;
    case 72: /* h */
      pause();
      alert("Help:\n"+
            "-------------------------------------\n\n"+
            "Score : "+score+"\n"+
            "Lines : "+lines+"\n"+
            "h : Display this help\n"+
            "p : Toggle pause game\n"+
            "up    : Rotate piece counterclockwise\n"+
            "down  : Rotate piece clocwise\n"+
            "left  : Move piece left\n"+
            "right : Move piece right\n"+
            "space : Drop piece\n");
      resume();
      break;
    case 80: /* p */
      if (gameState == "running") 
        pause();
      else
        resume();
      break;
    case 38: /* up */
      if (gameState == "running")
        rotate(currentShape, board, -1);
      break;
    case 40: /* down */
      if (gameState == "running")
        rotate(currentShape, board, 1);
      break;
    case 37: /* left */
      if (gameState == "running")
        move(currentShape, board, -1, 0);
      break;
    case 39: /* right */
      if (gameState == "running")
        move(currentShape, board, 1, 0);
      break;
  }
}

//----------------------------------------------------------------------

function init() {
  // page layout:
  document.documentElement.setAttribute("viewBox", "0 0 "+(3*HPAD+(COLS+1)+5)+" "+(2*VPAD+(ROWS+1)));

  board = new Grid(COLS, ROWS, "black", "grey", HPAD, VPAD, COLS+1, ROWS+1, document.getElementById("board"));
  preview = new Grid(4,4, "black", "grey", 2*HPAD+COLS+1, VPAD, 5, 5, document.getElementById("preview"));

  startNewGame();

  // initialize event processing:
  document.documentElement.addEventListener("keydown", keyHandler, false);
}


