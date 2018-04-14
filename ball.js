'use strict'
module.exports = class Ball {

    constructor(stage) {
        this.speed = 7.5;
        this.angle = 45;
        this.xdir = 1;
        this.ydir = 1;
        this.size = 5;
        this.pos = {
            x: 100,
            y: 100
        }
        this.stage = stage;
    }

    dirY(change, angle) {
        if (change) { this.ydir *= -1; }
        if (angle) { this.angle = angle < 30 ? 30 : angle; }
        this.pos.y += this.ydir * this.speed * Math.sin(this.angle * Math.PI / 180);
    }

    dirX(change) {
        if (change) { this.xdir *= -1; }
        this.pos.x += this.xdir * this.speed * Math.cos(this.angle * Math.PI / 180);
    }

    move(yellow, red) {
        const yellowShip = { min: yellow.x - 60, max: yellow.x + 60, top: this.stage.height - 40 };
        const redShip = { min: red.x - 60, max: red.x + 60, bottom: 40 };
        this.dirX(false);
        if ((this.xdir > 0 && this.pos.x + this.size > this.stage.width) ||
            (this.xdir < 0 && this.pos.x - this.size < 0)) {
            this.dirX(true);
        }
        this.dirY(false);
        if (this.ydir > 0) {
            if (this.pos.y + this.size >= yellowShip.top && this.pos.y - this.size < yellowShip.top && this.pos.x > yellowShip.min && this.pos.x < yellowShip.max) {
                this.dirY(true, 90 - Math.abs(this.pos.x - yellow.x));
                this.xdir = this.pos.x > yellow.x ? 1 : -1;
                this.speed += .1;
            } else if (this.pos.y - this.size * 4 >= this.stage.height) {
                this.dirY(true);
                if (yellow.id) {
                    red.score = red.score + 1;
                    this.size++;
                }
            }
        } else if (this.ydir < 0) {
            if (this.pos.y - this.size <= redShip.bottom && this.pos.y + this.size > redShip.bottom && this.pos.x > redShip.min && this.pos.x < redShip.max) {
                this.dirY(true, 90 - Math.abs(this.pos.x - yellow.x));
                this.xdir = this.pos.x > red.x ? 1 : -1;
                this.speed += .1;
            } else if (this.pos.y + this.size * 4 <= 0) {
                this.dirY(true);
                if (red.id) {
                    yellow.score = yellow.score + 1;
                    this.size++;
                }
            }
        }
        return {
            ball: {
                x: this.pos.x,
                y: this.pos.y,
                size: this.size
            },
            players: {
                yellow: { x: yellow.x, score: yellow.score },
                red: { x: red.x, score: red.score },
            }
        }
    }
}
