import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js/dist/pixi.js';
import {Key} from "./key";
import {Keyboard} from "./keyboard";

@Component({
  selector: 'app-box-and-weave',
  templateUrl: './box-and-weave.component.html',
  styleUrls: ['./box-and-weave.component.css']
})
export class BoxAndWeaveComponent implements OnInit {

  private STATE = this.play ;
  display = "none";
  app: PIXI.Application;
  player: PIXI.Sprite;
  isJumping = false;
  keyObject = new Keyboard();
  @ViewChild("container") container: ElementRef;
  viewLoading = true;


  left = this.keyObject.newKeyEvent(37);
  up = this.keyObject.newKeyEvent(38);
  right = this.keyObject.newKeyEvent(39);
  down = this.keyObject.newKeyEvent(40);
  space = this.keyObject.newKeyEvent(32);

  movementVelocity = 10;
  fallVelocity = 10;
  jumpHeight;
  playerJumpStart;
  playerJumpEnd;

  platforms: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();



  constructor() { }

  onViewReady(){
    this.viewLoading = false;
    this.display = "block";
  }

  ngOnInit() {
    console.log(PIXI);
    this.initApp();
    this.createPlayer();
    this.addRectangle(300, -150, 10);
    this.addRectangle(0, -300, 200);
    this.addRectangle(-400, -200, 100);
    this.addRectangle(-200, -100, 50);
    this.initKeyboardListeners();
    this.onViewReady();
    console.log(this.player, this.platforms[0]);

  }

  initApp(){
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {
      backgroundColor: 0xcccccc,
      transparent: true
    });

    this.container.nativeElement.appendChild(this.app.view);
    window.addEventListener("resize", () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }

  gameLoop(delta) {

    this.STATE(delta);
  }

  play(state?){
    if(this.isJumping) {
      if(this.player.y == this.playerJumpEnd) {
        this.player.vy = this.fallVelocity;
      } else if (this.player.y == this.playerJumpStart) {
        this.isJumping = false;
        this.player.vy = 0;
      }
    }
    let collisions: Map<string, any> = new Map();
    this.platforms.map((platform)=>{
     this.isColliding(this.player, platform, collisions);
    });

    if(collisions.size != 0){
      this.handleCollisions(collisions);
    } else {
      //console.log(this.player.y < this.playerJumpEnd);
      this.player.y += this.player.vy;
      this.player.x += this.player.vx;
      //this.player.y += this.player.vy
    }
  }

  handleCollisions(collisions){
    collisions.forEach((collision => {
      switch(collision.axis){
        case "left":
          if((this.isJumping && !collisions.has('down')) || collisions.has('down') || collisions.has('top')){
            this.player.y += this.player.vy;
          }
          if(this.left.isUp){
            this.player.x += this.player.vx;
          }
          break;
        case "right":
          if((this.isJumping && !collisions.has('down')) || collisions.has('down') || collisions.has('top')){
            this.player.y += this.player.vy;
          }
          if(this.right.isUp){
            this.player.x += this.player.vx;
          }
          break;
        case "top":
          if(collisions.has('left') || collisions.has('right')){
            this.player.x += this.player.vx;
          }

          if(this.isJumping){
            this.playerJumpEnd = collision.position;
            this.player.vy = this.fallVelocity;
            this.player.y += this.player.vy;
          }
          break;
        case "bottom":
          if(collisions.has('left') && (collision.object == collisions.get('left').object) && collisions.has('right') && (collision.object == collision.get('right').object)){
            console.log(collisions, this.playerJumpEnd, this.playerJumpStart);
          }
          //if(collisions.has('left') || collisions.has('right')){
            this.player.x += this.player.vx;
          //}
          console.log(this.player.vy, this.fallVelocity);
          if(this.isJumping && this.player.vy > -1){
            this.player.y = collision.position;
            this.player.vy = 0;
          }
          break;
      }
    }));
  }

  createPlayer(){
    this.player = PIXI.Sprite.fromImage('/assets/img/square.png');

    this.player.anchor.set(0.5);
    this.player.scale.set(0.3);
    this.player.x = this.app.screen.width / 2;
    this.player.y = this.app.screen.height / 2;
    this.player.vx = 0;
    this.player.vy = 0;
    this.jumpHeight = 300;

    this.player.interactive = true;

    this.player.buttonMode = false;

// Pointers normalize touch and mouse
    this.player.on('pointerdown', this.onClick);


// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only

    this.app.stage.addChild(this.player);
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  addRectangle(x,y, size){
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, size, size);
    rectangle.endFill();
    rectangle.x = this.app.screen.width/2 + x;
    rectangle.y = this.app.screen.height/2 + y ;
    this.platforms.push(rectangle);
    this.app.stage.addChild(rectangle);


  }

