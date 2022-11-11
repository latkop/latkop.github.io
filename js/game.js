/**
 * Paul Latkovic
 * 30051881
 * SENG 513 Assignment 2
 * @cite https://www.youtube.com/watch?v=vAeysIanWTw
 */

// Global variables
const gridSize = 3; // number of rows and columns
const gridHeight = 550; // pixels
const gridWidth = gridHeight * 0.9;
const cellSize = gridWidth / (gridSize + 2); // size of cells
const stroke = cellSize / 12; // stroke width
const dot = stroke; // dot radius
const margin = gridHeight - (gridSize + 1) * cellSize; // top margin for score, names, etc..
const boardColor = "lavender";
const p1Color = "rebeccapurple";
const p2Color = "dodgerblue";
const p3Color = "maroon";
const textSize = margin / 6;
const p1Text = "P1";
const p2Text = "P2";
const p3Text = "P3";
const textWin = "Wins!";

const gridWidthFactor = 0.25;
const gridWidthFactor2 = 0.5;
const gridWidthFactor3 = 0.75;
const marginFactor = 0.6;
const marginFactor2 = 3.2;
const marginFactor3 = 3.4;
const textFactor = 2;

const alert = document.createElement("div");
var verdict = "";

// Cell side object
const Edge = {
	BOTTOM: 0,
	LEFT: 1,
	RIGHT: 2,
	TOP: 3,
};

//  Global game variables
var cells, squares;
var player, players2Turn, players3Turn;
var p1Score, p2Score, p3Score;
var colPlay1, colPlay2, colPlay3;
var result, timeEnd;

// Initialize the game canvas
var canvas = document.createElement("canvas");
canvas.height = gridHeight;
canvas.width = gridWidth;
document.getElementById("game").appendChild(canvas);
var canvRect = canvas.getBoundingClientRect();

// set the context
var ctx = canvas.getContext("2d");
ctx.lineWidth = stroke;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// add event handlers
canvas.addEventListener("mousemove", hoverGrid); // maybe function call?
canvas.addEventListener("click", clickEvent);

// start the game
newGame();

// set up the loop to udpate the board every interval so it is not glitchy
setInterval(board, 30);

// function to load the game board
function board() {
	fillBoard();
	renderCells();
	renderGrid();
	drawScores();
}

// click event handler function
function clickEvent(/** @type {MouseEvent} */ ev) {
	if (timeEnd > 0) {
		return;
	}
	selectCellEdge();
}

function fillBoard() {
	ctx.fillStyle = boardColor;
	ctx.fillRect(0, 0, gridWidth, gridHeight);
}

function createDots(x, y) {
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(x, y, dot, 0, 10);
	ctx.fill();
}

function renderGrid() {
	for (let i = 0; i < gridSize + 1; i++) {
		for (let j = 0; j < gridSize + 1; j++) {
			createDots(getX(j), getY(i));
		}
	}
}
function renderCells() {
	for (let row of squares) {
		for (let square of row) {
			square.renderEdges();
			square.renderFill();
		}
	}
}

function renderText(x, y, text, color, size) {
	ctx.fillStyle = color;
	ctx.font = size + "px Helvetica";
	ctx.fillText(text, x, y);
}
function renderLine(x0, y0, x1, y1, color) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

function initPlayerColor() {
	// make into switch statement
	switch (player) {
		case 0:
			(colPlay1 = p1Color),
				(colPlay2 = "powderblue"),
				(colPlay3 = "rosybrown");
			break;
		case 1:
			(colPlay1 = "thistle"),
				(colPlay2 = p2Color),
				(colPlay3 = "rosybrown");
			break;
		case 2:
			(colPlay1 = "thistle"),
				(colPlay2 = "powderblue"),
				(colPlay3 = p3Color);
			break;
	}
}

function drawScores() {
	initPlayerColor();
	renderText(
		gridWidth * gridWidthFactor,
		margin * gridWidthFactor,
		p1Text,
		colPlay1,
		textSize
	);
	renderText(
		// change draw text
		gridWidth * gridWidthFactor,
		margin * marginFactor,
		p1Score,
		colPlay1,
		textSize * textFactor
	);
	renderText(
		gridWidth * gridWidthFactor2,
		margin * gridWidthFactor,
		p2Text,
		colPlay2,
		textSize
	);
	renderText(
		gridWidth * gridWidthFactor2,
		margin * marginFactor,
		p2Score,
		colPlay2,
		textSize * textFactor
	);
	renderText(
		gridWidth * gridWidthFactor3,
		margin * gridWidthFactor,
		p3Text,
		colPlay3,
		textSize
	);
	renderText(
		gridWidth * gridWidthFactor3,
		margin * marginFactor,
		p3Score,
		colPlay3,
		textSize * textFactor
	);
}

