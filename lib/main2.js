import IntroScene from './scenes/IntroScene.js'
import MainGame from './scenes/MainGame.js'

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 750,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    parent: 'phaser-example',
    scene: [ IntroScene, MainGame ] 
}

var game = new Phaser.Game(config)

