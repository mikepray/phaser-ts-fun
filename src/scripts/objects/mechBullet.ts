import PlayerMech from "./playerMechBody"

export default class MechBullet extends Phaser.Physics.Arcade.Image {

    lifespan: number
    static readonly DEFAULT_SPEED: number = 75
    static readonly DEFAULT_LIFESPAN: number = 2000
    static readonly ARM_GUN_OFFSET_IN_RADS: number = .5

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'mech-bullet')
        this.setBlendMode(1)
        this.setDepth(1)
        this.setScale(.7)
        this.lifespan = MechBullet.DEFAULT_LIFESPAN
    }

    public fire(mech: PlayerMech, everyOtherGun: boolean) {
        this.lifespan = MechBullet.DEFAULT_LIFESPAN

        this.setActive(true)
        this.setVisible(true)
        this.setAngle(mech.angle)

        // radius
        let r = 15
        let rads = Phaser.Math.DegToRad(mech.angle)
        // offset for arm guns
        let gunAngleInRads = rads 
        if (everyOtherGun) {
            gunAngleInRads -= MechBullet.ARM_GUN_OFFSET_IN_RADS
        } else {
            gunAngleInRads += MechBullet.ARM_GUN_OFFSET_IN_RADS
        }
        let x = r * Math.cos(gunAngleInRads) + mech.x
        let y = r * Math.sin(gunAngleInRads) + mech.y
        this.setPosition(x, y)
        this.body.reset(x, y)
 
        this.scene.physics.velocityFromRotation(rads, MechBullet.DEFAULT_SPEED, this.body.velocity)

        this.body.velocity.x *= 2.5
        this.body.velocity.y *= 2.5
    }

    public update(time: number, delta: number) {
            this.lifespan -= delta

            if (this.lifespan <= 0) {
                this.setActive(false)
                this.setVisible(false)
                this.body.stop()
            }
        }
}