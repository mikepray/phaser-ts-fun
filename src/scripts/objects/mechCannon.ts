import ExplosionAnims from "./explosionAnims"

export default class MechCannon {

    static readonly TEXTURE: string = 'mech-bullet'
    static readonly ASSET: string = 'assets/img/bullet7.png'
    static readonly DEFAULT_SPEED: number = 300
    static readonly DEFAULT_LIFESPAN: number = 2000
    static readonly ARM_GUN_OFFSET_IN_RADS: number = .5
    static readonly RADIUS: integer = 15 // radius to offset the bullet position (width of the mech)
    static readonly VELOCITY_MULTIPLIER: number = 2.5 // speed of the bullet
    static readonly BULLET_DAMAGE: integer = 5
    static readonly TIME_BETWEEN_FIRING: integer = 400

    bulletGroup: Phaser.Physics.Arcade.Group
    scene: Phaser.Scene
    everyOtherGun: boolean
    lastFired: integer
    explosionAnims: ExplosionAnims

    constructor(scene: Phaser.Scene, explosionAnims:ExplosionAnims) {
        this.scene = scene
        this.explosionAnims = explosionAnims
        this.everyOtherGun = false
        this.lastFired = 0
        this.bulletGroup = scene.physics.add.group({
            maxSize: 30,
            runChildUpdate: false
        })

    }

    public update(fire: Phaser.Input.Keyboard.Key, mechAngle: number, mechPosition: Phaser.Math.Vector2, time: number, delta:number
        , playerMechBody:Phaser.GameObjects.Sprite) {
        if (fire.isDown && time > this.lastFired) {
            let bulletPosition = this.fire(mechAngle, mechPosition)
            this.lastFired = time + MechCannon.TIME_BETWEEN_FIRING
            /*this.scene.tweens.add({
                targets: playerMechBody,
                angle: deltaAngle,
                ease: 'Quad.easeOut',
                yoyo:true,
                duration: 150
            });*/
            playerMechBody.angle += (this.everyOtherGun ? 10 : -10)

            this.explosionAnims.createExplosion(bulletPosition.x, bulletPosition.y, 
                ExplosionAnims.EXPLOSION_C, new Phaser.Math.Vector2(0, 0))
                .setScale(.35)
                .play(ExplosionAnims.EXPLOSION_C)
        }

        this.bulletGroup.children.entries.forEach(
            bullet => {
              bullet.data.values.lifespan -= delta
              if (bullet.data.values.lifespan <= 0) {
                bullet.setActive(false)
              }
            }
          ) 
    }

    public fire(mechAngle: number, mechPosition: Phaser.Math.Vector2):Phaser.Math.Vector2 {
        let mechAngleInRads = Phaser.Math.DegToRad(mechAngle)
        let rotation = this.getRotationInRads(mechAngleInRads)
        let position:Phaser.Math.Vector2 = this.getBulletSpawnPosition(mechPosition, rotation)
        let velocity:Phaser.Math.Vector2 = this.getVelocity(mechAngleInRads)

        let bullet:Phaser.Physics.Arcade.Image = this.bulletGroup
            .get(position.x, position.y, MechCannon.TEXTURE)

        bullet.setData('onHit', this.onHit)
            .setData('damage', MechCannon.BULLET_DAMAGE)
            .setData('lifespan', MechCannon.DEFAULT_LIFESPAN)
            .setData('canDamage', true)
            .setAngle(mechAngle)
            .setVelocity(velocity.x, velocity.y)
            .setActive(true)
            .setVisible(true)
            .setScale(.7)
            .setBlendMode(1)
            .setDepth(1)

        this.everyOtherGun = !this.everyOtherGun

        return position
    }

    public onHit(bullet: Phaser.Physics.Arcade.Image) {
        bullet.setData('canDamage', false)
        bullet.setActive(false)
        bullet.setVisible(false)
    }

    getRotationInRads(mechAngleInRads:number): number {
        // offset for arm guns
        let gunAngleInRads = mechAngleInRads 
        if (this.everyOtherGun) {
            gunAngleInRads -= MechCannon.ARM_GUN_OFFSET_IN_RADS
        } else {
            gunAngleInRads += MechCannon.ARM_GUN_OFFSET_IN_RADS
        }
        return gunAngleInRads
    }

    getBulletSpawnPosition(mechPosition:Phaser.Math.Vector2, rotation:number): Phaser.Math.Vector2 {
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
        position.x = MechCannon.RADIUS * Math.cos(rotation) + mechPosition.x
        position.y = MechCannon.RADIUS * Math.sin(rotation) + mechPosition.y
        return position
    }

    getVelocity(rotation:number): Phaser.Math.Vector2 {
        // set velocity from mech's velocity and multiply it
        let mechVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
        let bulletVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2()
        this.scene.physics.velocityFromRotation(rotation, MechCannon.DEFAULT_SPEED, mechVelocity)
        bulletVelocity.x = 2.5 * mechVelocity.x
        bulletVelocity.y = 2.5 * mechVelocity.y
        return bulletVelocity
    }

}