class EmitEntity{
    constructor(x,y, num_rays){
        this.pos = new vec2(x,y);
        this.rays = new Array();

        for(var i = 0; i < 360; i += 360 / num_rays)
        {
            this.rays.push(new Ray(this.pos.x, this.pos.y, i * (Math.PI/180)));
        }
    }

    emitEntityWallCollision(ctx, collidables)
    {
        for(var ray of this.rays)
        {
            var near_pt = null;
            var near_dist = Infinity;
            for(var collidable of collidables)
            {   
                const col_pt = ray.rayWallCollision(collidable);

                if(!col_pt)
                    continue;
                
                var dist = ray.pos.distance(col_pt);
            
                if(dist < near_dist){
                    near_dist = dist;
                    near_pt = col_pt;
                }
            }

            if(!near_pt)
                continue;
            
            //ATTENUATION BY DISTANCE COMPUTATION (INVERSE QUADRATIC FUNCTION)
            var att = 1/(near_dist * near_dist) * 5000;

            ctx.strokeStyle = `rgba(255,255,255, ${att})`;
            ctx.beginPath()
            ctx.moveTo(ray.pos.x, ray.pos.y);
            ctx.lineTo(near_pt.x, near_pt.y);
            ctx.stroke();

        }
    }

    render(ctx)
    {
        for (var ray of this.rays)
            ray.render(ctx);
    }

    update(ctx, collidables)
    {
        this.emitEntityWallCollision(ctx, collidables);
    }

    setPos(x, y)
    {
        for(var ray of this.rays)
            ray.setPos(x, y);
    }
}