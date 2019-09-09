
class Ball {
    constructor(gameboard, i) {
        $("#gameboard").append('<div id="ball' + i + '" class="ball"><div id="word' + i + '" class="word">Item ' + i + '</div></div>');
        this.dragBall = $("#ball" + i);
        this.dragWord = $("#word" + i);
        this.active = false;
        this.posX;
        this.posY;
        this.currentX;
        this.currentY;
        this.initialX;
        this.initialY;
        this.frame;
        this.frameId;
    }

    putInFrame(frame, frameId, updatePos) {
        frame.ball = this;
        this.frame = frame;
        this.frameId = frameId;
        if (updatePos) {
            this.posX = frame.div.position().left;
            this.posY = frame.div.position().top -7;
            this.updatePos(frame.div.position().left, frame.div.position().top -7);
        }
    }

    updatePos(xPos, yPos) {
        this.dragBall.css({ left: xPos + 'px' });
        this.dragBall.css({ top: yPos + 'px' });
    }
}

class BallFrame {
    constructor(gameboard, i) {
        $("#gameboard").append('<div id="ballframe' + i + '" class="ballframe">BallFrame' + i + '</div>');
        $("#ballframe" + i).css("background-color", "yellow");
        this.div = $("#ballframe" + i);
        this.ball = null;
    }

    updatePos(xPos, yPos) {
        this.div.css("position", "absolute");
        this.div.css({ left: xPos + 'px' });
        this.div.css({ top: yPos + 'px' });
        this.div.css({ width: 100 + 'px', height: 86 + 'px' });
        this.div.css("background-color", "red");
    }
}

class Gameboard {
    constructor() {
        this.gameboard = $("#gameboard");
        this.numberOfBallFrame = 0;
        this.ballFrames = [];
        this.numberOfBall = 0;
        this.balls = [];
        this.ondrag = false;
    }

    addEvent() {
        this.gameboard.on("touchstart", this.dragStart);
        this.gameboard.on("touchmove", this.drag);
        this.gameboard.on("touchend", this.dragEnd);

        this.gameboard.on("mousedown", this.dragStart);
        this.gameboard.on("mousemove", this.drag);
        this.gameboard.on("mouseup", this.dragEnd);
    }

    dragStart(e) {
        if (!(gameboard.ondrag)) {
            for (let i = 0; i < gameboard.numberOfBall; i++) {
                let cX, cY;
                cX = (e.type === "touchstart") ? e.touches[0].clientX : e.clientX;
                cY = (e.type === "touchstart") ? e.touches[0].clientY : e.clientY;
                gameboard.balls[i].initialX = cX;
                gameboard.balls[i].initialY = cY;
                if (e.target === gameboard.balls[i].dragBall[0] || e.target === gameboard.balls[i].dragWord[0]) {
                    gameboard.balls[i].active = true;
                    return;
                }
            }
        }
        gameboard.ondrag = true;
    }

    drag(e) {
        for (let i = 0; i < gameboard.numberOfBall; i++) {
            if (gameboard.balls[i].active) {
                e.preventDefault();
                let ball = gameboard.balls[i];
                let cX, cY;

                cX = (e.type === "touchmove") ? e.touches[0].clientX : e.clientX;
                cY = (e.type === "touchmove") ? e.touches[0].clientY : e.clientY;
                // delta from initial
                ball.currentX = cX - ball.initialX;
                ball.currentY = cY - ball.initialY;

                gameboard.balls[i].xOffset = gameboard.balls[i].currentX;
                gameboard.balls[i].yOffset = gameboard.balls[i].currentY;
                gameboard.balls[i].updatePos(gameboard.balls[i].posX + gameboard.balls[i].currentX
                    , gameboard.balls[i].posY + gameboard.balls[i].currentY);

                // check in frame
                let iF = ball.frameId;
                let cF;
                for (let f = 0; f < gameboard.numberOfBallFrame; f++) {
                    // need to change 100 to frame width and frame height
                    if (cX > gameboard.ballFrames[f].div.position().left && cX < gameboard.ballFrames[f].div.position().left + 100
                        && cY > gameboard.ballFrames[f].div.position().top && cY < gameboard.ballFrames[f].div.position().top + 86) {
                        cF = f;
                        //                        console.log(`from frame ${cF} to frame ${iF}`);
                        if (iF != cF) {
                            // change layout only
                            gameboard.moveball(cF, iF);
                            // swap ball-frame index
                            let b = 0;
                            let orgBall = gameboard.ballFrames[iF].ball;
                            let trgBall = gameboard.ballFrames[cF].ball;
                            orgBall.putInFrame(gameboard.ballFrames[cF], cF, false);
                            trgBall.putInFrame(gameboard.ballFrames[iF], iF, false);
                        }
                    }

                }
            }
        }
    }

    dragEnd(e) {
        for (let i = 0; i < gameboard.numberOfBall; i++) {
            gameboard.balls[i].posX = gameboard.balls[i].frame.div.position().left;
            gameboard.balls[i].posY = gameboard.balls[i].frame.div.position().top;
            gameboard.balls[i].initialX = gameboard.balls[i].frame.div.position().left;
            gameboard.balls[i].initialY = gameboard.balls[i].frame.div.position().top;
            gameboard.balls[i].currentX = gameboard.balls[i].frame.div.position().left;
            gameboard.balls[i].currentY = gameboard.balls[i].frame.div.position().top;
            gameboard.balls[i].active = false;
            gameboard.balls[i].putInFrame(gameboard.balls[i].frame, gameboard.balls[i].frameId, true);
        }
        gameboard.ondrag = false;
    }

    createball(numberOfBall) {
        this.numberOfBall = numberOfBall;
        for (let i = 0; i < numberOfBall; i++) {
            this.balls[i] = new Ball(gameboard, i);
        }
    }

    moveball(from, to) {
        this.ballFrames[from].ball.dragBall.animate(
            {
                left: this.ballFrames[to].div.position().left + 'px',
                top: this.ballFrames[to].div.position().top -7 + 'px'
            },
            200
        );
    }

    createballFrame(numberOfBallFrame) {
        this.numberOfBallFrame = numberOfBallFrame;
        for (let i = 0; i < numberOfBallFrame; i++) {
            gameboard.ballFrames[i] = new BallFrame(gameboard, i);
        }
    }
}

function init() {
    let numberOfBallFrame = 10;
    let numberOfBall = 10;
    gameboard = new Gameboard();

    gameboard.createballFrame(numberOfBall);
    gameboard.createball(numberOfBall);
    gameboard.addEvent();

    let framePos = [
        { xPos: 200, yPos: 100 },
        { xPos: 150, yPos: 187 },
        { xPos: 250, yPos: 187 },
        { xPos: 100, yPos: 273 },
        { xPos: 200, yPos: 273 },
        { xPos: 300, yPos: 273 },
        { xPos:  50, yPos: 360 },
        { xPos: 150, yPos: 360 },
        { xPos: 250, yPos: 360 },
        { xPos: 350, yPos: 360 }
    ];

    for (let i = 0; i < numberOfBallFrame; i++) {
        gameboard.ballFrames[i].updatePos(framePos[i].xPos, framePos[i].yPos);
        gameboard.balls[i].putInFrame(gameboard.ballFrames[i], i, true);
    }

}
