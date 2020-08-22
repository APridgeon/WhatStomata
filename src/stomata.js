export default class Stomata extends Phaser.GameObjects.Sprite {

    constructor(data){
        let {scene, x, y, key1} = data;
        super(scene);
        this.scene = scene;

        //ANIMATIONS

        this.scene.anims.create({
            key: 'stom',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 0, end: 3}),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'stomClosing',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 4, end: 7}),
            frameRate: 1,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'stomClosed',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 7, end: 10}),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'stomABA',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 11, end: 14}),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'stomABAClosing',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 15, end: 18}),
            frameRate: 1,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'stomABAClosed',
            frames: this.scene.anims.generateFrameNumbers('stomata', {start: 18, end: 21}),
            frameRate: 1,
            repeat: -1
        });



        //STOMA
        this.stomata = this.scene.add.sprite(x, y, key1)
            .setOrigin(0,0)
            .setScale(3)
            .setDepth(1);

        this.stomata.StomataState = "open";
        this.stomata.prevStomataState = "open";
        this.stomata.ABASignalling = false;


        this.stomata.anims.playReverse('stomClosing');
        this.stomata.once('animationcomplete', ()=>{
            this.stomata.anims.play('stom');
        });

        this.scene.add.existing(this);
    };
};