  onClick(e?) {
      console.log(e);
  }

  initKeyboardListeners(){

    this.left.press = () => {
      //Change the cat's velocity when the key is pressed
      this.player.vx = -this.movementVelocity;
      //this.player.vy = 0;
    };
    this.left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the cat isn't moving vertically:
      //Stop the cat
        if(this.right.isUp){
          this.player.vx = 0;
        }

    };
    /*this.up.press = () => {
      this.player.vy = -this.movementVelocity;
      this.player.vx = 0;
    };
    this.up.release = () => {
      if (!this.down.isDown && this.player.vx === 0) {
        this.player.vy = 0;
      }
    };*/
    this.right.press = () => {
      this.player.vx = this.movementVelocity;
      //this.player.vy = 0;
    };
    this.right.release = () => {
      if(this.left.isUp){
        this.player.vx = 0;
      }
    };
    /*this.down.press = () => {
      this.player.vy = this.movementVelocity;
      this.player.vx = 0;
    };
    this.down.release = () => {
      if (!this.up.isDown && this.player.vx === 0) {
        this.player.vy = 0;
      }
    };*/

    this.space.press = () => {
      this.jump();
    }
    ;
    this.space.release = () => {
    };
  }


  isColliding(r1, r2, collisions) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    const r1x = r1.x - r1.width / 2;
    const r1y = r1.y - r1.height / 2;
    const r2x = r2.x - r2.width / 2;
    const r2y = r2.y - r2.height / 2 ;
    //console.log(r1x, r2x);

    const xLeft = r1x >= r2x;
    const xRight = r1x <= (r2x + r2.width);
    const xwLeft = (r1x + r1.width) >= r2x;
    const xwRight = (r1x + r1.width) <= (r2x + r2.width);
    const bothXInside = ((xLeft && xRight) && (xwLeft && xwRight));
    const bothXOutside = (!xLeft && !xwRight);
    const onlyXInside = ((xLeft && xRight) && !xwRight);
    const onlyXWInside = ((xwLeft && xwRight) && !xLeft);

    const yUp = (r1y >= r2y);
    const yDown = (r1y <= r2y + r2.height);
    const ywUp = (r1y + r1.height) >= r2y;
    const ywDown = (r1y + r1.height) <= (r2y + r2.height);
    const bothYInside = (yUp && ywDown);
    const bothYOutside = (!yUp && !ywDown);
    const onlyYInside = ((yUp && yDown) && !ywDown);
    const onlyYWInside = ((ywUp && ywDown) && !yUp);

    const dx = (onlyXInside || onlyXWInside) || (bothXInside || bothXOutside);
    const dy = (onlyYInside || onlyYWInside) || (bothYInside || bothYOutside);

    //;

    //is player x gte than r2
    //console.log(r1x, r2x);
    const left = (r1x <= (r2x + r2.width)) && (r1x >= r2x) && dy;
    const right = ((r1x  + r1.width) >= r2x) && (r1x <= r2x) && dy;


    const top = yDown && yUp && dx;
    const bottom = ywUp && ywDown && dx;
    //hit will determine whether there's a collision


    //console.log(dx, dy, left, right, top, bottom);
      if (bottom) {
        collisions.set('bottom',{axis: "bottom", position: r1.y, object: r2});
      }
      if (top) {
        collisions.set('top', {axis: "top", position: r1.y, object: r2});
      }

      if (left && !bottom) {
        collisions.set('left', {axis: "left", position: r1.x, object: r2});
      }
      if (right && !bottom) {
        collisions.set('right', {axis: "right", position: r1.x, object: r2});
      }
      return collisions;
  };

  jump(){
    if(!this.isJumping){
      this.isJumping = true;
      this.player.vy = -this.fallVelocity;
      this.playerJumpStart = this.player.y;
      this.playerJumpEnd = this.player.y - this.jumpHeight;
      this.player.y += this.player.vy;
      console.log(this.player.vy, this.fallVelocity);
    }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
