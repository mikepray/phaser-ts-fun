import DebugText from '../objects/debugText'
import PlayerMechBody from '../objects/playerMechBody'
import PlayerMechFeet from '../objects/playerMechFeet'
import MechCannon from '../objects/mechCannon'
import Turrets from '../objects/turrets'

export default class MainScene extends Phaser.Scene {
  debugText: DebugText
  playerMechBody: PlayerMechBody
  playerMechFeet: PlayerMechFeet
  mechCannon: MechCannon
  turrets: Turrets
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  fire: Phaser.Input.Keyboard.Key
  wKey: Phaser.Input.Keyboard.Key
  aKey: Phaser.Input.Keyboard.Key
  sKey: Phaser.Input.Keyboard.Key
  dKey: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1)
    
    this.playerMechFeet = new PlayerMechFeet(this, 300, 300)
    this.playerMechBody = new PlayerMechBody(this, 300, 300)
    this.cameras.main.setBounds(0, 0, 1024, 2048)
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.playerMechFeet, true, 0.09, 0.09)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.mechCannon = new MechCannon(this)
    this.turrets = new Turrets(this)

    //this.physics.add.collider(this.playerMechBullets, this.turrets, this.bulletHitTurret)
    this.physics.add.overlap(this.mechCannon.bulletGroup, 
      this.turrets.turretGroup, 
      this.turretHit,
      undefined,
      this)

    this.debugText = new DebugText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: 36
      })
      .setOrigin(1, 0)
  }

  turretHit(bullet: Phaser.GameObjects.GameObject, turret: Phaser.GameObjects.GameObject) {
    bullet.getData('onHit')(bullet)
    turret.destroy()
  }

  update(time: number, delta: any) {
    this.debugText.update(this.playerMechFeet, this.playerMechBody)
    this.playerMechFeet.update(this.wKey, this.aKey, this.sKey, this.dKey, time)
    this.playerMechBody.update(this.playerMechFeet, this.cursors)
    this.mechCannon.update(this.fire, this.playerMechBody.angle, this.getVector(this.playerMechBody.x, this.playerMechBody.y), time)    
  }

  getVector(x: number, y: number): Phaser.Math.Vector2 {
    let vector:Phaser.Math.Vector2 = new Phaser.Math.Vector2()
    vector.x = x
    vector.y = y
    return vector
  }
}
