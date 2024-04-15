class CollidableEntity{
    constructor(x1,y1,x2,y2, isWall)
    {
        this.startX = x1;
        this.startY = y1;
        this.endX = x2; 
        this.endY = y2;

        this.isWall = isWall;
        this.selected = false;

        this.a = new vec2(this.startX,this.startY);
        this.b = new vec2(this.endX,this.endY);
    }

    render(ctx)
    {
        if(this.isWall)
            return;
        
        this.selected ? ctx.strokeStyle = "green" : ctx.strokeStyle = "red";
        ctx.beginPath()
        ctx.lineWidth = 5;
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }
}