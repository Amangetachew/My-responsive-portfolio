let score=JSON.parse(localStorage.getItem('score')) || {
  wins:0,
losses:0,
ties:0
};
updatescore();

let isautopl=false;
let id;

function autop(){
  if (!isautopl){
 id = setInterval(function(){
   const par = pg();
ss(par); }
,2000); 
isautopl=true;
} else{
  clearInterval(id);
  isautopl=false;
}

}
document.querySelector('.spr').addEventListener('click',()=>{
  ss('rock');
})
document.querySelector('.spr-p').addEventListener('click',()=>{
  ss('paper');
})
document.querySelector('.spr-s').addEventListener('click',()=>{
  ss('scissors');
})
document.querySelector('.res').addEventListener('click',()=>{
  score.wins=0;
  score.losses=0 ;
   score.ties=0;
  localStorage.removeItem('score');
  updatescore();
})
document.querySelector('.auto').addEventListener('click',()=>{
  autop();})
  document.body.addEventListener('keydown',(event)=>{
    if(event.key==='r'){
      ss('rock');
    }else if(event.key==='p'){
      ss('paper');
    }else if(event.key==='s'){
      ss('scissors');
    }


  })

function ss(par){

const cm=pg();

let result='';

if (par==='scissors'){

if(cm === 'scissors'){
result='Tie.';
}
else if (cm === 'rock'){
result='Computer win. ';
}
else if (cm === 'paper'){
result='You win.';}
}
if (par==='paper'){

if(cm === 'paper'){
    result='Tie.';
  }else if (cm === 'scissors'){
    result='Computer win. ';
  }else if (cm === 'rock'){
    result='You win.';}
} 
if(par==='rock'){

if(cm === 'rock'){
    result='Tie.';
  }else if (cm === 'paper'){
    result='Computer win.';
  }else if (cm === 'scissors'){
    result='You win.';}
}

if (result==='Tie.'){
score.ties++
}else if (result==='Computer win. '){
score.losses++
}else if (result==='You win.'){ 
score.wins++
}
localStorage.setItem('score',JSON.stringify(score));

updatescore();
document.querySelector('.jresult').innerHTML=(result);
document.querySelector('.jmove').innerHTML=(` YOU 
<img src="images/${par}-emoji.png" class="sc">
<img src="images/${cm}-emoji.png" class="sc">
COMPUTER`)

}

function updatescore(){
document.querySelector('.jscore').innerHTML=(`wins: ${score.wins} , losses: ${score.losses} , ties: ${score.ties}`);
}

function pg(){

const rn = Math.random();
  let cm='';
  if(rn >=0  &&  rn <1/3){
    cm='rock';
  }
  else if(rn >=1/3 && rn <2/3){
    cm='paper';

  }
  else if(rn >=2/3 && rn <1) {
    cm='scissors';
  }
return cm;
}