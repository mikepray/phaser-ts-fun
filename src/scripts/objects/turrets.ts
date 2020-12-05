export default class Turrets {

  static readonly TEXTURE: string = 'turret'
  static readonly ASSET: string = 'assets/img/quiltmonster.png'

  turretGroup: Phaser.Physics.Arcade.Group
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.turretGroup = scene.physics.add.group({
      maxSize: 100,
      runChildUpdate: true,
      createCallback: turret => scene.physics.world.enable(turret)
    })
  }

  public addTurret() {
    this.turretGroup.create(400, 400, Turrets.TEXTURE)
  }
  
  public update() {
 
  
  }

}
