export class Player{
    constructor(){
        this.points = 0;
        this.lvl = 1;
        this.need = 5;
        this.lvlup = new Audio('../common/lvlup.mp3')
        this.success = new Audio('../common/success.mp3');
    }
    set addPoints(points){
        this.points += points;
        console.log(this.points)
        if(this.points >= this.need){
            this.lvlup.play()
            console.log("LVL UP")
            this.lvl++;
            this.need += 5*this.lvl;
            return
        }
        this.success.play()
    }

}