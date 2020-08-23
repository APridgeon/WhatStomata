import Button from '../../src/button.js';
import Stomata from '../../src/stomata.js';
import GameScreen from '../../src/gamescreen.js';
import DialogueBox from '../../src/dialogue.js';

//Game variables
var gameData = {
    WaterLevels: 1000,
    CO2Levels: 1000,
    WaterLoss: 0,
    CO2Gain: 0,
    ATPLevels: 0,
    ATPGain: 1,
    PhotosynthesisLevels: 0,
    autoWater: 0,
    waxyCuticle: false,
    drought: false,
    prevDrought: false,
    timer: 0,
    timer2: 0,
    prevPhotosynthesisLevels: 0,
    BioMass: 0,
    StomataNumber: 0,
    BioMassUpgrade: 0.1,
    Plantx:  865,
    Planty: 515
};


export default class MainGame extends Phaser.Scene{
    constructor(){
        super('MainGame');
    };


    preload() {
        this.load.spritesheet('epidermisSprite', './assets/sprites/epidermisSprite.png', { frameWidth: 100, frameHeight: 75 });
        this.load.spritesheet('epidermisChloroplasts', './assets/sprites/epidermisChloroplasts.png', { frameWidth: 100, frameHeight: 75 });
        this.load.image('meristemoid1', './assets/sprites/meristemoid1.png');
        this.load.spritesheet('stomata', './assets/sprites/stomataSprite.png', { frameWidth: 25, frameHeight: 25 });
        this.load.image('rain', './assets/sprites/raindrop.png');
        this.load.image('mmc', './assets/sprites/meristemoidMotherCell.png');
        this.load.image('meristemoid2', './assets/sprites/meristemoid2.png');
        this.load.spritesheet('plantStart', './assets/sprites/plantStartSprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('plant', './assets/sprites/plantSprite.png', { frameWidth: 17, frameHeight: 12 });
        this.load.image('button', './assets/buttons/ATPButton.png');  
        this.load.image('button_2', './assets/buttons/waterButton.png');
        this.load.image('button_3', './assets/buttons/stomButton.png');

        
    };


    create() {

        //setting up the main game screen
        this.background = new GameScreen({scene: this}); //Most of the resource text is kept in the GameScreen class
        this.cameras.main.setBackgroundColor('#b9ff8d');

        this.epidermisSprite = this.add.sprite(315, 85, 'epidermisSprite').setScale(5).setOrigin(0,0); //The plant epidermis
        this.stomata1 = null; //The initial stomata
        this.StomataGroup = this.add.group(); //A group to add all stomata

        this.plant = this.add.sprite(825, 495, 'plantStart').setScale(5).setOrigin(0,0); //The growing potted plant in the corner 

        this.meristemoid1 = this.add.sprite(550, 205, 'meristemoid1').setInteractive() //The initial meristemoid cell
        .setScale(5)
        .setOrigin(0,0);



        //Animations for the growing potted plant

        this.anims.create({
            key: 'plantStart',
            frames: this.anims.generateFrameNumbers('plantStart', {start: 1, end: 10}),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'plantSeedling',
            frames: this.anims.generateFrameNumbers('plantStart', {start: 10, end: 17}),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'plantLeaves',
            frames: this.anims.generateFrameNumbers('plant', {start: 1, end: 7}),
            frameRate: 1,
            repeat: -1
        });

        this.plant.anims.play('plantStart');  // On starting the game the plant starting animation is triggered
        this.plant.once('animationcomplete',()=>{
             this.plant.anims.play('plantSeedling');
         });


        ////Generating the main game buttons 

        //BUTTON1 - BUY ATP button

        this.buyATP = new Button({
            scene: this,
            x: 20,
            y: 210, 
            key1: 'button',
            text1: 'Buy ' + gameData.ATPGain,
            text2: '25 CO2',
            helptext: 'Use CO2 to buy ATP. ATP can then be used to upgrade your plant'});

        this.buyATP.button.on('pointerdown', function (event) {   //Upon clicking the button ATP increases and CO2 decreases
            if (gameData.CO2Levels >= 25){
                gameData.ATPLevels += gameData.ATPGain;
                gameData.CO2Levels -= 25;
            };
        },this);
  

        //BUTTON2 - Upgrade ATP production button

        this.upgradeATP = new Button({
            scene: this,
            x: 20,
            y: 260, 
            key1: 'button',
            text1: 'Upgrade ATP',
            text2: '10 ATP',
            helptext: 'Increase the amount of ATP you get per CO2',
            cost: 10 });

        this.upgradeATP.button.on('pointerdown', function (event) {   //Upon clicking this button the amount of ATP generated per button 1 is increased
            if (gameData.ATPLevels >= this.upgradeATP.cost){
                gameData.ATPGain *= 2;
                gameData.ATPLevels -= this.upgradeATP.cost;
                this.upgradeATP.cost *= 1.5;                           //Also the cost of this button is increased by x 1.5
                this.upgradeATP.text2Button.setText(this.upgradeATP.cost.toFixed(2) + ' ATP');
                this.buyATP.text1Button.setText('Buy ' + gameData.ATPGain);
                if (gameData.WaterLoss == 0){
                    gameData.WaterLoss += 1;
                };
            };
        },this);        
        
        //BUTTON3 - Buy photosynthesis button 

        this.buyPhotosynthesis =  new Button({
            scene: this,
            x: 20,
            y: 310, 
            key1: 'button',
            text1: 'Photosynthesis',
            text2: '100 ATP',
            helptext: 'Buy Photosynthesis in order to automatically accumulate ATP',
            cost: 100});

        this.anims.create({
            key: 'photosynthesisUpgrade',
            frames: this.anims.generateFrameNumbers('epidermisChloroplasts', {start: 0, end: 3}),
            frameRate: 1,
            repeat: -1
        });

        this.chloroplastSprite = null;
            
        this.buyPhotosynthesis.button.on('pointerdown', function (event) {   //Upon clicking this button photosynthesis is activated
            if (gameData.ATPLevels >= this.buyPhotosynthesis.cost){
                gameData.PhotosynthesisLevels += 1;                          //The update function add animation to the chloroplastSprite once photosynthesis levels > 0
                gameData.ATPLevels -= this.buyPhotosynthesis.cost;
                this.buyPhotosynthesis.cost *= 1.5;                          //Increases the cost of this button by 1.5
                this.buyPhotosynthesis.text2Button.setText(this.buyPhotosynthesis.cost.toFixed(2) + ' ATP');
                this.background.ATPGainRateText.setVisible(true);
            };
        },this);

        //BUTTON4 - Watering plants button

        this.waterPlants = new Button({
            scene: this,
            x: 20,
            y: 420, 
            key1: 'button_2',
            text1: 'Water Plants',
            text2: '100 ATP',
            helptext: 'Use ATP to increase the water levels of your plant'});

        this.waterPlants.button.on('pointerdown', function (event) {   //Upon clicking  this button water levels are increased
            if (gameData.ATPLevels >= 100){
                gameData.WaterLevels += 1000;
                gameData.ATPLevels -= 100;
                this.rain = this.physics.add.group({                   //The update function eventually destroys rain particles
                    key: 'rain',
                    repeat: 7,
                    setXY: { x: 20, y: 0, stepX: 170}
                }).setOrigin(0,0).setDepth(1);
                this.rain.setDepth(2);
            };
        },this);
        
        //BUTTON 5 - AUTO WATERING

        this.autoWatering = new Button({
            scene: this,
            x: 20,
            y: 470, 
            key1: 'button_2',
            text1: 'Auto-Water',
            text2: '1000 ATP',
            helptext: 'Buy this to automatically water your plant'})
            .setDepth(1);

        this.autoWatering.button.on('pointerdown', function (event) {   //Upon clicking this button automatic increases in watering are activated
            if (gameData.ATPLevels >= 1000){
                gameData.autoWater += 1
                gameData.ATPLevels -= 1000
            };
        });

        //BUTTON 6 - CLOSE/OPEN STOMATA

        this.closeStomata = new Button({
            scene: this, 
            x: 20,
            y: 630, 
            key1: 'button_3',
            text1: 'Close Stomata',
            text2: '1000 ATP',
            helptext: 'Fuel stomatal closure by using up ATP'});

        this.closeStomata.button.on('pointerdown', function (event) {       //Upon clicking this button stomatal closing or opening animations are triggered
            if (gameData.ATPLevels >= 1000){
                if(this.stomata1.stomata.StomataState == 'open'){
                    if(this.stomata1.stomata.ABASignalling == true){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosing')}, this);
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this);
                        })}, this);
                    };
                    if(this.stomata1.stomata.ABASignalling == false){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomClosing')}, this);
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomClosed')}, this);
                        })}, this);
                    };
                };
                if(this.stomata1.stomata.StomataState == 'closed'){
                    if(this.stomata1.stomata.ABASignalling == true){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomABAClosing')}, this);
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this);
                        })}, this);
                    };
                    if(this.stomata1.stomata.ABASignalling == false){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomClosing')}, this);
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stom')}, this);
                        })}, this);
                    };
                };
            };
                
        },this);

        this.closeStomata.button.on('pointerup', function (event) { //Once you have clicked on this button the stomatal state is changed from open to closed or vice versa
            if (gameData.ATPLevels >= 1000){
                gameData.ATPLevels -= 1000;
                if(this.stomata1.stomata.StomataState == 'open'){
                    this.stomata1.stomata.StomataState = 'closed';
                    this.closeStomata.text1Button.setText('Open Stomata');
                    return;
                };
                if(this.stomata1.stomata.StomataState == 'closed'){
                    this.stomata1.stomata.StomataState = 'open';
                    this.closeStomata.text1Button.setText('Close Stomata');
                    return;
                };
            };
        },this);


        //UPGRADE BUTTONS
        //BUTTON 7 - Upgrade waxy cuticle
        this.upgradeWaxyCuticle = new Button({
            scene: this, 
            x: 320,
            y: 600, 
            key1: 'button_3',
            text1: 'Upgrade Cuticle',
            text2: '1000 ATP',
            helptext: 'Decrease the water loss rate of your plant by upgrading the waxy cuticle'});
            
        this.upgradeWaxyCuticle.button.on('pointerdown', function (event) {   //Upon clicking this button epidermis is upgraded
            if(gameData.ATPLevels >= 1000){
                this.upgradeWaxyCuticle.button.destroy();
                this.upgradeWaxyCuticle.text1Button.destroy();
                this.upgradeWaxyCuticle.text2Button.destroy();
                this.upgradeWaxyCuticle.helpText.destroy();
                gameData.WaterLoss *= 0.5;
                gameData.waxyCuticle = true;            
                gameData.ATPLevels -= 1000;
                if(gameData.drought == true){
                    this.epidermisSprite.setFrame(2);       
                };
                if(gameData.drought == false){
                    this.epidermisSprite.setFrame(1);   //Changes to waxy cuticle sprite if not in drought mode otherwise update function will eventually change it after drought
                };
            };
        },this);


        //BUTTON 8 - Develop ABA signalling
        this.upgradeABASignalling = new Button({
            scene: this, 
            x: 320,
            y: 550, 
            key1: 'button_3',
            text1: 'ABA Signalling',
            text2: '1000 ATP',
            helptext: 'Develop ABA signalling to automatically close your stomata during drought'});

        this.upgradeABASignalling.button.setVisible(false);
        this.upgradeABASignalling.text1Button.setVisible(false);           
            
        this.upgradeABASignalling.button.on('pointerdown', function(event){         //Upon clicking this button stomata will change sprite to the ABA sprite (blue ring)
            if(gameData.ATPLevels >= 1000){
                this.upgradeABASignalling.button.destroy();
                this.upgradeABASignalling.text1Button.destroy();
                this.upgradeABASignalling.text2Button.destroy();
                this.upgradeABASignalling.helpText.destroy();
                this.stomata1.stomata.ABASignalling = true;
                if(this.stomata1.stomata.StomataState == "open"){
                    this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this);
                };
                if(this.stomata1.stomata.StomataState == "closed"){
                    this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this);
                };
            };
        },this);


        //Setting up additional meristemoid cells that can produce stomata

        this.meristemoidMotherCell = this.add.sprite(350,155, 'mmc').setScale(5).setOrigin(0,0).setInteractive();
        this.meristemoid2 = this.add.sprite(315,85, 'meristemoid2').setScale(5).setOrigin(0,0).setVisible(false);
        this.meristemoid2Text = this.add.text(365,135, '1000 ATP',{fontFamily:'"font1"', fontSize: '15px', fill: '#000' }).setOrigin(0,0).setVisible(false);

        this.meristemoidMotherCell.on('pointerover', function (event) {
            this.meristemoid2.setVisible(true);
            this.meristemoid2Text.setVisible(true);
        },this);

        this.meristemoidMotherCell.on('pointerout', function (event) {
            this.meristemoid2.setVisible(false);
            this.meristemoid2Text.setVisible(false);
        },this);

        this.meristemoidMotherCell.on('pointerdown', function (event) {  
            this.setTint(0xff0000);
        });

        this.meristemoidMotherCell.on('pointerup', function (event) { //Upon clicking this cell aonther stomata is generated
            this.meristemoidMotherCell.clearTint();
            if(gameData.ATPLevels > 1000)
            {
                this.meristemoidMotherCell.destroy();
                this.meristemoid2Text.destroy();
                this.stomata2 = new Stomata({scene: this, x: 335, y: 145, key1: 'stomata'}).setOrigin(0,0);
                this.StomataGroup.add(this.stomata2);
                gameData.StomataNumber += 1;
                if(this.stomata1.stomata.StomataState == 'open'){           //Sets up the correct sprite to show for the second stomata
                    if(this.stomata1.stomata.ABASignalling == true){
                        this.stomata2.stomata.anims.play('stomABA');
                    };
                    if(this.stomata1.stomata.ABASignalling == false){
                        this.stomata2.stomata.anims.play('stom');
                    };
                };
                if(this.stomata1.stomata.StomataState == 'closed'){
                    if(this.stomata1.stomata.ABASignalling == true){
                        this.stomata2.stomata.anims.play('stomABAClosed');
                    };
                    if(this.stomata1.stomata.ABASignalling == false){
                        this.stomata2.stomata.anims.play('stomClosed');
                    };
                };
            };
        },this);


        //////STORYLINE OF THE GAME

        //INITIAL START - ie click the meristemoid begin ATP buying

        this.meristemoid1.on('pointerdown', function (event) {  
            this.setTint(0xff0000);
        });

        this.meristemoid1.on('pointerup', function (event) { //Upon clicking the initial meristemoid a new stomata is formed and new buttons are shown
            gameData.CO2Gain += 1;
            this.background.START_Clickthiscell.destroy();
            this.background.CO2LevelsText.setVisible(true);
            this.background.CO2GainRateText.setVisible(true);
            this.background.ATPSection.setVisible(true);
            this.buyATP.button.setVisible(true);
            this.buyATP.text1Button.setVisible(true);
            this.meristemoid1.clearTint();
            this.stomata1 = new Stomata({scene: this, x: 525, y: 195, key1: 'stomata'});
            this.StomataGroup.add(this.stomata1);
            gameData.StomataNumber += 1;
            this.meristemoid1.destroy();
            new DialogueBox({scene: this, text: 'Now you have a stoma use CO2 to generate ATP'});
        },this);

        //BUY ATP - unlock upgrade ATP buying + photosynthesis

        this.buyATP.button.on('pointerdown', function (event) {   //Upon clicking buy ATP for the first time new buttons are shown
            if (gameData.CO2Levels >= 25){
                this.background.ATPLevelsText.setVisible(true);
                this.upgradeATP.button.setVisible(true);
                this.upgradeATP.text1Button.setVisible(true);
                if(gameData.ATPLevels < 2 && this.closeStomata.button._visible == false){
                    new DialogueBox({scene: this, text: 'You can increase the amount of ATP per CO2 by upgrading ATP production'});
                };
            };
        },this);


        //UPGRADE ATP - add phostosynthesis and water options

        this.upgradeATP.button.on('pointerdown', function (event) {   //Upon clicking upgrade ATP for the first time even more new buttons are shown
            if (this.upgradeATP.cost > 10){
                this.buyPhotosynthesis.button.setVisible(true);
                this.buyPhotosynthesis.text1Button.setVisible(true);
                this.background.WaterLevelsText.setVisible(true);
                this.background.WaterLossRateText.setVisible(true);
                this.background.WaterSection.setVisible(true);
                this.waterPlants.button.setVisible(true);
                this.waterPlants.text1Button.setVisible(true);
                this.background.StomataSection.setVisible(true);
                this.closeStomata.button.setVisible(true);
                this.closeStomata.text1Button.setVisible(true);
                this.upgradeWaxyCuticle.button.setVisible(true);
                this.upgradeWaxyCuticle.text1Button.setVisible(true);
                this.upgradeABASignalling.button.setVisible(true);
                this.upgradeABASignalling.text1Button.setVisible(true);
            };
        },this);

        //WATERING - unlock automatic watering

        this.waterPlants.button.on('pointerdown', function (event) {   //Upon clicking water plants for the first time the automatic watering button is shown
            if (gameData.ATPLevels >= 100){
                this.autoWatering.button.setVisible(true);
                this.autoWatering.text1Button.setVisible(true);
            };
        },this);


    };


    update() {

        //UPDATE RESOURCE TEXTS
        this.background.ATPLevelsText.setText('ATP: ' + gameData.ATPLevels.toFixed(2));
        this.background.ATPGainRateText.setText((gameData.PhotosynthesisLevels * 0.001).toFixed(3) + ' ATP per s');

        this.background.CO2LevelsText.setText('CO2: ' + gameData.CO2Levels.toFixed(2));
        this.background.CO2GainRateText.setText((gameData.CO2Gain * gameData.StomataNumber).toFixed(2) + ' CO2 per s');

        this.background.WaterLevelsText.setText('Water: ' + gameData.WaterLevels.toFixed(2));
        this.background.WaterLossRateText.setText((gameData.WaterLoss * gameData.StomataNumber).toFixed(2) + ' water per s');

        this.background.BiomassText.setText('Biomass: ' + gameData.BioMass.toFixed(2));


        //UPDATE ACTUAL RESOURCES LOOP

        gameData.timer += 1;

        if( gameData.timer > 10 && this.stomata1 != null){ //alters resource flux depending on open or closed state of stomata
 
            if(this.stomata1.stomata.StomataState == 'closed' && this.stomata1.stomata.prevStomataState == 'open'){
                gameData.WaterLoss *= 0.1;
                gameData.CO2Gain *= 0.1;
            };

            if(this.stomata1.stomata.StomataState == 'open' && this.stomata1.stomata.prevStomataState == 'closed'){
                gameData.WaterLoss *= 10;
                gameData.CO2Gain *= 10;
            };

            if(gameData.drought == true && gameData.prevDrought == false){
                gameData.WaterLoss *= 5;
            };

            if(gameData.drought == false && gameData.prevDrought == true){
                gameData.WaterLoss *= 0.2;
            };

            gameData.CO2Levels += (gameData.CO2Gain * gameData.StomataNumber);
            gameData.WaterLevels -= gameData.WaterLoss * gameData.StomataNumber;
            gameData.WaterLevels += gameData.autoWater * gameData.StomataNumber;
            gameData.ATPLevels += (gameData.PhotosynthesisLevels * 0.001);

            gameData.BioMass += (gameData.CO2Levels/1000000);

            gameData.timer = 0;

            this.stomata1.stomata.prevStomataState = this.stomata1.stomata.StomataState;
            gameData.prevDrought = gameData.drought;
        };


        //DROUGHT SCENARIO LOOP - changes scenario 10% chance of drought and automatically moves stomata if ABA signalling is upgraded

        gameData.timer2 += 1;
        
        if(gameData.timer2 > 500){
            if(gameData.ATPLevels >= 0 && this.stomata1 != null){
                this.background.ConditionsText.setVisible(true);
                this.background.ConditionsText.setText('Conditions: normal');
                let randInt = Phaser.Math.Between(0, 100);
                if(randInt >= 90){
                    this.epidermisSprite.setFrame(2);
                    this.background.ConditionsText.setText('Conditions: drought!');
                    if(gameData.drought == false){
                        if(this.stomata1.stomata.ABASignalling == true && this.stomata1.stomata.StomataState == 'open'){
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosing')}, this);
                            this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',() =>{
                                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this);
                            })},this);
                            this.stomata1.stomata.StomataState = 'closed';
                            this.closeStomata.text1Button.setText('Open Stomata');
                        };
                    };
                    gameData.drought = true;
                };
                if(randInt < 90){
                    if(gameData.drought == true){
                        if(this.stomata1.stomata.ABASignalling == true && this.stomata1.stomata.StomataState == 'closed'){
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomABAClosing')}, this);
                            this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',() =>{
                                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this);
                            })},this);
                            this.stomata1.stomata.StomataState = 'open';
                            this.closeStomata.text1Button.setText('Close Stomata');
                        };
                    };
                    gameData.drought = false;
                    if(gameData.waxyCuticle == true){
                        this.epidermisSprite.setFrame(1);
                    };
                    if(gameData.waxyCuticle == false){
                        this.epidermisSprite.setFrame(0);
                    };
                };
            };
            gameData.timer2 = 0;
        };

        //WATER LEVELS LOW - if water levels are low a red tint is shown. Then is water completely runs out games cuts to intro scene

        if(gameData.WaterLevels < 100){
            this.epidermisSprite.setTint(0xff0000);
            this.stomata1.stomata.setTint(0xff0000);
        };

        if(gameData.WaterLevels > 100 & this.stomata1 != null){
            this.epidermisSprite.clearTint();
            this.stomata1.stomata.clearTint();
        };

        if(gameData.WaterLevels < 0){
            this.scene.start('IntroScene');
        };

        //DESTROY RAIN - destroys rain droplets once they fall from screen

        if(this.rain != null){
            if(this.rain.children.entries[1].y > 1000){
                this.rain.children.each(function(go){go.destroy()},this);
                this.rain = null;
            };
        };

        //PHOTOSYNTHESIS SPEED - increases the speed of chloroplasts upon increase in photosynthesis levels

        if(gameData.PhotosynthesisLevels == 1 && gameData.prevPhotosynthesisLevels == 0){
            this.chloroplastSprite = this.add.sprite(315,85, 'epidermisChloroplasts').setScale(5).setOrigin(0,0);
            this.chloroplastSprite.anims.play('photosynthesisUpgrade');
            gameData.prevPhotosynthesisLevels = gameData.PhotosynthesisLevels;
        };

        if(gameData.PhotosynthesisLevels > 1 && gameData.PhotosynthesisLevels != gameData.prevPhotosynthesisLevels){
            this.chloroplastSprite.anims.msPerFrame = 1000 * (1/gameData.PhotosynthesisLevels);
            gameData.prevPhotosynthesisLevels = gameData.PhotosynthesisLevels;
        };

        //PLANT GROWTH - upon increases in  biomass the potted plant will grow an extra layer of leaves

        if(gameData.BioMass > gameData.BioMassUpgrade ){
            this.add.sprite(gameData.Plantx, gameData.Planty, 'plant').setScale(5).setOrigin(0,0).play('plantLeaves');
            gameData.BioMassUpgrade *= 2;
            gameData.Planty -= 25;
        };

    };
};
