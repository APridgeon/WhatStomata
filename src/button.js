export default class Button extends Phaser.GameObjects.Container {

    constructor(data){
        let {scene, x, y, key1, text1, text2, helptext, cost} = data;
        super(scene);
        this.scene = scene;

        this.button = this.scene.add.sprite(x, y, key1)
            .setScale(0.5)
            .setInteractive()
            .setOrigin(0,0)
            .setVisible(false);
    
        this.text1Button = this.scene.add.text(x+20, y+10, text1, 
            {fontFamily:'"font1"', fontSize: '15px', fill: '#fff' })
            .setOrigin(0,0)
            .setVisible(false);

        this.text2Button = this.scene.add.text(x+20, y+10, text2, 
            {fontFamily:'"font1"', fontSize: '15px', fill: '#fff' })
            .setOrigin(0,0)
            .setVisible(false);
        
        this.helpText = this.scene.add.text((x+250), (y-50), helptext, 
            { fontFamily: '"font1"', fontSize: '10px', fill: '#fff', backgroundColor: '#000',
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                },
            wordWrap: {
                width: 200,
            }})
            .setOrigin(0,0)
            .setVisible(false)
            .setDepth(5);

        this.button.on('pointerdown', function (event) {
            this.setTint(0xff0000);
        });
    
        this.button.on('pointerup', function(event){
            this.clearTint();
        });
    
        this.button.on('pointerover', function (event){
            this.text1Button.setVisible(false);
            this.text2Button.setVisible(true);                
            this.helpText.setVisible(true);
        },this);
    
        this.button.on('pointerout', function(event){
            this.text2Button.setVisible(false);
            this.text1Button.setVisible(true);
            this.helpText.setVisible(false);
        },this);

        this.cost = cost

        this.scene.add.existing(this);
    }
}   
