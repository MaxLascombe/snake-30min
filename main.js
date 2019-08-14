var s = 10;
var W = 50;
var H = 40;
var game_over = false;

var decodedCookie = decodeURIComponent(document.cookie);
console.log(decodedCookie);
var ca = decodedCookie.split(";");
for(var i = 0; i <ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == ' ') {
    c = c.substring(1);
  }
  if (c.indexOf("highscore") == 0) {
    var highscore = c.substring("highscore=".length, c.length);
  }
}

var pos = [[Math.round(W/2), Math.round(H/2)]];
var avail = []
for (var i = 0; i < W; i++) {
  for (var j = 0; j < H; j++) {
    if (i != pos[0][0] && j != pos[0][1]) {
      avail.push([i,j]);
    }
  }
}
var direction = -1;

function setup() {
  createCanvas(s*W, s*H);
}

last_update = Date.now();

console.log(last_update);

var foodLeftToEat = 0;

var food = [Math.floor(Math.random()*W), Math.floor(Math.random()*H)];

function snakeAteItself(newHead) {
  console.log(newHead);
  for (var i = 0; i < pos.length; i++) {
    if (newHead[0] == pos[i][0] && newHead[1] == pos[i][1]) {
      return true;
    }
  }
  return false;
}

function move() {
  var newHead = pos[0].slice(0);
  if (direction == 0) {
    newHead[1]--;
  } else if (direction == 1) {
    newHead[0]++;
  } else if (direction == 2) {
    newHead[1]++;
  } else if (direction == 3) {
    newHead[0]--;
  }
  if (direction>=0 && (newHead[0] < 0 || newHead[1] < 0 || newHead[0]>W-1 || newHead[1]>H-1 || snakeAteItself(newHead)))
    game_over = true;
  if (!game_over) {
    avail.splice(avail.indexOf(newHead),1);
    pos.splice(0, 0, newHead);
    if (newHead[0] == food[0] && newHead[1] == food[1]) {
      foodLeftToEat += 5;
      food = avail[Math.floor(Math.random()*avail.length)];
    }
    if (foodLeftToEat > 0) {
      foodLeftToEat--;
    } else {
      avail.push(pos.pop());
    }
  }
  else {
    if (pos.length > +highscore) {
      alert("You beat your highscore!");
      document.cookie = "highscore="+pos.length;
    } else {
      alert("You lost. Highscore: " + highscore);
    }
    noLoop();
  }
}

function draw() {
  document.getElementById("length").innerHTML = pos.length;
  document.getElementById("high").innerHTML = highscore;

  clear();
  background(153);
  fill(0,255,0);
  for (var i = 0; i < pos.length; i++) {
    rect(s*pos[i][0],s*pos[i][1],s,s);
  }

  fill(255, 105, 180);
  rect(s*food[0],s*food[1],s,s);

  if (Date.now() > last_update + 50) {
    move();
    last_update = Date.now();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    direction = 0;
  } else if (keyCode === RIGHT_ARROW) {
    direction = 1;
  } else if (keyCode === DOWN_ARROW) {
    direction = 2;
  } else if (keyCode === LEFT_ARROW) {
    direction = 3;
  }
}
