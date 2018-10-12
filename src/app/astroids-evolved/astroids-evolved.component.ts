import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js/dist/pixi.js';
import * as Intersects from 'intersects';
import {Keyboard} from "./player/keyboard";
import {Player} from './player/player';
import {Bullet} from './player/bullet';
import {Bomb} from './player/bomb';

declare var PIXI;


@Component({
  selector: 'app-astroids-evolved',
  templateUrl: './astroids-evolved.component.html',
  styleUrls: ['./astroids-evolved.component.scss']
})
export class AstroidsEvolvedComponent implements OnInit {


  private STATE = this.play;
  playerId: string = "Jimmie";
  players: Map<String, Player> = new Map();
  app: PIXI.Application;
  @ViewChild('container') container: ElementRef;
  viewLoading = true;
  score = 0;
  highscore = 0;
  difficultyModifier = 1;
  scoreText: PIXI.Text;
  highscoreText: PIXI.Text;
  asteroidsDestroyed = 0;
  baseSpawnTime = 250;
  spawnTime = 2000;
  private movementVelocity = 15;
  private maxVelocity = 12.5;
  private minVelocity = 0;
  private acceleration = 0.5;
  private isHost: boolean = true;

  constructor() {
  }

  ngOnInit() {
    this.initApp();
    this.app.stage.interactive = true;
    this.initPlayers();
    this.initAnimations();
    this.scoreText = this.createScoreText();
    this.app.ticker.add(delta => this.gameLoop(delta));
    this.viewLoading = false;
    if(this.isHost) {
      setTimeout(()=>{this.spawnAsteroid()}, this.baseSpawnTime);
    }
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

  initPlayers(){
    const player = new Player(this.playerId, this.movementVelocity, this.acceleration, true);
    const spawn = {
      x: this.app.screen.width/2,
      y: this.app.screen.height/2
    };
    this.addToScene(player.createPlayerGraphic(spawn));
    this.addToScene(player.bomb);
    this.players.set(player.id, player);
  }

  addToScene(object){
    this.app.stage.addChild(object);
  }

  getPlayer(){
    return this.players.get(this.playerId);
  }

  gameLoop(delta) {
    this.STATE(delta);
  }


  removeObjectFromStage(object, array){
    object.clear();
    this.app.stage.removeChild(object);
    array.splice(array.indexOf(object), 1);
  }

  initAnimations(){
    let count = 0;
    this.app.ticker.add(delta => {
      count += 0.2;
      this.players.forEach(
        player => {
          player.animatePlayer(count);
        });
    });
    this.bullets.forEach(
      bullet => {
        bullet.count += 0.004;
        const change = 1*(Math.sin(bullet.count*100) + 2);
        Bullet.animateBullet(bullet, change);
      })
  }

  play(state?) {
    const pos = this.app.renderer.plugins.interaction.mouse.global;
    this.getPlayer().rotation = this.rotateToPoint(pos.x, pos.y, this.getPlayer().x, this.getPlayer().y);

    this.players.forEach(
      player => {
        if(!!player.isBombActive){
          this.redrawBomb(player);
        }
      });


    this.bullets.forEach(bullet => {
      bullet.x += Math.cos(bullet.rotation)*bullet.velocity;
      bullet.y += Math.sin(bullet.rotation)*bullet.velocity;
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
      this.players.forEach(
        player => {
          if(player.isBombActive && this.checkForCircleCollision(player.bomb, asteroid)){
            this.removeObjectFromStage(asteroid, this.asteroids);
            this.score++;
            this.asteroidsDestroyed++;
            return;
          }
          if(player.isAlive && this.checkForCollision(player, asteroid)){
            //this.app.stage.removeChild(this.player);
            this.onPlayerDeath(player);
          }
        });
    });

    this.players.forEach(
      player => {
        if(this.isInBoundsX(player)){
          player.x += player.vx;
          if(!player.isBombActive) player.bomb.x += player.vx;
        }
        if(this.isInBoundsY(player)){
          player.y += player.vy;
          if(!player.isBombActive) player.bomb.y += player.vy;
        }
      });

    this.updateScore();
  }

  removeAllBullets(player){
    this.bullets.filter(
      bullet => bullet.playerId == player.id)
      .forEach(
      bullet => this.removeObjectFromStage(bullet, this.bullets)
    );
  }

  onPlayerDeath(player){
    if(player.id == this.getPlayer().id) {
      this.updateHighscore();
    }
    this.setPlayerAlive(player,false, 0.2);
    this.removeAllBullets(player);
    setTimeout(()=>{this.setPlayerAlive(player,true, 1)}, 3000);
  }

  setPlayerAlive(player, isAlive, opacity) {
    player.isAlive = isAlive;
    player.opacity = opacity;
    player.bomb.opacity = opacity;
  }

  updateHighscore(){

    if(!this.highscoreText){
      this.highscoreText = this.createHighscoreText(this.score);
      this.highscore = this.score;
    } else {
      if(this.score > this.highscore) {
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


  onStageClick(event){
    if(!this.getPlayer().isAlive) return;
    this.shoot(this.getPlayer(), {
      x: this.getPlayer().x,
      y: this.getPlayer().y
    });
  }


  private bullets: Array<any> = new Array();
  private bulletSpeed = 20;

  shoot(player, startPosition){
    if(this.bullets.length > 5) return;
    let bullet = this.createBullet(player, startPosition);
    this.app.stage.addChild(bullet);
    this.bullets.push(bullet);
  }

  createBullet(player, position){
    return Bullet.create(player, position, player.color , this.bulletSpeed)
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
    asteroid.rotation = Math.atan2( this.getPlayer().y - asteroid.y, this.getPlayer().x - asteroid.x) + (Math.random() * (Math.PI*2)/3) - (Math.PI*2)/3;
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

  redrawBomb(player){
    if(player.bomb.radius > 200) {
      player.bomb.clear();
      this.app.stage.removeChild(player.bomb);
      player.isBombActive = false;
      setTimeout(()=>{
        player.createBomb();
        player.isBombAvailable = true;
      }, 5000);
      return;
    }
    player.bomb.radius += 3;
    player.bomb.clear();
    player.bomb.lineStyle(2, 0xff0f22, 1);
    player.bomb.beginFill(player.color, 0.1);
    player.bomb.drawCircle(0, 0, player.bomb.radius);
    player.bomb.endFill();
  }
}
