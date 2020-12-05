import Turrets from '../objects/turrets'
import PlayerMechFeet from '../objects/playerMechFeet'
import PlayerMechBody from '../objects/playerMechBody'
import MechCannon from '../objects/mechCannon'

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
    this.load.image(Turrets.TEXTURE, Turrets.ASSET) 
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
