/*
	JS Shared Library
	Made by Tom Shearer for twam.us
	TODO: alot.jpg
*/
function $(s){return document.getElementById(s);}
function $$(s){return document.querySelectorAll(s);}

Element.prototype.remove = function() {this.parentElement.removeChild(this);}
var timeout;
function nav(source,target=$("main")){
	var page=source;
	window.document.title="Tom Shearer - "+page.charAt(0).toUpperCase()+page.slice(1);
	clearTimeout(timeout);
	target.className="fader";
	fetch("content/"+page+".htm",{
		method:'POST',
		body: target
	}).then(function(r){
		if(r.ok){return r.text();}
	}).then(function(d){
		target.innerHTML=d;
		timeout=setTimeout(function(){
			target.className="";
		},600);
	});

}
function displayToggle(el){
	if(el.children[1].style.display=="none"){
		el.children[1].style.display="";

		el.children[0].innerHTML=el.children[0].innerHTML.replace("+","-");
	}
	else{
		el.children[1].style.display="none";

		el.children[0].innerHTML=el.children[0].innerHTML.replace("-","+");
	}
}
function fib(i=0,x,y){
	if(i==0){x=0;y=1;}
	else if(i==10){return;}
	var z=x+y;
	console.log(z);
	i++;
	fib(i,y,z);
	/*
		fn = fn-1 + fn-2
		x = y + z
	*/
}
// Defined default page, as well as ensuring anchors work.
var loc=window.location.hash.substr(1);
if(loc==""){loc="about";}
nav(loc);
