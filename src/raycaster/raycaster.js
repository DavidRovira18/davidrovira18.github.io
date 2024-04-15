const canvas = document.getElementById("raycaster_demo"); 
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var rect = canvas.getBoundingClientRect();

const collidables = new Array();
//Add the walls as collidables
collidables.push(new CollidableEntity(0, 0, canvas.width, 0, true));
collidables.push(new CollidableEntity(canvas.width, 0, canvas.width, canvas.height, true));
collidables.push(new CollidableEntity(canvas.width, canvas.height, 0, canvas.height, true));
collidables.push(new CollidableEntity(0, canvas.height, 0, 0, true));

collidables.push(new CollidableEntity(canvas.width/6, canvas.height/2, canvas.width/3, 0, false));
collidables.push(new CollidableEntity(canvas.width/2, canvas.height/4, canvas.width/2, canvas.height/3, false));
collidables.push(new CollidableEntity(1000, 800, 2500, 500, false));
collidables.push(new CollidableEntity(canvas.width/2, canvas.height/4, canvas.width/2, canvas.height/3, false));


const draw_collision = true;

ctx.fillStyle = "black";

const emit1 = new EmitEntity(canvas.width/2, canvas.height/2, 500);
function draw(ctx)
{
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var collidable of collidables)
        collidable.render(ctx);

    emit1.render(ctx);
}

function loop()
{
    draw(ctx);
    emit1.update(ctx,collidables);
    requestAnimationFrame(loop);
}

//Update
document.addEventListener("mousemove", onMouseMove);

function onMouseMove(event)
{
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;


    emit1.setPos(mouseX, mouseY);
}

loop();