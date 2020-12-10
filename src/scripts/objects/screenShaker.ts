export default class ScreenShaker {
  cameraShakeTimer: integer
  cameras: Phaser.Cameras.Scene2D.CameraManager
  constructor(scene: Phaser.Scene) {
    this.cameraShakeTimer = 0
    this.cameras = scene.cameras
  }

  public update(time: number, delta: number) {
    this.cameraShakeTimer -= delta;

    if (this.cameraShakeTimer < 0) {
      this.cameras.main.x = 0;
      this.cameras.main.y = 0;
      this.cameras.main.setRotation(0);
    } else {
      this.minishake(false);
      this.bigshake(false)
    }
  }

  public minishake(resetTimer = true): void {
    let shakeX = Phaser.Math.Between(-2, 2);
    let shakeY = Phaser.Math.Between(-2, 2);
    this.cameras.main.x = shakeX
    this.cameras.main.y = shakeY
    if (resetTimer) {
      this.cameraShakeTimer = 150
    }
  }

  public bigshake(resetTimer = true): void { 
    let shakeX = Phaser.Math.Between(-5, 5)
    let shakeY = Phaser.Math.Between(-5, 5)
    this.cameras.main.x = shakeX
    this.cameras.main.y = shakeY
    if (resetTimer) {
      this.cameraShakeTimer = 1000
    }
  }

}
