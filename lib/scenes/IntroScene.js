export default class IntroScene extends Phaser.Scene{
    constructor(){
        super('IntroScene');
    };


    create(){
        this.add.text(60, 70, 'What\'s Stomata?', { fontFamily: '"font1"', fontSize: '50px', fill: '#68A301' });
        
        this.add.text(60, 190, 'Control the flow of CO2 and H2O to help your plant grow \n\nUse CO2 to generate ATP \n\nUse ATP to develop your plant', 
            { fontFamily: '"font1"', 
            fontSize: '20px', 
            fill: '#CD2906' ,
            wordWrap: {
                width: 600,
            }
        });
        
        this.input.once('pointerup', function () {
            this.scene.start('MainGame');
        }, this);

    };
};