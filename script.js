const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let mode = "none";

// resize
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// cursor
let cursor = {x:200,y:200};
document.addEventListener("touchmove",(e)=>{
  let t=e.touches[0];
  cursor.x=t.clientX;
  cursor.y=t.clientY;

  document.getElementById("cursor").style.left=cursor.x+"px";
  document.getElementById("cursor").style.top=cursor.y+"px";
});

// 🧍 stickman
class Stickman{
  constructor(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.pose={armL:0,armR:0,legL:0,legR:0};
    this.vx=0;
    this.vy=0;
  }

  draw(){
    ctx.strokeStyle=this.color;
    ctx.lineWidth=3;

    ctx.beginPath();
    ctx.arc(this.x,this.y-40,10,0,Math.PI*2);

    ctx.moveTo(this.x,this.y-30);
    ctx.lineTo(this.x,this.y);

    ctx.moveTo(this.x,this.y-20);
    ctx.lineTo(this.x-15+this.pose.armL,this.y-5);

    ctx.moveTo(this.x,this.y-20);
    ctx.lineTo(this.x+15+this.pose.armR,this.y-5);

    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x-10+this.pose.legL,this.y+20);

    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x+10+this.pose.legR,this.y+20);

    ctx.stroke();
  }
}

// characters
let sticks = [];

// 🎬 STORY MODE (SCRIPTED)
let frame = 0;

function startStory(){
  mode="story";
  sticks=[
    new Stickman(100,300,"black"),
    new Stickman(600,300,"red")
  ];
  frame=0;
  loop();
}

function runStory(){
  frame++;

  let black=sticks[0];
  let red=sticks[1];

  // walk in
  if(frame<120){
    black.x+=1;
    black.pose.legL=Math.sin(frame*0.2)*10;
    black.pose.legR=-black.pose.legL;
  }

  // red enters
  if(frame>120 && frame<200){
    red.x-=2;
  }

  // punch
  if(frame===200){
    black.pose.armR=30;
  }
  if(frame===205){
    red.x+=60;
  }

  // paint interaction
  if(frame===260){
    document.getElementById("paintWindow").style.left="500px";
  }
}

// 🛠 SANDBOX
let sandboxBlocks=[];

function startSandbox(){
  mode="sandbox";
  sandboxBlocks=[];
  loop();
}

document.addEventListener("touchstart",()=>{
  if(mode==="sandbox"){
    sandboxBlocks.push({x:cursor.x,y:cursor.y});
  }
});

function runSandbox(){
  sandboxBlocks.forEach(b=>{
    ctx.fillStyle="red";
    ctx.fillRect(b.x,b.y,20,20);
  });
}

// ⚔ PvP
function startPvP(){
  mode="pvp";
  sticks=[
    new Stickman(200,300,"black"),
    new Stickman(400,300,"blue")
  ];
  loop();
}

function runPvP(){
  let a=sticks[0];
  let b=sticks[1];

  // follow cursor
  let dx=cursor.x-a.x;
  a.x+=dx*0.05;

  // simple fight
  if(Math.abs(a.x-b.x)<50){
    b.x+=20;
  }
}

// LOOP
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(mode==="story") runStory();
  if(mode==="sandbox") runSandbox();
  if(mode==="pvp") runPvP();

  sticks.forEach(s=>s.draw());

  requestAnimationFrame(loop);
}
