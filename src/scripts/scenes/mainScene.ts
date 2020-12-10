import DebugText from '../objects/debugText'
import PlayerMechBody from '../objects/playerMechBody'
import PlayerMechFeet from '../objects/playerMechFeet'
import MechCannon from '../objects/mechCannon'
import XYTurrets from '../objects/xyTurrets'
import ScreenShaker from '../objects/screenShaker'
import Hud from '../objects/hud'
import AimTurrets from '../objects/aimTurrets'
import ExplosionAnims from '../objects/explosionAnims'

export default class MainScene extends Phaser.Scene {
  static readonly CAMERA_BOUNDS_WIDTH: integer = 1024
  static readonly CAMERA_BOUNDS_HEIGHT: integer = 2048
  debugText: DebugText
  playerMechBody: PlayerMechBody
  playerMechFeet: PlayerMechFeet
  mechCannon: MechCannon
  xyTurrets: XYTurrets
  aimTurrets: AimTurrets
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  fire: Phaser.Input.Keyboard.Key
  wKey: Phaser.Input.Keyboard.Key
  aKey: Phaser.Input.Keyboard.Key
  sKey: Phaser.Input.Keyboard.Key
  dKey: Phaser.Input.Keyboard.Key
  screenShaker: ScreenShaker
  hud: Hud
  explosions: ExplosionAnims

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.explosions = new ExplosionAnims(this)
    this.debugText = new DebugText(this)
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1)
    this.screenShaker = new ScreenShaker(this)
    this.playerMechFeet = new PlayerMechFeet(this, 300, 300)
    this.playerMechBody = new PlayerMechBody(this, 300, 300, this.debugText, this.screenShaker, this.explosions)
    this.cameras.main.setBounds(0, 0, MainScene.CAMERA_BOUNDS_WIDTH, MainScene.CAMERA_BOUNDS_HEIGHT)
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.playerMechFeet, true, 0.09, 0.09)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.mechCannon = new MechCannon(this, this.explosions)
    this.xyTurrets = new XYTurrets(this, this.explosions)
    this.xyTurrets.addTurrets()
    this.aimTurrets = new AimTurrets(this, this.debugText)
    this.aimTurrets.addTurrets(this.playerMechBody)

    // overlap event when the player's mech bullets hit a turret
    this.physics.add.overlap(
      this.mechCannon.bulletGroup, 
      this.xyTurrets.turretGroup, 
      this.turretHit)
    
    this.physics.add.overlap(
      this.xyTurrets.turretBulletGroup,
      this.playerMechBody,
      this.mechHit)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: 36
      })
      .setOrigin(1, 0)

      this.hud = new Hud(this, this.cameras.main, this.playerMechBody)

      /*let emitter:Phaser.GameObjects.Particles.ParticleEmitterManager = this.add.particles('flame')
      emitter.createEmitter({
        angle: { min: -120, max: 120 },
        scale: { start: 1.5, end: 0.5 },
        alpha: { start: 1, end: .5 },
        lifespan: 400,
        speed: { min: 20, max: 30 },
        follow: this.playerMechBody,
        frequency: 50,
        quantity: 2,
        blendMode: 'MULTIPLY'
      });*/



  }

  mechHit(mech: Phaser.GameObjects.GameObject, turretBullet: Phaser.GameObjects.GameObject) {
    if (turretBullet.getData('canDamage')) {
      let bulletDamage = turretBullet.data.values.damage
      turretBullet.getData('onHit')(turretBullet)
      mech.getData('onHit')(mech, bulletDamage)
    }
  }

  turretHit(bullet: Phaser.GameObjects.GameObject, turret: Phaser.GameObjects.GameObject) {
    // assign off the damage ahead of time. when the bullet is destroyed, the damage is unavailable
    if (bullet.getData('canDamage')) {
      let bulletDamage = bullet.data.values.damage
      bullet.getData('onHit')(bullet)
      turret.getData('onHit')(turret, bulletDamage)
    }
  }

  update(time: number, delta: number) {
    // this.debugText.setText(`turrets left: ${this.turrets.turretGroup.children.size}`)
    // this.debugText.setTexxt(`hp2: ${this.playerMechBody.hp}`)
    this.debugText.update(this.playerMechFeet, this.playerMechBody)
    this.playerMechFeet.update(this.wKey, this.aKey, this.sKey, this.dKey, time)
    this.playerMechBody.update(this.playerMechFeet, this.cursors)
    this.mechCannon.update(this.fire, 
      this.playerMechBody.angle, 
      this.getVector(this.playerMechBody.x, this.playerMechBody.y), 
      time, delta, this.playerMechBody)   
    this.xyTurrets.update(time, delta) 
    this.screenShaker.update(time, delta)
    this.hud.update(this.xyTurrets.turretGroup.children.size)
    this.aimTurrets.update(time, delta, this.playerMechBody, this.debugText)
    this.explosions.update(time, delta)
  }

  getVector(x: number, y: number): Phaser.Math.Vector2 {
    let vector:Phaser.Math.Vector2 = new Phaser.Math.Vector2()
    vector.x = x
    vector.y = y
    return vector
  }

}
