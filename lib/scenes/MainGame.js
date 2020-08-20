import Button from '../../src/button.js'
import Stomata from '../../src/stomata.js'
import GameScreen from '../../src/gamescreen.js'
import DialogueBox from '../../src/dialogue.js'


var gameData = {
    WaterLevels: 1000,
    CO2Levels: 1000,
    WaterLoss: 0,
    CO2Gain: 0,
    ATPLevels: 0,
    ATPGain: 1,
    PhotosynthesisLevels: 0,
    autoWater: 0,
    waxyCuticle: 'false',
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
    }


    preload() {
        this.load.image('bg1', './assets/background/bg1.png');       //Background
        this.load.spritesheet('epidermisBG', './assets/background/epidermisBGsprite1.png', { frameWidth: 100, frameHeight: 75 });
        this.load.spritesheet('epidPHOTO', './assets/background/epidermisBGPHOTO.png', { frameWidth: 100, frameHeight: 75 });
        this.load.image('meristemoid1', './assets/sprites/meristemoid1.png');
        this.load.image('button', './assets/background/ATPbutton2.png');   //Button
        this.load.image('button_2', './assets/background/Waterbutton.png');
        this.load.image('button_3', './assets/background/stombutton.png');
        this.load.spritesheet('stomata', './assets/sprites/stomataSprite.png', { frameWidth: 25, frameHeight: 25 });
        this.load.image('rain', './assets/sprites/raindrop.png');
        this.load.image('meristemoid2', './assets/background/meristemoid2.png');
        this.load.image('meristemoid3', './assets/background/meristemoid3.png');
        this.load.spritesheet('plant', './assets/sprites/Plant.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('plant2', './assets/sprites/Plant2.png', { frameWidth: 17, frameHeight: 12 });
    };


    create() {


        //GROUPS

        this.StomataGroup = this.add.group()


        //BACKGROUND
        this.background = new GameScreen({scene: this})
        this.cameras.main.setBackgroundColor('#b9ff8d')

        this.epBG1 = this.add.sprite(315, 85, 'epidermisBG').setScale(5).setOrigin(0,0);
        this.STOMA1 = null

        this.Plant = this.add.sprite(825, 495, 'plant').setScale(5).setOrigin(0,0);

        this.Plant2 = this.add.sprite(865, 515, 'plant2').setScale(5).setOrigin(0,0).setVisible(false);

        this.anims.create({
            key: 'plantStart',
            frames: this.anims.generateFrameNumbers('plant', {start: 1, end: 10}),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'plantSeedling1',
            frames: this.anims.generateFrameNumbers('plant', {start: 10, end: 17}),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'plantLeaves',
            frames: this.anims.generateFrameNumbers('plant2', {start: 1, end: 7}),
            frameRate: 1,
            repeat: -1
        });



        this.Plant.anims.play('plantStart')
        this.Plant.once('animationcomplete',()=>{
             this.Plant.anims.play('plantSeedling1')
        //     this.Plant2.setVisible(true)
        //     this.Plant2.anims.play('plantLeaves')
         })


        //STARTING MERISTEMOID

        this.MS1 = this.add.sprite(550, 205, 'meristemoid1').setInteractive()
            .setScale(5)
            .setOrigin(0,0);


        ////BUTTONS

        //BUTTON1 - BUY ATP

        this.buyATP = new Button({
            scene: this,
            x: 20,
            y: 210, 
            key1: 'button',
            text1: 'Buy ' + gameData.ATPGain,
            text2: '25 CO2',
            helptext: 'Use CO2 to buy ATP. ATP can then be used to upgrade your plant'})

        this.buyATP.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.CO2Levels >= 25){
                gameData.ATPLevels += gameData.ATPGain
                gameData.CO2Levels -= 25
            }
        },this);
  

        //BUTTON2

        this.upgradeATP = new Button({
            scene: this,
            x: 20,
            y: 260, 
            key1: 'button',
            text1: 'Upgrade ATP',
            text2: '10 ATP',
            helptext: 'Increase the amount of ATP you get per CO2',
            cost: 10 })

        this.upgradeATP.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= this.upgradeATP.cost){
                gameData.ATPGain *= 2
                gameData.ATPLevels -= this.upgradeATP.cost
                this.upgradeATP.cost *= 1.5
                this.upgradeATP.text2Button.setText(this.upgradeATP.cost.toFixed(2) + ' ATP')
                this.buyATP.text1Button.setText('Buy ' + gameData.ATPGain)
                if (gameData.WaterLoss == 0){
                    gameData.WaterLoss += 1
                }
            }
        },this);        
        
        //BUTTON3

        this.buyPhotosynthesis =  new Button({
            scene: this,
            x: 20,
            y: 310, 
            key1: 'button',
            text1: 'Photosynthesis',
            text2: '100 ATP',
            helptext: 'Buy Photosynthesis in order to automatically accumulate ATP',
            cost: 100})

        this.anims.create({
            key: 'PHOTOupgrade',
            frames: this.anims.generateFrameNumbers('epidPHOTO', {start: 0, end: 3}),
            frameRate: 1,
            repeat: -1
        });

        this.PHOTOUPGRADESPRITE = null;
            
        this.buyPhotosynthesis.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= this.buyPhotosynthesis.cost){
                gameData.PhotosynthesisLevels += 1
                gameData.ATPLevels -= this.buyPhotosynthesis.cost
                this.buyPhotosynthesis.cost *= 1.5
                this.buyPhotosynthesis.text2Button.setText(this.buyPhotosynthesis.cost.toFixed(2) + ' ATP')
                this.background.ATPGainRateText.setVisible(true)
            }
        },this);

        //BUTTON4 - WATER PLANTS

        this.waterPlants = new Button({
            scene: this,
            x: 20,
            y: 420, 
            key1: 'button_2',
            text1: 'Water Plants',
            text2: '100 ATP',
            helptext: 'Use ATP to increase the water levels of your plant'})

        this.waterPlants.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= 100){
                gameData.WaterLevels += 1000
                gameData.ATPLevels -= 100
                this.rain = this.physics.add.group({
                    key: 'rain',
                    repeat: 7,
                    setXY: { x: 20, y: 0, stepX: 170}
                }).setOrigin(0,0).setDepth(1) ;
                this.rain.setDepth(2)
            }
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
                .setDepth(1)

        this.autoWatering.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= 1000){
                gameData.autoWater += 1
                gameData.ATPLevels -= 1000
            }
        });

        //BUTTON 6 - CLOSE/OPEN STOMATA

        this.closeStomata = new Button({
            scene: this, 
            x: 20,
            y: 630, 
            key1: 'button_3',
            text1: 'Close Stomata',
            text2: '1000 ATP',
            helptext: 'Fuel stomatal closure by using up ATP'})

        this.closeStomata.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= 1000){
                if(this.STOMA1.stomata.StomataState == 'open'){
                    if(this.STOMA1.stomata.ABASignalling == true){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosing')}, this)
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this)
                        })}, this)
                    }
                    if(this.STOMA1.stomata.ABASignalling == false){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomClosing')}, this)
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomClosed')}, this)
                        })}, this)
                    }
                }
                if(this.STOMA1.stomata.StomataState == 'closed'){
                    if(this.STOMA1.stomata.ABASignalling == true){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomABAClosing')}, this)
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this)
                        })}, this)
                    }
                    if(this.STOMA1.stomata.ABASignalling == false){
                        this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomClosing')}, this)
                        this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',()=>{
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stom')}, this)
                        })}, this)
                    }
                }
            }
                
        },this);

        this.closeStomata.button.on('pointerup', function (event) { //once you click off it goes back to normal
            if (gameData.ATPLevels >= 1000){
                gameData.ATPLevels -= 1000
                if(this.STOMA1.stomata.StomataState == 'open'){
                    this.STOMA1.stomata.StomataState = 'closed'
                    this.closeStomata.text1Button.setText('Open Stomata')
                }
                else if(this.STOMA1.stomata.StomataState == 'closed'){
                    this.STOMA1.stomata.StomataState = 'open'
                    this.closeStomata.text1Button.setText('Close Stomata')
                }
            }
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
            helptext: 'Decrease the water loss rate of your plant by upgrading the waxy cuticle'})
            
        this.upgradeWaxyCuticle.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            this.upgradeWaxyCuticle.button.destroy()
            this.upgradeWaxyCuticle.text1Button.destroy()
            this.upgradeWaxyCuticle.text2Button.destroy()
            this.upgradeWaxyCuticle.helpText.destroy()
            gameData.WaterLoss *= 0.5
            gameData.waxyCuticle = 'true'
            if(gameData.drought == true){
                this.epBG1.setFrame(2)
            }
            if(gameData.drought == false){
                this.epBG1.setFrame(1)
            }
        },this);

        console.log(this.upgradeWaxyCuticle)


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
            
        this.upgradeABASignalling.button.on('pointerdown', function(event){
            this.upgradeABASignalling.button.destroy()
            this.upgradeABASignalling.text1Button.destroy()
            this.upgradeABASignalling.text2Button.destroy()
            this.upgradeABASignalling.helpText.destroy()
            this.STOMA1.stomata.ABASignalling = true
            if(this.STOMA1.stomata.StomataState == "open"){
                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this)
            }
            if(this.STOMA1.stomata.StomataState == "closed"){
                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this)
            }
        },this)


        //MORE STOMATA

        this.meristemoid2 = this.add.sprite(350,155, 'meristemoid2').setScale(5).setOrigin(0,0).setInteractive()
        this.meristemoid3 = this.add.sprite(315,85, 'meristemoid3').setScale(5).setOrigin(0,0).setVisible(false)
        this.MS2 = this.add.sprite(315,85, 'meristemoid3').setScale(5).setOrigin(0,0).setInteractive().setVisible(false)
        this.MS2Text = this.add.text(365,135, '1000 ATP',{fontFamily:'"font1"', fontSize: '15px', fill: '#000' }).setOrigin(0,0).setVisible(false)

        this.meristemoid2.on('pointerover', function (event) {
            this.meristemoid3.setVisible(true)
            this.MS2Text.setVisible(true)
        },this)

        this.meristemoid2.on('pointerout', function (event) {
            this.meristemoid3.setVisible(false)
            this.MS2Text.setVisible(false)
        },this)

        this.meristemoid2.on('pointerdown', function (event) {
            this.MS2.setVisible(true)
            this.MS2Text.destroy()
        }, this)

        console.log(this.MS2)

        this.MS2.on('pointerdown', function (event) {  
            this.setTint(0xff0000);
        });

        this.MS2.on('pointerup', function (event) { //once you click off it goes back to normal
            this.MS2.clearTint();
            this.MS2.destroy()
            this.STOMA2 = new Stomata({scene: this, x: 335, y: 145, key1: 'stomata'}).setOrigin(0,0)
            this.StomataGroup.add(this.STOMA2)
            gameData.StomataNumber += 1
            if(this.STOMA1.stomata.StomataState == 'open'){
                if(this.STOMA1.stomata.ABASignalling == true){
                    this.STOMA2.stomata.anims.play('stomABA')
                }
                if(this.STOMA1.stomata.ABASignalling == false){
                    this.STOMA2.stomata.anims.play('stom')
                }
            }
            if(this.STOMA1.stomata.StomataState == 'closed'){
                if(this.STOMA1.stomata.ABASignalling == true){
                    this.STOMA2.stomata.anims.play('stomABAClosed')
                }
                if(this.STOMA1.stomata.ABASignalling == false){
                    this.STOMA2.stomata.anims.play('stomClosed')
                }
            }

        },this);


        //////STORYLINE OF THE GAME

        //INITIAL START - ie click the meristemoid begin ATP buying

        this.MS1.on('pointerdown', function (event) {  
            this.setTint(0xff0000);
        });

        this.MS1.on('pointerup', function (event) { //once you click off it goes back to normal
            gameData.CO2Gain += 1
            this.background.START_Clickthiscell.destroy()
            this.background.CO2LevelsText.setVisible(true)
            this.background.CO2GainRateText.setVisible(true)
            this.background.ATPSection.setVisible(true)
            this.buyATP.button.setVisible(true)
            this.buyATP.text1Button.setVisible(true)
            this.MS1.clearTint();
            this.STOMA1 = new Stomata({scene: this, x: 525, y: 195, key1: 'stomata'}) 
            this.StomataGroup.add(this.STOMA1)
            gameData.StomataNumber += 1
            this.MS1.destroy()
            new DialogueBox({scene: this, text: 'Now you have a stoma use CO2 to generate ABA'})
        },this);

        //BUY ATP - unlock upgrade ATP buying + photosynthesis

        this.buyATP.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.CO2Levels >= 25){
                this.background.ATPLevelsText.setVisible(true)
                this.upgradeATP.button.setVisible(true)
                this.upgradeATP.text1Button.setVisible(true)
                if(gameData.ATPLevels < 2 && this.closeStomata.button._visible == false){
                    new DialogueBox({scene: this, text: 'You can increase the amount of ATP per CO2 by upgrading ATP production'})
                }
            }
        },this);


        //UPGRADE ATP - add phostosynthesis and water options

        this.upgradeATP.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (this.upgradeATP.cost > 10){
                this.buyPhotosynthesis.button.setVisible(true)
                this.buyPhotosynthesis.text1Button.setVisible(true)
                this.background.WaterLevelsText.setVisible(true)
                this.background.WaterLossRateText.setVisible(true)
                this.background.WaterSection.setVisible(true)
                this.waterPlants.button.setVisible(true)
                this.waterPlants.text1Button.setVisible(true)
                this.background.StomataSection.setVisible(true)
                this.closeStomata.button.setVisible(true)
                this.closeStomata.text1Button.setVisible(true)
                this.upgradeWaxyCuticle.button.setVisible(true)
                this.upgradeWaxyCuticle.text1Button.setVisible(true)
                this.upgradeABASignalling.button.setVisible(true)
                this.upgradeABASignalling.text1Button.setVisible(true)
            }
        },this);

        //WATERING - unlock automatic watering

        this.waterPlants.button.on('pointerdown', function (event) {   //if you click on it this makes it go red and adds 10 to the score
            if (gameData.ATPLevels >= 100){
                this.autoWatering.button.setVisible(true)
                this.autoWatering.text1Button.setVisible(true)
            }
        },this);


    }


    update() {




        //UPDATE RESOURCE TEXTS
        this.background.ATPLevelsText.setText('ATP: ' + gameData.ATPLevels.toFixed(2));
        this.background.ATPGainRateText.setText((gameData.PhotosynthesisLevels * 0.001).toFixed(3) + ' ATP per s')

        this.background.CO2LevelsText.setText('CO2: ' + gameData.CO2Levels.toFixed(2));
        this.background.CO2GainRateText.setText((gameData.CO2Gain * gameData.StomataNumber).toFixed(2) + ' CO2 per s')

        this.background.WaterLevelsText.setText('Water: ' + gameData.WaterLevels.toFixed(2));
        this.background.WaterLossRateText.setText((gameData.WaterLoss * gameData.StomataNumber).toFixed(2) + ' water per s')

        this.background.BiomassText.setText('Biomass: ' + gameData.BioMass.toFixed(2));


        //UPDATE ACTUAL RESOURCES LOOP

        gameData.timer += 1

        if( gameData.timer > 10 && this.STOMA1 != null){

            if(this.STOMA1.stomata.StomataState == 'closed' && this.STOMA1.stomata.prevStomataState == 'open'){
                gameData.WaterLoss *= 0.1 
                gameData.CO2Gain *= 0.1 
            }

            if(this.STOMA1.stomata.StomataState == 'open' && this.STOMA1.stomata.prevStomataState == 'closed'){
                gameData.WaterLoss *= 10
                gameData.CO2Gain *= 10
            }


            if(gameData.drought == true && gameData.prevDrought == false){
                gameData.WaterLoss *= 5
            }

            if(gameData.drought == false && gameData.prevDrought == true){
                gameData.WaterLoss *= 0.2
            }


            gameData.CO2Levels += (gameData.CO2Gain * gameData.StomataNumber)
            gameData.WaterLevels -= gameData.WaterLoss * gameData.StomataNumber
            gameData.WaterLevels += gameData.autoWater * gameData.StomataNumber
            gameData.ATPLevels += (gameData.PhotosynthesisLevels * 0.001)

            gameData.BioMass += (gameData.CO2Levels/1000000)
 

            gameData.timer = 0

            this.STOMA1.stomata.prevStomataState = this.STOMA1.stomata.StomataState
            gameData.prevDrought = gameData.drought

        }


        //DROUGHT SCENARIO LOOP

        gameData.timer2 += 1
        
        if(gameData.timer2 > 500){
            if(gameData.ATPLevels >= 0 && this.STOMA1 != null){
                this.background.ConditionsText.setVisible(true)
                this.background.ConditionsText.setText('Conditions: normal')
                let randInt = Phaser.Math.Between(0, 100)
                if(randInt >= 90){
                    console.log('DROUGHT')
                    this.epBG1.setFrame(2)
                    this.background.ConditionsText.setText('Conditions: drought!')
                    if(gameData.drought == false){
                        if(this.STOMA1.stomata.ABASignalling == true && this.STOMA1.stomata.StomataState == 'open'){
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosing')}, this)
                            this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',() =>{
                                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABAClosed')}, this)
                            })},this)
                            this.STOMA1.stomata.StomataState = 'closed'
                            this.closeStomata.text1Button.setText('Open Stomata')
                        }
                    }
                    gameData.drought = true
                }
                if(randInt < 90){
                    if(gameData.drought == true){
                        if(this.STOMA1.stomata.ABASignalling == true && this.STOMA1.stomata.StomataState == 'closed'){
                            this.StomataGroup.children.each(function(go) {go.stomata.anims.playReverse('stomABAClosing')}, this)
                            this.StomataGroup.children.each(function(go) {go.stomata.once('animationcomplete',() =>{
                                this.StomataGroup.children.each(function(go) {go.stomata.anims.play('stomABA')}, this)
                            })},this)
                            this.STOMA1.stomata.StomataState = 'open'
                            this.closeStomata.text1Button.setText('Close Stomata')
                        }
                    }
                    gameData.drought = false
                    console.log('NORMAL')
                    if(gameData.waxyCuticle == 'true'){
                        this.epBG1.setFrame(1)
                    }
                    else{
                        this.epBG1.setFrame(0)
                    }
                } 
            }
            gameData.timer2 = 0
        }



        //WATER LEVELS LOW

        if(gameData.WaterLevels < 100){
            this.epBG1.setTint(0xff0000)
            this.STOMA1.stomata.setTint(0xff0000)   
            console.log(this.STOMA1.stomata) 
        }

        if(gameData.WaterLevels > 100 & this.STOMA1 != null){
            this.epBG1.clearTint()
            this.STOMA1.stomata.clearTint()
        }

        if(gameData.WaterLevels < 0){
            this.scene.start('IntroScene')
        }



        //DESTROY RAIN

        if(this.rain != null){
            console.log(this.rain.children.entries[1].y)
            if(this.rain.children.entries[1].y > 1000){
                this.rain.children.each(function(go){go.destroy()},this)
                this.rain = null
            }
        }


        //PHOTOSYNTHESIS SPEED

        if(gameData.PhotosynthesisLevels == 1 && gameData.prevPhotosynthesisLevels == 0){
            this.PHOTOUPGRADESPRITE = this.add.sprite(315,85, 'epidPHOTO').setScale(5).setOrigin(0,0)
            this.PHOTOUPGRADESPRITE.anims.play('PHOTOupgrade')
            gameData.prevPhotosynthesisLevels = gameData.PhotosynthesisLevels
        }

        if(gameData.PhotosynthesisLevels > 1 && gameData.PhotosynthesisLevels != gameData.prevPhotosynthesisLevels){
            this.PHOTOUPGRADESPRITE.anims.msPerFrame = 1000 * (1/gameData.PhotosynthesisLevels)
            gameData.prevPhotosynthesisLevels = gameData.PhotosynthesisLevels
        }


        //PLANT GROWTH


        if(gameData.BioMass > gameData.BioMassUpgrade ){
            this.add.sprite(gameData.Plantx, gameData.Planty, 'plant2').setScale(5).setOrigin(0,0).play('plantLeaves')
            gameData.BioMassUpgrade *= 2
            gameData.Planty -= 25
            console.log(gameData.Planty)
        }





    }
}