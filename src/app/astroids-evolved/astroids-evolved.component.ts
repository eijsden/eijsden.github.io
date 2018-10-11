import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js/dist/pixi.js';
import * as Intersects from 'intersects';
import {Keyboard} from "./keyboard";

declare var PIXI;


@Component({
  selector: 'app-astroids-evolved',
  templateUrl: './astroids-evolved.component.html',
  styleUrls: ['./astroids-evolved.component.scss']
})
export class AstroidsEvolvedComponent implements OnInit {


  private STATE = this.play;
  app: PIXI.Application;
  player: PIXI.Sprite;
  keyObject = new Keyboard();
  @ViewChild("container") container: ElementRef;
  viewLoading = true;
  score = 0;
  highscore = 0;
  difficultyModifier = 1;
  scoreText: PIXI.Text;
  highscoreText: PIXI.Text;
  asteroidsDestroyed = 0;
  left = this.keyObject.newKeyEvent(65);
  up = this.keyObject.newKeyEvent(87);
  right = this.keyObject.newKeyEvent(68);
  down = this.keyObject.newKeyEvent(83);
  space = this.keyObject.newKeyEvent(32);
  baseSpawnTime = 250;
  spawnTime = 2000;
  movementVelocity = 15;
  maxVelocity = 12.5;
  minVelocity = 0;
  acceleration = 0.5;

  constructor() { }

  ngOnInit() {
    this.initApp();
    this.createPlayer();
    this.initKeyboardListeners();
    this.viewLoading = false;
    this.animateBullets();
    this.scoreText = this.createScoreText();
    setTimeout(()=>{this.spawnAsteroid()}, this.baseSpawnTime);
    this.updateScore(300)
  }

  initApp(){
    this.app = new PIXI.Application(window.innerWidth - 100, window.innerHeight - 100, {
      backgroundColor: 0x000000,
      antialias: true,
      anchor: 0.5
    });

    this.container.nativeElement.appendChild(this.app.view);
    window.addEventListener("resize", (e) => {
      this.app.renderer.resize(window.innerWidth - 100, window.innerHeight- 100);
    });
  }

  gameLoop(delta) {
    this.STATE(delta);
  }

  animateBullet(bullet, change){
    bullet.clear();
    bullet.radius = 5 * change;
    bullet.lineStyle(change);
    bullet.beginFill(0xFF000C, 1);
    bullet.drawCircle(0, 0, bullet.radius);
    bullet.endFill();
  }

  animateBullets(){
    this.app.ticker.add(delta => {
     this.bullets.forEach(
       bullet => {
         bullet.count += 0.004;
         const change = 1*(Math.sin(bullet.count*100) + 2);
         this.animateBullet(bullet, change);
       });
    });
  }

  removeObjectFromStage(object, array){
    object.clear();
    this.app.stage.removeChild(object);
    array.splice(array.indexOf(object), 1);
  }



  play(state?) {
    const pos = this.app.renderer.plugins.interaction.mouse.global;

    this.player.rotation = this.rotateToPoint(pos.x, pos.y, this.player.x, this.player.y);

    if(!!this.player.isBombActive){
      this.redrawBomb();
    }

    this.bullets.forEach(bullet => {
      bullet.x += Math.cos(bullet.rotation)*this.bulletSpeed;
      bullet.y += Math.sin(bullet.rotation)*this.bulletSpeed;
      if(!this.isInBounds(bullet, bullet.radius)){
        this.removeObjectFromStage(bullet, this.bullets);
        return;
      }
    });

    this.asteroids.forEach(asteroid => {
      const newSpeed = this.difficultyModifier * (this.difficultyModifier/2);
      asteroid.x += Math.cos(asteroid.rotation)*(asteroid.velocity) + newSpeed;
      asteroid.y += Math.sin(asteroid.rotation)*(asteroid.velocity) + newSpeed;
      this.bullets.forEach(bullet => {
        if(this.checkForCircleCollision(bullet, asteroid)){
          this.score += Math.floor(asteroid.radius/10);
          this.removeObjectFromStage(asteroid, this.asteroids);
          this.removeObjectFromStage(bullet, this.bullets);
          this.asteroidsDestroyed++;
          return;
        }
      });
      if(this.player.isBombActive && this.checkForCircleCollision(this.player.bomb, asteroid)){
        this.removeObjectFromStage(asteroid, this.asteroids);
        this.score++;
        this.asteroidsDestroyed++;
        return;
      }
      if(this.player.isAlive && this.checkForCollision(this.player, asteroid)){
        //this.app.stage.removeChild(this.player);
        this.onPlayerDeath();
      }
      if(!this.isInBounds(asteroid, asteroid.radius)){
        //this.removeObjectFromStage(asteroid, this.asteroids);
      }
    });

    if(this.isInBoundsX(this.player)){
      this.player.x += this.player.vx;
      if(!this.player.isBombActive) this.player.bomb.x += this.player.vx;
    }
    if(this.isInBoundsY(this.player)){
      this.player.y += this.player.vy;
      if(!this.player.isBombActive) this.player.bomb.y += this.player.vy;
    }

    this.updateScore();
  }

