class Ray
{
    constructor(x, y, angle)
    {
        this.pos = new vec2(x,y);

        //CREATE VECTOR FROM ANGLE
        const dir_x = Math.cos(angle);
        const dir_y = Math.sin(angle);
    
        this.dir = new vec2(dir_x, dir_y);
    }

    
    setPos(x,y)
    {
        this.pos.x = x;
        this.pos.y = y;    
    }

    setDir(x,y)
    {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    rayWallCollision(wall) //Returns the collsion point if there is collision (line vs line colliding)
    {   
        /*References http://www.jeffreythompson.org/collision-detection/line-line.php, 
        https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection*/
        
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        //Check if there is collision
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if(den == 0) //Lines are parallel, no collision possible
            return null;

        var t = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
        t /= den;
        
        var u = (x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3);
        u /= - den;

        if( t > 0 &&  t < 1 &&  u > 0)
        {   
            var intersectionX = x1 + t * (x2 - x1); 
            var intersectionY = y1 + t * (y2 - y1);
            return new vec2(intersectionX, intersectionY); 
        }
            

        return null;
    }

    render(ctx)
    {
        var temp_dir = new vec2(this.dir.x, this.dir.y)
        temp_dir.scale(10); //Rendering purposes
        var ray_end = temp_dir.add(this.pos);

        ctx.strokeStyle = "white";
        ctx.beginPath()
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(ray_end.x, ray_end.y);
        ctx.stroke();
    }
}