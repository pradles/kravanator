export class Player{
    constructor(){
        this.points = 0;
        this.lvl = 1;
        this.need = 5;
    }
    set addPoints(points){
        this.points += points;
        if(this.points >= this.need){
            console.log("LVL UP")
            this.lvl++;
            this.need += 5*this.lvl;
        }
    }

}