export default class ExplosionAnims {

  static readonly EXPLOSION_A:string = 'explosion-a'
  static readonly EXPLOSION_B:string = 'explosion-b'
  static readonly EXPLOSION_C:string = 'explosion-c'
  static readonly EXPLOSION_D:string = 'explosion-d'
  static readonly EXPLOSION_E:string = 'explosion-e'
  static readonly EXPLOSION_F:string = 'explosion-f'
  static readonly EXPLOSION_G:string = 'explosion-g'

  scene: Phaser.Scene
  explosionGroup: Phaser.GameObjects.Group

  playAtX:integer = 0
  playAtY:integer = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.scene.anims.create({
      key: ExplosionAnims.EXPLOSION_A,
      frames: [
          { key: `${ExplosionAnims.EXPLOSION_A}1`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_A}2`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_A}3`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_A}4`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_A}5`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_A}6`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_A}7`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_A}8`, frame: 0, visible: false}
      ],
      frameRate: 12,
      repeat: 0,
      hideOnComplete:true,
      showOnStart:true
   });

   this.scene.anims.create({
    key: ExplosionAnims.EXPLOSION_B,
    frames: [
        { key: `${ExplosionAnims.EXPLOSION_B}1`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_B}2`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_B}3`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_B}4`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_B}5`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}6`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}7`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}8`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}9`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}10`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}11`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_B}12`, frame: 0, visible: false}
    ],
    frameRate: 7,
    repeat: 0,
    hideOnComplete:true,
    showOnStart:true  
    });
    
  this.scene.anims.create({
      key: ExplosionAnims.EXPLOSION_C,
      frames: [
          { key: `${ExplosionAnims.EXPLOSION_C}1`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_C}2`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_C}3`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_C}4`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_C}5`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_C}6`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_C}7`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_C}8`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_C}9`, frame: 0, visible: false}
      ],
      frameRate: 15,
      repeat: 0,
      hideOnComplete:true,
      showOnStart:true  
      });

   this.scene.anims.create({
    key: ExplosionAnims.EXPLOSION_D,
    frames: [
        { key: `${ExplosionAnims.EXPLOSION_D}1`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_D}2`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_D}3`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_D}4`, frame: 0},
        { key: `${ExplosionAnims.EXPLOSION_D}5`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_D}6`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_D}7`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_D}8`, frame: 0, visible: false},
        { key: `${ExplosionAnims.EXPLOSION_D}9`, frame: 0, visible: false}
    ],
    frameRate: 7,
    repeat: 0,
    hideOnComplete:true,
    showOnStart:true  
    });

    this.scene.anims.create({
      key: ExplosionAnims.EXPLOSION_G,
      frames: [
          { key: `${ExplosionAnims.EXPLOSION_G}1`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_G}2`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_G}3`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_G}4`, frame: 0},
          { key: `${ExplosionAnims.EXPLOSION_G}5`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_G}6`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_G}7`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_G}8`, frame: 0, visible: false},
          { key: `${ExplosionAnims.EXPLOSION_G}9`, frame: 0, visible: false}
      ],
      frameRate: 7,
      repeat: 0,
      hideOnComplete:true,
      showOnStart:true  
      });
   this.explosionGroup = scene.physics.add.group({
     maxSize: 4000
   })
  }

  public createExplosion(x:number, y:number, 
    animKey:string, offset?: Phaser.Math.Vector2):Phaser.GameObjects.Sprite {
    
    if (offset) {
      x += offset.x
      y += offset.y
    }
    let explosion:Phaser.GameObjects.Sprite = this.explosionGroup.get(x, y,`${animKey}1`)
    .setDepth(102)
    .setVisible(false)
    .setData('shouldClear', false)
    // .setData('body', body)
    explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, 
      sprite => {
        sprite.setActive(false)
        sprite.destroy()
      }, 
      explosion)
    //explosion.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE_KEY, (anim: any, something: any) => {
      //sprite.setData('shouldUpdate', true)
      
    //}, explosion)
    
    return explosion
  }

  public update(time:number, delta:number) {
    this.explosionGroup.children.entries.forEach(
      explosion => {
        if (explosion.data.values.shouldClear) {
          explosion.setActive(false)
          explosion.data.values.shouldClear = false
        }
        //if (explosion.data.values.shouldUpdate) {
          // this.updateExplosionPosition(explosion, explosion.body as Phaser.Physics.Arcade.Body)
          // explosion.data.values.shouldUpdate = false
        //}
      }
    )
  }

  public updateExplosionPosition(explosion:Phaser.GameObjects.GameObject, body:Phaser.Physics.Arcade.Body) {
    body.x = explosion.data.values.body.x
    body.y = explosion.data.values.body.y
  }
}