export default class DialogueBox extends Phaser.GameObjects.Container {
    
    constructor(data){
        let {scene, text} = data;
        super(scene);
        this.scene = scene;

        this.Box = this.scene.add.rectangle(500, 375, 500, 375, 0xCD2906, 1).setDepth(10).setInteractive();
        this.Box2 = this.scene.add.rectangle(500, 375, 475, 350, 0xffadad, 1).setDepth(10).setInteractive();

        this.Text = this.scene.add.text(290,227.5, 
            text,
            { fontFamily: '"font1"', fontSize: '20px', fill: '#CD2906', wordWrap: {width: 420}}
        ).setDepth(20).setOrigin(0,0);

        this.Box.on('pointerdown', function (event) {  
            this.Box.destroy();
            this.Box2.destroy();
            this.Text.destroy();
        },this);

        this.Box2.on('pointerdown', function (event) {  
            this.Box.destroy();
            this.Box2.destroy();
            this.Text.destroy();
        },this);

        this.scene.add.existing(this);
    };
};
