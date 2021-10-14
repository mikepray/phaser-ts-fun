import PlayerMechFeet from '../objects/playerMechFeet'
import MainScene from '../scenes/mainScene'
import DebugText from './debugText'
import ExplosionAnims from './explosionAnims'
import ScreenShaker from './screenShaker'
export default class PlayerMechBody extends Phaser.Physics.Arcade.Sprite {

  static readonly TEXTURE: string = 'player-mech'
  static readonly ASSET: string = 'assets/img/croppedmech.png'
  static readonly DIRECTION_CHANGE_DELTA_IN_DEGREES: integer = 3
  static readonly MAX_MECH_BODY_ROTATION: integer = 90
  static readonly MAX_HP: integer = 100
  physics: Phaser.Physics.Arcade.ArcadePhysics
  direction: integer
  debugText: DebugText
  screenShaker: ScreenShaker
  explosionAnims: ExplosionAnims
  lastMechFeetAngle: number = 0

  constructor(scene: Phaser.Scene, 
    x: number, y: number, 
    debugText: DebugText, 
    screenShaker: ScreenShaker,
    explosionAnims: ExplosionAnims) {
    super(scene, x, y, PlayerMechBody.TEXTURE)
    this.direction = 0
    this.setAngle(this.direction)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.physics = scene.physics
    this.setData('hp', PlayerMechBody.MAX_HP)
    this.setData('onHit', this.onHit)
    this.setData('alive', true)
    this.debugText = debugText
    this.screenShaker = screenShaker
    this.explosionAnims = explosionAnims

    this.setData('deathExplosion',
     this.explosionAnims.createExplosion(this.body.x, this.body.y, 
      ExplosionAnims.EXPLOSION_D,
       new Phaser.Math.Vector2(7, 7)))
    this.setData('damageExplosion',
     this.explosionAnims.createExplosion(this.body.x, this.body.y, 
      ExplosionAnims.EXPLOSION_G,
       new Phaser.Math.Vector2(7, 7)))

       
  }

  public update(mechFeet: PlayerMechFeet, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    if (!this.getData('alive')) {
      return
    }
    if (cursors!.left!.isDown && this.direction - PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES > -PlayerMechBody.MAX_MECH_BODY_ROTATION) {
      this.direction -= PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
    } if (cursors!.right!.isDown && this.direction + PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES < PlayerMechBody.MAX_MECH_BODY_ROTATION) {
      this.direction += PlayerMechBody.DIRECTION_CHANGE_DELTA_IN_DEGREES
    }

    this.setAngle(mechFeet.angle + this.direction)
    this.setX(mechFeet.x)
    this.setY(mechFeet.y)
    
    if (this.getData('wasHit')) {
      this.screenShaker.minishake()
      this.setData('wasHit', false)
    }
    if (this.getData('wasKilled')) {
      this.screenShaker.bigshake()
      let emitter:Phaser.GameObjects.Particles.ParticleEmitterManager = this.scene.add.particles('flame')
      emitter.createEmitter({
        angle: { min: -180, max: 180 },
        scale: { start: 3, end: 0.5 },
        alpha: { start: 1, end: .5 },
        lifespan: 1000,
        speed: { min: 20, max: 30 },
        follow: this,
        frequency: 50,
        quantity: 4,
        blendMode: 'MULTIPLY'
      });
      this.setData('wasKilled', false)
    }
    if (this.getData('wasBloodied')) {
      let emitter:Phaser.GameObjects.Particles.ParticleEmitterManager = this.scene.add.particles('flame')
      emitter.createEmitter({
        angle: { min: -120, max: 120 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: .75, end: .5 },
        lifespan: 200,
        speed: { min: 10, max: 20 },
        follow: this,
        frequency: 25,
        quantity: 1,
        blendMode: 'MULTIPLY'
      });
      this.setData('wasBloodied', false)
    }
  }

  public onHit(mech: PlayerMechBody, damage: integer, debugText:DebugText) {
    mech.data.values.hp -= damage
    
    if (mech.getData('alive')) {
      if (mech.data.values.hp <= 0) {
        let deathExplosion:Phaser.GameObjects.Sprite = mech.getData('deathExplosion')
        .setX(mech.x).setY(mech.y)
        .setScale(3)
        .play(ExplosionAnims.EXPLOSION_D)
        
        // deathExplosion
        mech.setData('wasKilled', true)
        mech.setData('alive', false)
      } else {
        mech.getData('damageExplosion').setX(mech.x).setY(mech.y).setScale(.4).play(ExplosionAnims.EXPLOSION_G)
        mech.setData('wasHit', true)
        
        if (mech.data.values.hp / PlayerMechBody.MAX_HP < .5) {
          mech.setData('wasBloodied', true)
        }
      }
   }
   
  }

}
