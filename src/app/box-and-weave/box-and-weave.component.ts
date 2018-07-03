import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js/dist/pixi.js';
import * as Intersects from 'intersects';
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
  floor;

  uL; uR; bL; bR;

  left = this.keyObject.newKeyEvent(37);
  up = this.keyObject.newKeyEvent(38);
  right = this.keyObject.newKeyEvent(39);
  down = this.keyObject.newKeyEvent(40);
  space = this.keyObject.newKeyEvent(32);

  movementVelocity = 5;
  maxVelocity = 12.5;
  minVelocity = 0;
  acceleration = 0.5;
  fallVelocity = 10;
  fallAcceleration = 0.7;
  jumpHeight;
  playerJumpStart;
  playerJumpEnd;

  platforms: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();



  constructor() { }

  onViewReady(){
    console.log(Intersects);
    this.viewLoading = false;
    this.display = "block";
  }

  ngOnInit() {
    this.initApp();
    //this.addRectangle(300, 250, 10);
    const plat1 = this.addRectangle(0, 300, 150);
    this.platforms.push(plat1);
    const plat2 = this.addRectangle(-450, 150, 150);
    this.platforms.push(plat2);
    this.createPlayer();
    //this.addRectangle(-400, 200, 100);
    this.uL = this.addRectangle(0, 0, 10, '0xadf442');
    this.uR = this.addRectangle(0, 0, 10, '0xef3bec');
    this.bL = this.addRectangle(0, 0, 10, '0x57ef1b');
    this.bR = this.addRectangle(0, 0, 10, '0xef3bec');
    this.initKeyboardListeners();
    this.onViewReady();
    console.log(this.player, this.platforms[0]);

  }

  initApp(){
    this.app = new PIXI.Application(window.innerWidth - 50, window.innerHeight - 50, {
      backgroundColor: 0xcccccc,
      transparent: true
    });

    this.container.nativeElement.appendChild(this.app.view);
    window.addEventListener("resize", (e) => {
      this.app.renderer.resize(window.innerWidth - 50, window.innerHeight- 50);
      this.floor= this.app.screen.height + this.player.height;
    });
  }

  gameLoop(delta) {
    this.STATE(delta);
  }

  play(state?){
    if(this.isJumping) {
      //console.log(this.player.y, this.playerJumpEnd, this.player.collidingY);
      if(this.player.y <= this.playerJumpEnd) {
        this.player.vy = this.fallVelocity;
        this.player.ay = this.fallAcceleration;
      } else if (this.player.collidingY && this.player.y >= this.playerJumpStart) {
        //this.playerJumpStart = 0;
        this.isJumping = false;
        this.playerJumpEnd = 0;
        this.player.collidingY = false;
        //this.player.vy = 0;
      };
    }


    this.platforms.map((platform)=>{
     this.handleCollision(this.player, platform);
    });
    this.moveXIfInBounds();
    this.moveYIfInBounds();
    //this.handleCollision(collisions);

  }

  resetVelocity(){
    if(!this.isJumping){
      this.player.vy = this.fallVelocity;
    }
  }

  moveYIfInBounds(){
    if(this.player.y < this.floor){
      this.player.y += this.player.vy;
      this.player.vy += this.player.ay;
    } else if(!this.isJumping) {
      //this.player.ay = 0;
      this.player.collidingY = true;
    }
    this.resetVelocity();
  }

  moveXIfInBounds() {
    const isLeftWall = this.player.x - this.player.width > 0;
    const isRightWall = this.player.x + this.player.width < this.app.screen.width;

    if((isLeftWall) && (isRightWall)){
      this.player.x += this.player.vx;
    } else if((!isLeftWall && this.left.isUp)){
      this.player.x += this.player.vx;
    } else if((!isRightWall && this.right.isUp)) {
      this.player.x += this.player.vx;
    }
    this.updateVelocity();
  }

  updateVelocity(){
    const oldVelocity = this.player.vx;
    let currentVelocity;
    if(this.player.ax != 0){
      currentVelocity =  (oldVelocity < 0) ? Math.max(oldVelocity + this.player.ax, this.maxVelocity * -1) : Math.min(oldVelocity + this.player.ax, this.maxVelocity);
      //console.log(oldVelocity, currentVelocity, this.player.ax);
    } else {
        currentVelocity = (oldVelocity < 0) ? Math.min(oldVelocity + (this.acceleration*2), this.minVelocity) : Math.max(oldVelocity - (this.acceleration*2), this.minVelocity);
      //console.log(currentVelocity);

    }
    this.player.vx = (oldVelocity + currentVelocity) / 2;
  }

  boxesIntersect(a, b) {
    const ab = a.getBounds();
    const bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  }
  createPlayer(){
    this.player = new PIXI.Graphics();//PIXI.Sprite.fromImage('/assets/img/square.png');
    //this.player.texture.baseTexture.on('loaded', ()=>{this.floor = this.app.screen.height - this.player.height/2});
    //this.player.anchor.set(0.5);
    this.player.beginFill("0xea665a");
    this.player.drawRect(0, 0, 100, 100);
    this.player.endFill();
    //this.player.scale.set(0.3);
    this.player.x = this.app.screen.width / 2;
    this.player.y = this.app.screen.height / 2;
    this.player.ax = 0;
    this.player.vx = 0;
    this.player.vy = this.fallVelocity;
    this.player.ay = this.fallAcceleration;
    this.jumpHeight = 300;
    this.player.collidingY = false;
    this.player.vy = this.fallVelocity;
    this.player.interactive = true;
    this.floor = this.app.screen.height - this.player.height
    this.player.buttonMode = false;

// Pointers normalize touch and mouse
    this.player.on('pointerdown', this.onClick);


// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only

    this.app.stage.addChild(this.player);
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  addRectangle(x,y, size?, color = '0x66CCFF'){
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(color);
    rectangle.drawRect(0, 0, size, size);
    rectangle.endFill();
    rectangle.x = this.app.screen.width/2 + x;
    rectangle.y = this.app.screen.height/2 + y ;
    this.app.stage.addChild(rectangle);
    return rectangle;

  }

  onClick(e?) {
      console.log(e);
  }

  initKeyboardListeners(){

    this.left.press = () => {
      //Change the cat's velocity when the key is pressed
      this.player.vx = -this.movementVelocity;
      this.player.ax = -this.acceleration;
      //this.player.vy = 0;
    };
    this.left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the cat isn't moving vertically:
      //Stop the cat
        if(this.right.isUp){
          //this.player.vx = 0;
          this.player.ax = 0;
        }

    };
    this.up.press = () => {
      console.log(this.player.vx, this.player.ax);
    };
    this.up.release = () => {

    };
    this.right.press = () => {
      this.player.vx = this.movementVelocity;
      this.player.ax = this.acceleration;
      //this.player.vy = 0;
    };
    this.right.release = () => {
      if(this.left.isUp){
        //this.player.vx = 0;
        this.player.ax = 0;
      }
    };
    this.down.press = () => {
      console.log(this.player.vy, this.player.ay);
    };
    this.down.release = () => {
      if (!this.up.isDown && this.player.vx === 0) {
      }
    };

    this.space.press = () => {
      console.log(this.player.vy, this.player.collidingY, this.isJumping);
      this.jump();
    }
    ;
    this.space.release = () => {
    };
  }

  handleCollision(r1, r2) {

    //Define the variables we'll need to calculate
    const r1x = r1.x;// -  r1.width / 2;
    const r1y = r1.y;// - r1.height / 2;
    const r2x = r2.x;
    const r2y = r2.y;


    if (r1x + r1.width + r1.vx > r2x &&
      r1x + r1.vx < r2x + r2.width &&
      r1y + r1.height > r2y &&
      r1y < r2y + r2.height) {
    //Right hit
      //console.log(r1y + r1.height, r2y);
      this.uL.x = r1x + r1.width/4;
      this.uL.y = r1y + r1.height - this.uL.height;
      this.uR.x = r1x + r1.width/2;
      this.uR.y = r2.y - this.uR.height;
      if (Math.abs(r1x + r1.width + r1.vx - r2x) < Math.abs(r1x + r1.vx - r2x)) {
        const collDiff = (r1x + r1.width + this.player.vx) - (r2x);
        if(Math.abs(collDiff) < Math.abs(this.player.vx)) {
          r1.vx = this.player.vx - collDiff ;
        } else {
          r1.vx = 0;
          r1.ax = 0;
        }
    //LEft hit
      } else {
        const collDiff = (r2x + r2.width) - (r1x + this.player.vx);
        if(Math.abs(collDiff) < Math.abs(this.player.vx)) {
          r1.vx = this.player.vx + collDiff;
        } else {
          r1.vx = 0;
          r1.ax = 0;
        }
      }
    }

    //check Y movement bounce
    if (r1x + r1.width> r2x && r1x< r2x + r2.width &&
      r1y + r1.height + r1.vy > r2y &&
      r1y + r1.vy < r2y + r2.height) {
    //Top hit
      if(Math.abs(r1y + r1.vy - r2y) < Math.abs(r1y + r1.vy + r1.height - r2y)){
        if(this.isJumping){
/*          const collDiff = (r2y + r2.height) - (r1y + this.player.vy);
          if(Math.abs(collDiff) < this.fallVelocity - 1) {
            r1.vy = this.player.vy + collDiff - 1;
          } else {
          }*/
          r1.vy = -this.fallVelocity;
          this.player.ay = -this.fallAcceleration;
          this.playerJumpEnd = r1y + r1.height;

        } else {
          //r1.vy = 0;
        }
    // Bottom hit
      } else {
        if(this.isJumping && r1.vy < 0){
        } else {
          r1.vy = 0;
          r1.ay = 0;
          //console.log('collide bottom');
          this.player.collidingY = true;

          /*const collDiff = (r1y + r1.height + this.player.vy) - r2y;
          if(Math.abs(collDiff) < this.fallVelocity) {
            r1.vy = this.player.vy - Math.ceil(collDiff) -this.player.ay;
            console.log(collDiff, this.fallVelocity, r1.vy);
            //console.log(r1.vy, collDiff);
          } else {

          }*/

        }
      }
    }
  };

  jump(){
    if(!this.isJumping && this.player.collidingY){
      this.isJumping = true;
      this.player.vy = -this.fallVelocity;
      this.player.collidingY = false;
      this.player.ay = -this.fallAcceleration;
      this.playerJumpStart = this.player.y;
      this.playerJumpEnd = this.player.y - this.jumpHeight;
      this.player.y += this.player.vy;
    }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
