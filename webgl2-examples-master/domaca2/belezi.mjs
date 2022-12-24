import { Spline } from "./Spline.mjs"

var i=0
var points = []
var curves = []
var zaPobrist = []
var canvas = document.getElementById("can")
const ctx = canvas.getContext('2d')

function points_push(x,y){
        points.push([x,y])
}

function curves_push(){
    curves.push(points)
    points = []
}

window.onload = function(){
    canvas.width = window.innerWidth*0.9
    canvas.height = window.innerHeight*0.9
}

function drawKrog(x,y,color){
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x,y, 5,0, 2 * Math.PI)
    ctx.fill()
}

function drawKvadrat(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 5, 10, 10); 
}

function drawCrta(x,y,x1,y1){
    ctx.beginPath()
    ctx.moveTo(x,y) 
    ctx.lineTo(x1,y1)
    ctx.stroke()
}

function pobrisi(){
    zaPobrist.forEach(element => {
        if(element[0]==0)
            drawKrog(element[1],element[2],'white')
        else
            drawKvadrat(element[1],element[2],'white')
    });
    zaPobrist = []
}

window.nuke = function(){
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if(i==3 || i==0){
        drawKrog(x,y,'orange')
        zaPobrist.push([0,x,y])
    }
    else{
        drawKvadrat(x,y,'blue')
        zaPobrist.push([1,x,y])
    }

    if(i==3){
        points_push(x,y)
        curves_push(x,y)
        i=0;
    }
    else{
        points_push(x,y)
        i++;
    }   
}

var canvas = document.getElementById("can")
canvas.addEventListener("mousedown", function (e) 
{ getCursorPosition(canvas, e);})

window.izrisi = function(tocke){
    i=0
    const spline = new Spline(curves);
    spline.makeContinuous();
    curves = spline.makeSmooth();

    var tocnost = 0.001
    pobrisi()
    ctx.moveTo(curves[0][0][0], curves[0][0][1]);
    for (var i=0; i<curves.length; i+=tocnost){
        var p = spline.value(i)
        ctx.lineTo(p[0], p[1])
    }
    ctx.stroke()
    curves.forEach(element => {
        drawKrog(element[0][0],element[0][1],'orange')
        drawKrog(element[3][0],element[3][1],'orange')

        drawKvadrat(element[1][0], element[1][1],'blue')
        drawKvadrat(element[2][0], element[2][1],'blue')

        drawCrta(element[0][0],element[0][1],element[1][0], element[1][1])
        drawCrta(element[3][0],element[3][1],element[2][0], element[2][1])
    });
    curves = []
}

  