function initEndGameModal() {
	if (p2Score == p1Score && p2Score > p3Score) {
		verdict = "P1 and P2 Draw!";
	}
	// p1 wins
	else if (p2Score < p1Score && p1Score > p3Score) {
		verdict = "P1 Wins!";
	}
	// p2 wins
	else if (p2Score > p1Score && p2Score > p3Score) {
		verdict = "P2 Wins!";
	}
	// p3 wins
	else if (p2Score < p3Score && p1Score < p3Score) {
		verdict = "P3 Wins!";
	}
	// Draw
	else if (p1Score == p3Score && p1Score == p2Score) {
		verdict = "P1, P2, and P3 Draw!";
	} else if (p1Score == p3Score && p1Score > p2Score) {
		verdict = "P1 and P3 Draw!";
	} else if (p2Score == p3Score && p2Score > p1Score) {
		verdict = "P2 and P3 Draw!";
	}
	alert.innerHTML = `
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="text-center" id="exampleModalLabel">Game Over!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${verdict}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" id="new-game" onclick="newGame()" class="btn btn-secondary" data-bs-dismiss="modal">New Game</button>
                    </div>
                </div>
            </div>
        </div>
        `;
	document.getElementById("test").appendChild(alert);
	document.getElementById("mybutton").click();
}

document.getElementById("new-game").onclick = newGame;
function getY(row) {
	return margin + cellSize * row;
}

function getX(col) {
	return cellSize * (col + 1);
}

function getPlayerColor(players) {
	if (players == 0) {
		return p1Color;
	} else if (players == 1) {
		return p2Color;
	} else if (players == 2) {
		return p3Color;
	}
}

/**
 * @cite https://www.youtube.com/watch?v=vAeysIanWTw
 */
function hover(x, y) {
	for (let row of squares) {
		for (let square of row) {
			square.highlight = null;
		}
	}
	let rows = squares.length;
	let cols = squares[0].length;
	cells = [];
	L1: for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (squares[i][j].contains(x, y)) {
				let side = squares[i][j].hover(x, y);
				if (side != null) {
					cells.push({
						row: i,
						col: j,
					});
				}
				let row = i,
					col = j,
					highlight,
					neighbour = true;
				if (side == Edge.LEFT && j > 0) {
					col = j - 1;
					highlight = Edge.RIGHT;
				} else if (
					side == Edge.BOTTOM &&
					i < rows - 1
				) {
					row = i + 1;
					highlight = Edge.TOP;
				} else if (side == Edge.TOP && i > 0) {
					row = i - 1;
					highlight = Edge.BOTTOM;
				} else if (
					side == Edge.RIGHT &&
					j < cols - 1
				) {
					col = j + 1;
					highlight = Edge.LEFT;
				} else {
					neighbour = false;
				}
				// highlight neighbour
				if (neighbour) {
					squares[row][col].highlight =
						highlight;
					cells.push({
						row: row,
						col: col,
					});
				}

				break L1;
			}
		}
	}
}

function hoverGrid(/** @type {MouseEvent} */ ev) {
	let x = ev.clientX - canvRect.left;
	let y = ev.clientY - canvRect.top;

	hover(x, y);
}
/**
 * @cite https://www.youtube.com/watch?v=vAeysIanWTw
 */
