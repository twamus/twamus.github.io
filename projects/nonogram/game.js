/*
	Twamgram - A copycat of nonogram as a demo
	Made by Tom Shearer at twamus.github.io

// ---NOTES---
// TODO: puzzle generator based off of either images or some other algorithm
// Consider: colorized nonogram
// Option: Maybe make an increased difficulty (nay, !impossible! difficulty)
// where numbers are just totals of the row, not distributed

//Version 1.2
- Made dimensions scale for mobile
- Resized menu bar tools/lives
- Moved version to the top
- Made rows and columns auto-populate X's when row is solved. only exception being that when they start as 0, it does not auto populate.
- Made rows and columns highlight the header when it is solved.
 ---END NOTES--- */


// Shorties
function $(s){return document.getElementById(s);}
function $$(s){return document.querySelectorAll(s);}

Element.prototype.remove = function() {this.parentElement.removeChild(this);}
let version="1.22";
let size=10;
let puzzle,puzzlecheck;
let lives=3;
// Functions Start

function restartGame(){
	if(confirm('New Game?')){
		//remove previous table, lives, winning screen, game over screen
		$("win").innerText="";
		$("lives").innerText="";
		$("gametable").remove("gametable");
		while($("lives").firstChild) {
			$("lives").removeChild($("lives").firstChild);
		}
		newGame();
	}
}

function pregameLoad(){
	$("version").innerText="Version "+version;
	$("toolname").value="pen";
	for(let i=0;i<tools.children.length;i++){
		if(tools.children[i].id=="pen"){
			tools.children[i].style.background="linear-gradient(-45deg, #0cf, #cff)";
		}
		else{
			tools.children[i].style.background="";
		}
		tools.children[i].onclick=toolSelect;
	}
	puzzle=Array.from({length:size},()=> (Array.from({length:size},()=> (Math.round(Math.random())))));
	puzzlecheck=Array.from({length:size},()=> (Array.from({length:size},()=> (0))));
}
function newGame(){
	pregameLoad();
	let life=document.createElement("div");
	for(let i=0;i<lives;i++){
		let life=document.createElement("div");
		life.innerText="🔴";
		$("lives").append(life);
	}
	//gets me an [X, Y] for sanity sake
	// Builder portion
	// Goals: get side numbers, set board.
	let xsize=puzzle[0].length;
	let ysize=puzzle.length;
	//remember that Array.fill() can be evil because it uses the same object as the filled content.
	let topheader=Array.from({length:xsize},()=> ([0]));
	let sideheader=Array.from({length:ysize},()=> ([0]));
	let table=document.createElement("table");
	table.setAttribute("id","gametable");
	for(let y=0;y<ysize;y++){
		let row=document.createElement("tr");
		for(let x=0;x<xsize;x++){
			if(puzzle[y][x]==0){
				if(topheader[x][topheader[x].length-1]!=0){
					topheader[x].push(0);
				}
				if(sideheader[y][sideheader[y].length-1]!=0){
					sideheader[y].push(0);
				}
			}
			else{
				topheader[x][topheader[x].length-1]++;
				sideheader[y][sideheader[y].length-1]++;
			}
			let cell=document.createElement("td");
			cell.setAttribute("id",x+"-"+y);
			cell.onclick=clickedCell;
			row.append(cell);
		}
		cell=document.createElement("th");
		if(sideheader[y][sideheader[y].length-1]==0&&sideheader[y].length>1){
			sideheader[y].pop();
		}
		cell.innerHTML=sideheader[y].join(" &nbsp;");
		cell.className="sideheader";
		cell.id="R"+y;
		row.prepend(cell);
		table.append(row);
	}
	// top header append loop as i can't seem to see a sane way to do it inline
	row=document.createElement("tr");
	// blank cell because side header exists
	row.append(document.createElement("th"));
	for(let i=0;i<xsize;i++){
		cell=document.createElement("th");
		if(topheader[i][topheader[i].length-1]==0&&topheader[i].length>1){
			topheader[i].pop();
		}
		cell.innerHTML=topheader[i].join("<br>");
		cell.id="C"+i;
		row.append(cell);
	}
	row.className="topheader";

	table.prepend(row);
	$("main").append(table);

}

function clickedCell(cell){
	let [x,y]=cell.target.id.split("-");
	if(cell.target.className=="valid"||cell.target.className=="invalid"){return;}
	if($("toolname").value=="pen"){
		//correct pen usage
		if(puzzle[y][x]==1){
			cell.target.className="valid";
			puzzlecheck[y][x]=1;
		}
		//incorrect pen usage
		else{
			if($("lives").children.length==1){
				youLose();
			}
			else{
				cell.target.className="invalid";
				$("lives").removeChild($("lives").childNodes[$("lives").children.length-1]);
			}
		}
	}
	else if($("toolname").value=="cross"){
		//proper cross usage
		if(puzzle[y][x]==0){
			cell.target.className="invalid";

		}
		//improper cross usage
		else{
			if($("lives").children.length==1){
				youLose();
			}
			else{
				cell.target.className="valid";
				$("lives").removeChild($("lives").childNodes[$("lives").children.length-1]);
				puzzlecheck[y][x]=1; //Yes, this needs to happen, otherwise win screen will not show. whoops.
			}
		}
	}
	checkLine(x,y);
	checkWin();
}

function toolSelect(tool){
	let tools=$("tools");
	$("toolname").value=tool.target.id;
	for(let i=0;i<tools.children.length;i++){
		if(tools.children[i].id==tool.target.id){
			tools.children[i].style.background="linear-gradient(-45deg, #0cf, #cff)";
		}
		else{
			tools.children[i].style.background="";
		}
	}
}
function youLose(){
	$("lives").innerText="GAME OVER";
	let cells=document.getElementsByTagName("td");
	for(let i=0;i<cells.length;i++){
		cells[i].className="invalid";
	}
}
function checkLine(x,y){
	// Checks for complete row or column, then highlights it cyan and auto-fills X's.
	// Row:
	if(JSON.stringify(puzzle[y])===JSON.stringify(puzzlecheck[y])){
		for(let i=0;i<puzzle.length;i++){
			let el=document.getElementById(i+"-"+y)
			if(el.className==""){
				el.className="invalid";
			}
		}
		document.getElementById("R"+y).className="sideheader solved";
	}
	// Column:
	let colcomplete=0;
	for(let n=0;n<puzzle.length;n++){
		if(puzzle[n][x]!=puzzlecheck[n][x]){
			colcomplete=0;break;
		}
		colcomplete=1;
	}
	if(colcomplete==1){
		for(let i=0;i<puzzle.length;i++){
			let el=document.getElementById(x+"-"+i)
			if(el.className==""){
				el.className="invalid";
			}
		}
		document.getElementById("C"+x).className="solved";
	}
}

function checkWin(){

	//check for win condition
	if(JSON.stringify(puzzle)===JSON.stringify(puzzlecheck)){
		$("win").innerHTML="Hey cool, you won! Enjoy your prize of: <div id='prize'><b>ERROR:</b> <i>Prize not implemented.</i></div>";
		let cells=document.getElementsByTagName("td");
		for(let i=0;i<cells.length;i++){
			if(cells[i].className==""){
				cells[i].className="invalid";
			}
		}
	}
	// console.log("p");
	// console.log(puzzle);
	// console.log("pc");
	// console.log(puzzlecheck);
}
