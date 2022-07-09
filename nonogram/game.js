/*
	Twamgram - A copycat of nonogram until I can write a better description
	Made by Tom Shearer, highly unlikely to see the light of day
*/
// ---NOTES---
// TODO: puzzle generator based off of either images or some other algorithm
// Later TODO: rewrite in Python
// Consider: colorized nonogram
// Option: Maybe make an increased difficulty (nay, impossible difficulty)
// where numbers are just totals of the row, not distributed

//Other: Don't use <table> like a scrub. change to div lol
// ---END NOTES---


// Shorties for ease of development
function $(s){return document.getElementById(s);}
function $$(s){return document.querySelectorAll(s);}

Element.prototype.remove = function() {this.parentElement.removeChild(this);}

let size=10;
const puzzle=Array.from({length:size},()=> (Array.from({length:size},()=> (Math.round(Math.random())))));
const puzzlecheck=Array.from({length:size},()=> (Array.from({length:size},()=> (0))));
const lives=3;
/*
	 1 1 1
	 11111
	 11111
	 -----
111	|	 |
11	|	 |
111	|	 |
11	|	 |
111	|	 |
	 -----
topheader=[[1,1,1],[1,1],[1,1,1],[1,1],[1,1,1]]
sideheader=[[1,1,1],[1,1],[1,1,1],[1,1],[1,1,1]]
*/
function pregameLoad(){
	document.getElementById("toolname").value="pen";
	for(let i=0;i<tools.children.length;i++){
		if(tools.children[i].id=="pen"){
			tools.children[i].style.backgroundColor="#00f";
		}
		else{
			tools.children[i].style.backgroundColor="#fff";
		}
		tools.children[i].onclick=toolSelect;
	}

}
function newGame(puzzle="random",lives=5){
	pregameLoad();
	if(puzzle=="random"){console.log("Random coming soon.");}
	let life=document.createElement("div");
	for(let i=0;i<lives;i++){
		let life=document.createElement("div");
		life.innerText=" 🔴 ";
		document.getElementById("lives").append(life);
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
		row.append(cell);
	}
	row.className="topheader";
	table.prepend(row);

	document.getElementById("main").append(table);

}

function clickedCell(cell){
	let [x,y]=cell.target.id.split("-");
	if(cell.target.className=="valid"||cell.target.className=="invalid"){return;}
	if(document.getElementById("toolname").value=="pen"){
		if(puzzle[y][x]==1){
			cell.target.className="valid";
			puzzlecheck[y][x]=1;
		}
		else{
			if(document.getElementById("lives").children.length==1){
				youLose();
			}
			else{
				cell.target.className="invalid";
				document.getElementById("lives").removeChild(document.getElementById("lives").childNodes[document.getElementById("lives").children.length-1]);
			}
		}
	}
	else if(document.getElementById("toolname").value=="cross"){
		if(puzzle[y][x]==0){
			cell.target.className="invalid";

		}
		else{
			if(document.getElementById("lives").children.length==1){
				youLose();
			}
			else{
				cell.target.className="valid";
				document.getElementById("lives").removeChild(document.getElementById("lives").childNodes[document.getElementById("lives").children.length-1]);
			}
		}
	}
	checkWin();
}
function toolSelect(tool){
	let tools=document.getElementById("tools");
	document.getElementById("toolname").value=tool.target.id;
	for(let i=0;i<tools.children.length;i++){
		if(tools.children[i].id==tool.target.id){
			tools.children[i].style.backgroundColor="#00f";
		}
		else{
			tools.children[i].style.backgroundColor="#fff";
		}
	}
	// if(tool.target.id)
}
function youLose(){
	document.getElementById("lives").innerText="GAME OVER";
	let cells=document.getElementsByTagName("td");
	for(let i=0;i<cells.length;i++){
		cells[i].className="invalid";
	}
}
function checkWin(){
	//TODO: check for complete row
	// for(let y=0;y<puzzle.length;y++){
	// 	if(JSON.stringify(puzzle[y])===JSON.stringify(puzzlecheck[y])){
	// 		document.getElementById("table")
	// 		document.getElementsByName("row"+y).forEach(function(el){
	// 			if(el.className==""){
	// 				el.className="invalid";
	// 			}
	// 		});
	// 	}
	// }
	//check for win condition
	if(JSON.stringify(puzzle)===JSON.stringify(puzzlecheck)){
		document.getElementById("win").innerText="Hey cool, you won NOTHING!";
		let cells=document.getElementsByTagName("td");
		console.log(cells);
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
