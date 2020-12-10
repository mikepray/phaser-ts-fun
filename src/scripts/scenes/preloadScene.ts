import XYTurrets from '../objects/xyTurrets'
import PlayerMechFeet from '../objects/playerMechFeet'
import PlayerMechBody from '../objects/playerMechBody'
import MechCannon from '../objects/mechCannon'
import Hud from '../objects/hud'
import AimTurrets from '../objects/aimTurrets'
import ExplosionAnims from '../objects/explosionAnims'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('phaser-logo', 'assets/img/phaser-logo.png')
    this.load.image('map', 'assets/img/earthbound-scarab.png')
    this.load.image(MechCannon.TEXTURE, MechCannon.ASSET)
    this.load.image(PlayerMechBody.TEXTURE, PlayerMechBody.ASSET)
    this.load.image(PlayerMechFeet.TEXTURE, PlayerMechFeet.ASSET)  
    this.load.image(XYTurrets.TURRET_TEXTURE, XYTurrets.TURRET_ASSET) 
    this.load.image(XYTurrets.BULLET_TEXTURE, XYTurrets.BULLET_ASSET)
    this.load.bitmapFont(Hud.FONT_KEY, Hud.FONT_ASSET, Hud.FONT_XML)
    this.load.image('flame', 'assets/img/flame.png')
    this.load.image(AimTurrets.TURRET_BASE_TEXTURE, AimTurrets.TURRET_BASE_ASSET)
    this.load.image(AimTurrets.TURRET_TOP_TEXTURE, AimTurrets.TURRET_TOP_ASSET)

    this.preloadExplosion(ExplosionAnims.EXPLOSION_A, 8, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_B, 12, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_C, 9, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_D, 9, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_E, 10, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_F, 9, 'assets/img/explosions/png/', '.png')
    this.preloadExplosion(ExplosionAnims.EXPLOSION_G, 9, 'assets/img/explosions/png/', '.png')
  }

  preloadExplosion(explosionKey:string, numFrames:integer, pathPrefix:string, fileType:string) {
    for (let i:integer = 1; i < numFrames + 1; i++) {
      this.load.image(`${explosionKey}${i}`, `${pathPrefix}${explosionKey}/${explosionKey}${i}${fileType}`)
    }
  }
  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
