export default class GameScreen extends Phaser.GameObjects.Container {

    constructor(data){
        let {scene} = data;
        super(scene);
        this.scene = scene;

    //TEXT
    //TITLE
    this.STOMA_TITLE = this.scene.add.text(335,475, 'What\'s Stomata?', { fontFamily: '"font1"', fontSize: '35px', fill: '#317D00' })
    .setOrigin(0,0);

    //INITIAL TEXT
    this.START_Clickthiscell = this.scene.add.text(430,130, 'Click the orange cell \nto make a stoma', { fontFamily: '"font1"', fontSize: '20px', fill: '#CD2906' })
        .setVisible(true)
        .setDepth(1);

    //RESOURCE LEVELS
    this.WaterLevelsText = this.scene.add.text(40, 50, 'Water: 1000', { fontFamily: '"font1"', fontSize: '20px', fill: '#04B7F1' }).setVisible(false);
    this.CO2LevelsText = this.scene.add.text(40, 85, 'CO2: 1000', { fontFamily: '"font1"', fontSize: '20px', fill: '#68A301' }).setVisible(false);
    this.ATPLevelsText = this.scene.add.text(40, 120, 'ATP: 0', { fontFamily: '"font1"', fontSize: '20px', fill: '#CD2906' }).setVisible(false);
    this.BiomassText = this.scene.add.text(750, 695, 'BioMass: 0', { fontFamily: '"font1"', fontSize: '20px', fill: '#a17a00' }).setVisible(true);

    //RESOURCE RATES
    this.WaterLossRateText = this.scene.add.text(600, 545, ' water per s', { fontFamily: '"font1"', fontSize: '13px', fill: '#04B7F1' }).setVisible(false);
    this.CO2GainRateText = this.scene.add.text(600, 570, ' CO2 per s', { fontFamily: '"font1"', fontSize: '13px', fill: '#68A301' }).setVisible(false);
    this.ATPGainRateText = this.scene.add.text(600, 595, ' ATP per s', { fontFamily: '"font1"', fontSize: '13px', fill: '#CD2906' }).setVisible(false);

    //ATP GENERATION
    this.ATPSection = this.scene.add.text(40, 170, 'ATP Generation', { fontFamily: '"font1"', fontSize: '15px', fill: '#CD2906' }).setOrigin(0,0).setVisible(false);
    this.WaterSection = this.scene.add.text(40, 380, 'Watering', { fontFamily: '"font1"', fontSize: '15px', fill: '#04B7F1' }).setOrigin(0.0).setVisible(false);
    this.StomataSection = this.scene.add.text(40, 540, 'Stomata', { fontFamily: '"font1"', fontSize: '15px', fill: '#317D00' }).setOrigin(0.0).setVisible(false);

    //STATE
    this.ConditionsText = this.scene.add.text(530, 40, 'Conditions: Normal',  { fontFamily: '"font1"', fontSize: '20px', fill: '#000' }).setVisible(false);

    this.scene.add.existing(this);

    }
}