  removeAllBullets(){
    this.bullets.forEach(
      bullet => this.removeObjectFromStage(bullet, this.bullets)
    );
  }

  onPlayerDeath(){
    this.updateHighscore();
    this.setPlayerAlive(false, 0.2);
    this.removeAllBullets();
    setTimeout(()=>{this.setPlayerAlive(true, 1)}, 3000);
  }

  setPlayerAlive(isAlive, opacity) {
    this.player.isAlive = isAlive;
    this.player.opacity = opacity;
  }

  updateHighscore(){

    if(!this.highscoreText){
      this.highscoreText = this.createHighscoreText(this.score);
      this.highscore = this.score;
    } else {
      if(this.score > this.highscore) {
        console.log(this.score, this.highscore);
        this.highscore = this.score;
        this.highscoreText.text = "Highscore: " + this.score;
      }
    }
    this.resetScore();
  }

  updateScore(score?){
    if(!!score) this.score = score;

    this.scoreText.text = "Score: " + this.score;
    this.difficultyModifier = 1 + this.score/100;
    this.spawnTime = this.baseSpawnTime/(this.difficultyModifier)
  }

  resetScore(){
    this.score = 0;
    this.difficultyModifier = 1 + this.score/100;
  }

  createScoreText(){
    const text = new PIXI.Text('Score: 0', {
      //fontWeight: 'bold',
      //fontStyle: 'italic',
      fontSize: 25,
      fontFamily: 'Impact',
      fill: '#000000',
      fillOpacity: 0,
      align: 'center',
      stroke: '#00d0ff',
      strokeThickness: 2
    });
    text.x = (this.app.screen.width / 2) - 100;
    text.y = 30;
    text.anchor.x = 0.5;
    this.app.stage.addChild(text);
    return text;
  }

  createHighscoreText(score){
    const text = new PIXI.Text('Highscore: ' + score, {
      //fontWeight: 'bold',
      //fontStyle: 'italic',
      fontSize: 25,
      fontFamily: 'Impact',
      fill: '#000000',
      fillOpacity: 0,
      align: 'center',
      stroke: '#00d0ff',
      strokeThickness: 2
    });
    text.x = (this.app.screen.width / 2) + 100;
    text.y = 30;
    text.anchor.x = 0.5;
    this.app.stage.addChild(text);
    return text;
  }