function newGame() {
	cells = [];
	player = 0;
	p1Score = 0;
	p2Score = 0;
	p3Score = 0;
	result = "";

	squares = [];

	for (let i = 0; i < gridSize; i++) {
		squares[i] = [];
		for (let j = 0; j < gridSize; j++) {
			squares[i][j] = new Cell(
				getX(j),
				getY(i),
				cellSize,
				cellSize
			);
		}
	}
}
function selectCellEdge() {
	if (cells == null || cells.length == 0) {
		return;
	}
	let filledSquare = false;
	for (let cell of cells) {
		if (squares[cell.row][cell.col].selectCellEdge()) {
			filledSquare = true;
		}
	}
	cells = [];

	if (filledSquare) {
		if (p1Score + p2Score + p3Score == gridSize * gridSize) {
			initEndGameModal();
		}
	} else {
		if (player == 0) {
			player++;
		} else if (player == 1) {
			player++;
		} else if (player == 2) {
			player -= 2;
		}
	}
}
function Cell(x, y, w, h) {
	this.numSelected = 0;
	this.self = null;

	// Cell sides
	this.botOfCell = { self: null, selected: false };
	this.leftOfCell = { self: null, selected: false };
	this.rightOfCell = { self: null, selected: false };
	this.topOfCell = { self: null, selected: false };

	// coordinate of cell
	this.r = x + w;
	this.t = y;
	this.b = y + h;
	this.l = x;

	// highlight property
	this.highlight = null;

	// dimensions
	this.w = w;
	this.h = h;

	this.contains = function (x, y) {
		return (
			x >= this.l &&
			x < this.r &&
			y >= this.t &&
			y < this.b
		);
	};

	this.renderFill = function () {
		if (this.self == null) {
			return;
		}
		ctx.fillStyle = getPlayerColor(this.self);
		// fill the square
		ctx.fillRect(
			this.l + stroke,
			this.t + stroke,
			this.w - stroke * 2,
			this.h - stroke * 2
		);
	};

	this.renderEdges = function () {
		if (this.highlight != null) {
			if (this.highlight == Edge.BOTTOM) {
				renderLine(
					this.l,
					this.b,
					this.r,
					this.b,
					getPlayerColor(player)
				);
			} else if (this.highlight == Edge.TOP) {
				renderLine(
					this.l,
					this.t,
					this.r,
					this.t,
					getPlayerColor(player)
				);
			} else if (this.highlight == Edge.RIGHT) {
				renderLine(
					this.r,
					this.t,
					this.r,
					this.b,
					getPlayerColor(player)
				);
			} else if (this.highlight == Edge.LEFT) {
				renderLine(
					this.l,
					this.t,
					this.l,
					this.b,
					getPlayerColor(player)
				);
			}
		}

		// selected sides
		if (this.rightOfCell.selected) {
			renderLine(
				this.r,
				this.t,
				this.r,
				this.b,
				getPlayerColor(this.rightOfCell.self)
			);
		}
		if (this.topOfCell.selected) {
			renderLine(
				this.l,
				this.t,
				this.r,
				this.t,
				getPlayerColor(this.topOfCell.self)
			);
		}
		if (this.botOfCell.selected) {
			renderLine(
				this.l,
				this.b,
				this.r,
				this.b,
				getPlayerColor(this.botOfCell.self)
			);
		}
		if (this.leftOfCell.selected) {
			renderLine(
				this.l,
				this.t,
				this.l,
				this.b,
				getPlayerColor(this.leftOfCell.self)
			);
		}
	};

	/**
	 * @cite https://www.youtube.com/watch?v=vAeysIanWTw
	 */
	this.hover = function (x, y) {
		let mBot = this.b - y;
		let mLeft = x - this.l;
		let mRight = this.r - x;
		let mTop = y - this.t;
		let mClosest = Math.min(mBot, mLeft, mRight, mTop);
		if (mClosest == mBot && !this.botOfCell.selected) {
			this.highlight = Edge.BOTTOM;
		} else if (mClosest == mLeft && !this.leftOfCell.selected) {
			this.highlight = Edge.LEFT;
		} else if (
			mClosest == mRight &&
			!this.rightOfCell.selected
		) {
			this.highlight = Edge.RIGHT;
		} else if (mClosest == mTop && !this.topOfCell.selected) {
			this.highlight = Edge.TOP;
		}
		return this.highlight;
	};

	/**
	 * @cite https://www.youtube.com/watch?v=vAeysIanWTw
	 */
	this.selectCellEdge = function () {
		if (this.highlight == null) {
			return;
		}
		switch (this.highlight) {
			case Edge.TOP:
				this.topOfCell.self = player;
				this.topOfCell.selected = true;
				break;
			case Edge.BOTTOM:
				this.botOfCell.self = player;
				this.botOfCell.selected = true;
				break;
			case Edge.RIGHT:
				this.rightOfCell.self = player;
				this.rightOfCell.selected = true;
				break;

			case Edge.LEFT:
				this.leftOfCell.self = player;
				this.leftOfCell.selected = true;
				break;
		}
		this.highlight = null;
		this.numSelected++;
		if (this.numSelected == 4) {
			this.self = player;
			if (player == 0) {
				p1Score++;
			} else if (player == 1) {
				p2Score++;
			} else if (player == 2) {
				p3Score++;
			}
			return true;
		}
		return false;
	};
}