  createPlayer(){
    let player = new PIXI.Graphics();//PIXI.Sprite.fromImage('/assets/img/square.png');

    //player.texture.baseTexture.on('loaded', ()=>{this.floor = this.app.screen.height - player.height/2});
    player.opacity = 1;
    player.lineStyle(1, 0x5BFF2D, player.opacity);
    player.beginFill(0xFF700B, 0);
    player.drawRect(-15, -15, 30, 30);


    player.anchor = 0;
    //player.scale.set(0.3);
    player.x = this.app.screen.width / 2;
    player.y = this.app.screen.height / 2;
    player.ax = 0;
    player.vx = 0;
    player.ay = 0;
    player.vy = 0;
    player.isBombAvailable = true;
    player.isBombActive = false;
    player.isAlive = true;
    player.interactive = true;
    player.buttonMode = false;

    //player.anchor.set(0.5);
    // Pointers normalize touch and mouse


// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only

    this.app.stage.addChild(player);

    this.app.stage.interactive = true;
    this.player = player;
    this.app.ticker.add(delta => this.gameLoop(delta));
    this.createBomb();
    let count = 0;
    this.app.ticker.add(delta => {
      count += 0.2;
      player.clear();
      const change = 0.5*(Math.sin(count) + 0.5);
      if(player.isAlive){
        player.lineStyle(3 + change*3, 0x5BFF2D, player.opacity - change);
      } else {
        player.lineStyle(3, 0x5BFF2D, player.opacity);
      }
      player.beginFill(0xFF700B, 0);
      player.drawRect(-15, -15, 30, 30);
    });
  }

  onStageClick(event){
    if(!this.player.isAlive) return;
    this.shoot(this.player.rotation, {
      x: this.player.x,
      y: this.player.y
    });
  }


  private bullets = [];
  private bulletSpeed = 20;

  createBullet(rotation, startPosition, lineStyle = 0){
    const radius = 10;
    const bullet = new PIXI.Graphics();
    bullet.lineStyle(lineStyle);
    bullet.beginFill(0xff0f22, 0.5);
    bullet.drawCircle(0, 0, radius);
    bullet.endFill();
    bullet.x = startPosition.x;
    bullet.y = startPosition.y;
    bullet.vx = 0;
    bullet.vy = 0;
    bullet.radius = radius;
    bullet.rotation = rotation - Math.PI/2;
    bullet.count = 0;
    return bullet;
  }



  shoot(rotation, startPosition){
    if(this.bullets.length > 5) return;
    let bullet = this.createBullet(rotation, startPosition);
    this.app.stage.addChild(bullet);
    this.bullets.push(bullet);
  }

  rotateToPoint(mx, my, px, py){
    const self = this;
    const dist_Y = my - py;
    const dist_X = mx - px;
    const angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle + 1.5;
  }

  getRandomPositiveOrNegative(){
    return Math.random() < 0.5 ? -1 : 1;
  }

  private asteroids = [];
  private asteroidSpeed = 1;
  private asteroidVariation = 5;
  createAsteroid(x, y, lineStyle=0xFF8E00){
    const radius = 35 * (Math.random() + 0.3);
    const asteroid = new PIXI.Graphics();
    asteroid.lineStyle(2, lineStyle, 1);
    asteroid.beginFill(0xff0f22, 0);
    asteroid.drawCircle(0, 0, radius);
    asteroid.endFill();
    asteroid.vx = this.getRandomPositiveOrNegative();
    asteroid.vy = this.getRandomPositiveOrNegative();
    asteroid.x = this.getAsteroidX(asteroid.vx, asteroid.vy);
    asteroid.y = this.getAsteroidY(asteroid.vy, asteroid.vx);
    asteroid.radius = radius;
    asteroid.width = radius*2;
    asteroid.height = radius*2;
    asteroid.velocity = (Math.random() * this.asteroidVariation) + this.asteroidSpeed;
    asteroid.rotation = Math.atan2( this.player.y - asteroid.y, this.player.x - asteroid.x) + (Math.random() * (Math.PI*2)/3) - (Math.PI*2)/3;
    asteroid.count = 0;
    return asteroid;
  }



  spawnAsteroid(){
    const asteroid = this.createAsteroid(this.app.screen.width/2, this.app.screen.height/2);
    this.app.stage.addChild(asteroid);
    this.asteroids.push(asteroid);
    console.log(this.spawnTime, this.difficultyModifier);
    //setTimeout(()=>this.removeObjectFromStage(asteroid, this.asteroids), 15500);
    setTimeout(()=>this.spawnAsteroid(), this.spawnTime);
  }

  getAsteroidX(vx, vy){
    if(vy > 0){
      return Math.random() * this.app.screen.width;
    } else {
      return (vx > 0 ? -50 : this.app.screen.width + 50);
    }
  }
  getAsteroidY(vy, vx){
    if(vy > 0){
      return (vx > 0 ? -50 : this.app.screen.height + 50);
    } else {
      return Math.random() * this.app.screen.height;
    }
  }


  onClick(e?) {
    console.log(e);
  }

  isInBoundsX(object){
    return (this.app.screen.width > object.x + object.vx + object.width/2 && 0 < object.x + object.vx - object.width/2);
  }

  isInBoundsY(object){
    return (this.app.screen.height > object.y + object.vy + object.height/2 && 0 < object.y + object.vy - object.height/2);
  }

  isInBounds(object, radius){
    if(!!radius){
      object.width = radius*2;
      object.height = radius*2;
    }


    if(this.isInBoundsX(object) && this.isInBoundsY(object)){
      return true;
    }

    return false;

  }


  checkForCircleCollision(c1, c2){
    const dx = c1.x - c2.x,
      dy = c1.y - c2.y,
      distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < c1.radius + c2.radius) {
      return true;
    }
    return false;
  }

  checkForCollision(r1, r2){
    if((
        r1.x + r1.width > r2.x && r1.x < r2.x + r2.width &&
        r1.y + r1.height + r1.vy > r2.y &&
        r1.y + r1.vy < r2.y + r2.height
      ) && (
        r1.x + r1.width + r1.vx > r2.x &&
        r1.x + r1.vx < r2.x + r2.width &&
        r1.y + r1.height > r2.y &&
        r1.y < r2.y + r2.height
      )) {
        return true;
      }
      return false;

  }

  createBomb(){
    const bomb = new PIXI.Graphics();
    bomb.radius = this.player.width/2;
    bomb.lineStyle(2, 0xff0f22, 1);
    bomb.beginFill(0xff0f22, 0);
    bomb.drawCircle(0, 0, bomb.radius - 2);
    bomb.endFill();
    bomb.vx = 0;
    bomb.vy = 0;
    bomb.x = this.player.x;
    bomb.y = this.player.y;
    this.player.bomb = bomb;
    this.app.stage.addChild(bomb);
  }

  redrawBomb(){
    if(this.player.bomb.radius > 200) {
      this.player.bomb.clear();
      this.app.stage.removeChild(this.player.bomb);
      this.player.isBombActive = false;
      setTimeout(()=>{
        this.createBomb();
        this.player.isBombAvailable = true;
      }, 5000);
      return;
    }
    this.player.bomb.radius += 3;
    this.player.bomb.clear();
    this.player.bomb.lineStyle(2, 0xff0f22, 1);
    this.player.bomb.beginFill(0xff0f22, 0);
    this.player.bomb.drawCircle(0, 0, this.player.bomb.radius);
    this.player.bomb.endFill();
  }

  initKeyboardListeners(){

    this.left.press = () => {
      //Change the cat's velocity when the key is pressed
      this.player.vx = -this.movementVelocity;
      this.player.ax = -this.acceleration;
      //this.player.vy = 0;
    };
    this.left.release = () => {
      if(this.right.isUp){
        this.player.vx = 0;
        this.player.ax = 0;
      }
    };

    this.up.press = () => {
      this.player.vy = -this.movementVelocity;
      this.player.ay = -this.acceleration;
    };
    this.up.release = () => {
      if(this.down.isUp){
        this.player.vy = 0;
        this.player.ay = 0;
      }

    };

    this.right.press = () => {
      this.player.vx = this.movementVelocity;
      this.player.ax = this.acceleration;
      //this.player.vy = 0;
    };
    this.right.release = () => {
      if(this.left.isUp){
        this.player.vx = 0;
        this.player.ax = 0;
      }
    };

    this.down.press = () => {
      this.player.vy = this.movementVelocity;
      this.player.ay = this.acceleration;
    };
    this.down.release = () => {
      if(this.up.isUp){
        this.player.vy = 0;
        this.player.ay = 0;
      }
    };

    this.space.press = () => {
      if(!this.player.isBombAvailable || !this.player.isAlive) return;
      this.player.isBombAvailable = false;
      this.player.isBombActive = true;
    }
    ;
    this.space.release = () => {
    };
  }

}
