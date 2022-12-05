require('dotenv').config();
const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');
const path = require('path');
// const web3 = require('web3');
const ethers = require('ethers')
// const abi = require('./BigBonchNFT.json')

const mapVestibule = require('./mapGrids/mapVestibule')
const mapCyberBonch = require('./mapGrids/mapCyberBonch')

const { Server } = require('socket.io');
const http = require('http');

const router = require('./router/index.js');

const CLIENT_URL = process.env.NODE_ENV === "production" ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL

const app = express();

//static pictures for nft
const dir = path.join(__dirname, 'img')

// contract = new ethers.Contract(0xd3D7095fa12C735dfC0893CC2717670E241e1d71, abi );

app.use(express.static('img'));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'Super Secret bonch',
        resave: true,
        saveUninitialized: false,
        // cookie: {
        //     sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
        //     secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
        // }
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware); // middleware ошибок всегда последний app.use

const server = http.createServer(app)
const io = new Server(server,{ 
    cors: {
      origin: [CLIENT_URL]
    }
})

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        server.listen(process.env.PORT || 7000, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
        

        // игра
        let SOCKET_LIST = {} //список сокетов

        let Entity = function(param) { //Сущность с параметрами для игры
            let self = {
                x: 550, // координаты x
                y: 600, // координаты y
                spdX: 0, // скорость
                spdY: 0,
                id: "", // id
                map: 'Vestibule',
            }

            if(param) {
                if(param.x)
                    self.x = param.x;
                if(param.y)
                    self.y = param.y;
                if(param.map)
                    self.map = param.map;
                if(param.id)
                    self.id = param.id;		
            }

            self.update = function() { // для перемещения
                self.updatePosition()
            }

            self.isPositionWall = function(pt){
                // const TILE_SIZE = 32
                // 6589 x 4168 tile size is 32 x 32
                // 2560 x 1440 tile size is 12.4328426 x 11.0556622
                // 205x130 tiles in Tiled 32x32px
                const TILE_SIZE_X = 12.4328426
                const TILE_SIZE_Y = 11.0556622
                let array;
                switch(self.map)
                {
                    case 'Vestibule':
                        array = mapVestibule
                        break
                    case 'CyberBonch':
                        array = mapCyberBonch
                        break
                    default:
                        array = []
                }
                
                //
                // console.log(pt.x, pt.y)
                let gridX = Math.floor(pt.x / TILE_SIZE_X);
                let gridY = Math.floor(pt.y / TILE_SIZE_Y);
                if(gridX < 0 || gridX >= array[0].length)
                    return true;
                if(gridY < 0 || gridY >= array.length)
                    return true;
                return array[gridY][gridX];
            }

            self.updatePosition = function() { // перемещение игрока со скоростью spdX и spdY
                let oldX = self.x;
		        let oldY = self.y;
                
                self.x += self.spdX
                self.y += self.spdY

                //ispositionvalid не даем выйти за границы canvas
                // if(self.x < 160)
                //     self.x = 160;
                // if(self.x > 2400-131/2) //6528px ширина карты, 131px ширина фрейма игрока(Img.player.width /3/7)
                //     self.x = 2400 - 131/2; //160 2400 1350 границы карты по текущим размерам отрисованной карты
                // if(self.y < 121/2)
                //     self.y = 121/2;
                // if(self.y > 1350 - 121/2) //4096px высота карты, 121px высота фрейма игрока(Img.player.height /4/7)
                //     self.y = 1350 - 121/2;

                if (self.isPositionWall(self)) {
                    self.x = oldX
                    self.y = oldY
                }
                
            }
            self.getDistance = function(pt){ // вычисление дистанции
                return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
            }
            return self
        }

        getDistanceBetweenEntity = function(entity1, entity2) { // вычисление дистанции
            let vx = entity.x - entity2.x
            let vy = entity.y - entity2.y
            return Math.sqrt(vx*vx+vy*vy);
        }

        testCollisionEntity = function (entity1, entity2) {
            let distance = getDistanceBetweenEntity(entity1, entity2)
            return distance < 10
        }

        let Player = function(param) { // Игрок
            let self = Entity(param) //создание экземпляра сущности
            self.number = "" + Math.floor(10 * Math.random()) // присвоение рандомного номера игрока (никнейм, по сути)
            self.pressingRight = false // нажаты ли клавиши – нет, т.к. false
            self.pressingLeft = false
            self.pressingUp = false
            self.pressingDown = false
            self.pressingAttack = false
            self.atkSpd = 3; // скорость увеличения счетчика для выпуска пули
	        self.attackCounter = 0; // счетчик для выпуска пули
	        self.mouseAngle = 0 // угол наведения курсора
            self.maxSpd = 10 // скорость передвижения игрока
            self.hp = 10
            self.hpMax = 10
            self.score = 0
            self.spriteAnimCounter = 0
            // self.angle = 0
            let super_update = self.update
            self.update = function() {
                self.updateSpd() //обновление скорости при нажатии клавиш
                self.attackCounter += self.atkSpd; // рост счетчика для выпуска пули
                super_update()   
                
                if (self.pressingAttack) { //стрельба по нажатии клавиши мыши
                    if (self.attackCounter > 25) { // счетчик для выпуска пули
                        self.attackCounter = 0
                        self.shootBullet(self.mouseAngle)
                    }
                }
            }

            self.shootBullet = function(angle) {
                Bullet({
                    parent:self.id,
                    angle:angle,
                    x:self.x,
                    y:self.y,
                    map:self.map,
                });
            }

            self.updateSpd = function() {

                //if bumber touches a wall, you can't go
                const rightBumper = {x: self.x + 30, y: self.y}
                const leftBumper = {x: self.x - 30, y: self.y}
                const upBumper = {x: self.x, y: self.y - 30}
                const downBumper = {x: self.x, y: self.y + 30}
                // console.log(self.isPositionWall(self))
                if (self.isPositionWall(rightBumper)) {
                    self.spdX = -self.maxSpd/10
                } else if (self.pressingRight) {
                    self.spdX = self.maxSpd;
                } else if (self.isPositionWall(leftBumper)) {
                    self.spdX = self.maxSpd/10
                } else if (self.pressingLeft) {
                    self.spdX = -self.maxSpd;
                } else {
                    self.spdX = 0;
                }

                if (self.isPositionWall(upBumper)) {
                    self.spdY = self.maxSpd/10
                } else if (self.pressingUp) {
                    self.spdY = -self.maxSpd;
                } else if (self.isPositionWall(downBumper)) {
                    self.spdY = -self.maxSpd/10
                } else if (self.pressingDown) {
                    self.spdY = self.maxSpd;
                } else {
                    self.spdY = 0;
                }

                // console.log(self.spdX, self.spdY)
                // self.spdY

                //change map
                if(self.map === 'Vestibule' && self.x > 200 && self.x < 300 && self.y > 900 && self.y < 1100) {
                    self.map = 'CyberBonch'
                    self.x = 2175
                    self.y = 995
                    console.log('change to cyber')
                }

                if(self.map === 'CyberBonch' && self.x > 2300 && self.x < 2400 && self.y > 900 && self.y < 1050) {
                    self.map = 'Vestibule'
                    self.x = 430
                    self.y = 950
                    console.log('change to cyber') 
                }

                // анимация спрайта
                if (self.pressingRight || self.pressingLeft || self.pressingUp || self.pressingDown)
                    self.spriteAnimCounter += 0.25
            }

            self.getInitPack = function() { // отправка пакета с данными о сущности
                return {
                    id:self.id,
                    x:self.x,
                    y:self.y,
                    number:self.number,	
                    hp:self.hp,
                    hpMax:self.hpMax,
                    score:self.score,
                    map:self.map,
                    mouseAngle:self.mouseAngle,
                    spriteAnimCounter:self.spriteAnimCounter,
                }
            }

            self.getUpdatePack = function() { // получение пакета с данными о сущности
                return {
                    id:self.id,
                    x:self.x,
                    y:self.y,
                    hp:self.hp,
                    score:self.score,
                    mouseAngle:self.mouseAngle,
                    spriteAnimCounter:self.spriteAnimCounter,
                    map:self.map
                }	
            }

            Player.list[self.id] = self
            initPack.player.push(self.getInitPack())
            return self
        }
        Player.list = {}

        Player.onConnect = function(socket){
            let map = 'Vestibule';
                // if(Math.random() < 0.5) {
                //     map = 'vestibule2';
                // }
                    
                let player = Player({
                    id:socket.id,
                    map:map,
                });
            socket.on('keyPress',function(data){
                if (data.inputId === 'left') {
                    player.pressingLeft = data.state;
                }
                else if (data.inputId === 'right') {
                    player.pressingRight = data.state;
                }
                else if (data.inputId === 'up') {
                    player.pressingUp = data.state;
                }
                else if (data.inputId === 'down') {
                    player.pressingDown = data.state;
                }
                else if (data.inputId === 'attack')
			        player.pressingAttack = data.state;
		        else if (data.inputId === 'mouseAngle')
			        player.mouseAngle = data.state;         
            });

            // socket.on('changeMap', () => {
            //     if (player.map === 'vestibule')
            //         player.map = 'cyber-bonch'
            //     else
            //         player.map = 'vestibule'
            // })

            socket.emit('init',{
                selfId:socket.id,
                player:Player.getAllInitPack(),
                bullet:Bullet.getAllInitPack(),
                enemy:Enemy.getAllInitPack()
            })
            //generate enemies
            let coordsX = [550, 670, 890, 999]
            let coordsY = [700, 780, 890, 990, 1200, 1300]
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'Vestibule'});
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'Vestibule'});
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'Vestibule'});
       
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'CyberBonch'});
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'CyberBonch'});
            Enemy({x:coordsX[Math.floor(Math.random()*coordsX.length)], y:coordsY[Math.floor(Math.random()*coordsY.length)], id: Math.random(), map:'CyberBonch'});
        }

        Player.getAllInitPack = function(){
            let players = []
            for(let i in Player.list)
                players.push(Player.list[i].getInitPack());
            return players;
        }

        Player.onDisconnect = function(socket){
            delete Player.list[socket.id]
            removePack.player.push(socket.id)
        }

        Player.update = function(){
            let pack = []
            for(let i in Player.list){
                let player = Player.list[i]
                player.update();
                pack.push(player.getUpdatePack())
            }
            return pack
        }


        let Bullet = function(param) {
            let self = Entity(param);
            self.id = Math.random();
            self.angle = param.angle;
            self.spdX = Math.cos(param.angle/180*Math.PI) * 10;
            self.spdY = Math.sin(param.angle/180*Math.PI) * 10;
            self.parent = param.parent;

            self.timer = 0;
            self.toRemove = false;
            let super_update = self.update;
            self.update = function(){
                if(self.timer++ > 100)
                    self.toRemove = true;
                super_update();
                
                // console.log(self.isPositionWall(self))
                if (self.isPositionWall(self)) {
                    self.toRemove = true;
                }
         
                for(let i in Player.list){
                    let p = Player.list[i];
                    if(self.map === p.map && self.getDistance(p) < 32 && self.parent !== p.id){
                        p.hp -= 1;
                                        
                        if(p.hp <= 0){
                            let shooter = Player.list[self.parent];
                            if(shooter)
                                shooter.score += 1;
                            p.hp = p.hpMax;
                            // p.x = Math.random() * 500;
                            // p.y = Math.random() * 500;		
                            p.x = 550; // координаты возрождения игрока
                            p.y = 600;	
                            p.map = 'Vestibule'
                        }
                        self.toRemove = true;
                    }
                }

                for(let i in Enemy.list){
                    let e = Enemy.list[i];
                    if(self.map === e.map && self.getDistance(e) < 32 && self.parent !== e.id){
                        e.hp -= 1;
                                        
                        if(e.hp <= 0){
                            let shooter = Enemy.list[self.parent];
                            e.hp = e.hpMax;
                            // p.x = Math.random() * 500;
                            // p.y = Math.random() * 500;		
                            // e.x = 550; // координаты возрождения игрока
                            // e.y = 600;		
                            e.toRemove = true	
                            console.log('enemy down')
                        }
                        self.toRemove = true;
                    }
                }
            }
            self.updatePosition = function() { // перемещение игрока со скоростью spdX и spdY
                // let oldX = self.x;
		        // let oldY = self.y;
                
                self.x += self.spdX
                self.y += self.spdY

                // //ispositionvalid не даем выйти за границы canvas
                // if(self.x < 160)
                //     self.x = 160;
                // if(self.x > 2400-131/2) //6528px ширина карты, 131px ширина фрейма игрока(Img.player.width /3/7)
                //     self.x = 2400 - 131/2; //160 2400 1350 границы карты по текущим размерам отрисованной карты
                // if(self.y < 121/2)
                //     self.y = 121/2;
                // if(self.y > 1350 - 121/2) //4096px высота карты, 121px высота фрейма игрока(Img.player.height /4/7)
                //     self.y = 1350 - 121/2;

                // if (self.isPositionWall(self)) {
                //     self.x = oldX
                //     self.y = oldY
                // }
            }

        self.getInitPack = function() {
            return {
                id:self.id,
                x:self.x,
                y:self.y,	
                map:self.map,	
            };
        }
        self.getUpdatePack = function() {
            return {
                id:self.id,
                x:self.x,
                y:self.y,		
            };
        }
     
        Bullet.list[self.id] = self;
        initPack.bullet.push(self.getInitPack());
        return self;
        }
        Bullet.list = {};
         
        
        Bullet.update = function(){
            let pack = [];
            for(let i in Bullet.list){
                let bullet = Bullet.list[i];
                bullet.update();
                if (bullet.toRemove) {
                    delete Bullet.list[i];
                    removePack.bullet.push(bullet.id)
                }
                else
                    pack.push(bullet.getUpdatePack());		
            }
            return pack;
        }
        Bullet.getAllInitPack = function(){
            let bullets = [];
            for(let i in Bullet.list)
                bullets.push(Bullet.list[i].getInitPack());
            return bullets;
        }

        let Enemy = function(param) { // Игрок
            let self = Entity(param) //создание экземпляра сущности
            let mouseAngles = [0, 45, 90, 135, 225, 315]
            self.toRemove = false;

            self.number = "" + Math.floor(10 * Math.random()) // присвоение рандомного номера игрока (никнейм, по сути)
            self.pressingRight = false // нажаты ли клавиши – нет, т.к. false
            self.pressingLeft = false
            self.pressingUp = false
            self.pressingDown = false
            self.pressingAttack = false
            self.atkSpd = 1; // скорость увеличения счетчика для выпуска пули
	        self.attackCounter = 0; // счетчик для выпуска пули
	        self.mouseAngle = mouseAngles[[Math.floor(Math.random()*mouseAngles.length)]] // угол наведения курсора
            self.maxSpd = 8 // скорость передвижения игрока
            self.hp = 3
            self.hpMax = 3

            self.toAttackX = 0
            self.toAttackY = 0

            self.spriteAnimCounter = 0

            let super_update = self.update
            self.update = function() {
                self.updateSpd() //обновление скорости при нажатии клавиш
                self.attackCounter += self.atkSpd; // рост счетчика для выпуска пули
                // self.updateAim();
		        // self.updateKeyPress();
                self.pressingAttack = true //стрельба enemy
                   
                
                if (self.pressingAttack) { //стрельба по нажатии клавиши мыши
                    if (self.attackCounter > 25) { // счетчик для выпуска пули
                        self.attackCounter = 0
                        self.shootBullet(self.mouseAngle)
                        // console.log('enemy shoot')
                    }
                }
                super_update()
            }
            var diffX = Player.x - self.x;
            var diffY = Player.y - self.y;
            self.updateAim = function(){
                // let object = Player.list
                // console.log(Object.keys(Player.list))
                // let keys = Object.keys(Player.list)
                // randomPlayer = Player.list[keys[ keys.length * Math.random() << 0]].x;
                // console.log(randomPlayer)
                
                
                self.aimAngle = Math.atan2(diffY,diffX) / Math.PI * 180
            }

            // self.updateKeyPress = function(){
            //     var diffX = Player.x - self.x;
            //     var diffY = Player.y - self.y;
        
            //     self.pressingRight = diffX > 3;
            //     self.pressingLeft = diffX < -3;
            //     self.pressingDown = diffY > 3;
            //     self.pressingUp = diffY < -3;
            // }

            self.shootBullet = function(angle) {
                Bullet({
                    parent:self.id,
                    angle:angle,
                    x:self.x,
                    y:self.y,
                    map:self.map,
                });
            }

            self.updateSpd = function() {

                //if bumber touches a wall, you can't go
                const rightBumper = {x: self.x + 30, y: self.y}
                const leftBumper = {x: self.x - 30, y: self.y}
                const upBumper = {x: self.x, y: self.y - 30}
                const downBumper = {x: self.x, y: self.y + 30}

                if (self.isPositionWall(rightBumper)) {
                    self.spdX = -self.maxSpd/10
                } else if (self.pressingRight) {
                    self.spdX = self.maxSpd;
                } else if (self.isPositionWall(leftBumper)) {
                    self.spdX = self.maxSpd/10
                } else if (self.pressingLeft) {
                    self.spdX = -self.maxSpd;
                } else {
                    self.spdX = 0;
                }

                if (self.isPositionWall(upBumper)) {
                    self.spdY = self.maxSpd/10
                } else if (self.pressingUp) {
                    self.spdY = -self.maxSpd;
                } else if (self.isPositionWall(downBumper)) {
                    self.spdY = -self.maxSpd/10
                } else if (self.pressingDown) {
                    self.spdY = self.maxSpd;
                } else {
                    self.spdY = 0;
                }

                // анимация спрайта
                // if (self.pressingRight || self.pressingLeft || self.pressingUp || self.pressingDown)
                    self.spriteAnimCounter += 0.25
            }

            self.getInitPack = function() { // отправка пакета с данными о сущности
                return {
                    id:self.id,
                    x:self.x,
                    y:self.y,
                    number:self.number,	
                    hp:self.hp,
                    hpMax:self.hpMax,
                    score:self.score,
                    map:self.map,
                    mouseAngle:self.mouseAngle,
                    spriteAnimCounter:self.spriteAnimCounter,
                    toAttackX:self.toAttackX,
                    toAttackY:self.toAttackY,
                }
            }

            self.getUpdatePack = function() { // получение пакета с данными о сущности
                return {
                    id:self.id,
                    x:self.x,
                    y:self.y,
                    hp:self.hp,
                    score:self.score,
                    mouseAngle:self.mouseAngle,
                    spriteAnimCounter:self.spriteAnimCounter,
                    toAttackX:self.toAttackX,
                    toAttackY:self.toAttackY,
                }	
            }

            Enemy.list[self.id] = self
            initPack.enemy.push(self.getInitPack())
            return self
        }
        Enemy.list = {}
       

        Enemy.getAllInitPack = function(){
            let enemies = []
            for(let i in Enemy.list)
            enemies.push(Enemy.list[i].getInitPack());
            return enemies;
        }

        Enemy.update = function(){
            let pack = []         
            for(let i in Enemy.list){
                let enemy = Enemy.list[i]
                enemy.update();
                if (enemy.toRemove) {
                    delete Enemy.list[i];
                    removePack.enemy.push(enemy.id)
                }
                else
                pack.push(enemy.getUpdatePack())
                
            }
            return pack
        }

        // Enemy.update = function(){
        //         Enemy.randomlyGenerate();
        //     for(var key in Enemy.list){
        //         Enemy.list[key].update();
        //         console.log(key)
        //     }
        //     for(var key in Enemy.list){
        //         if(Enemy.list[key].toRemove)
        //             delete Enemy.list[key];
        //     }
        // }

        // Enemy.randomlyGenerate = function(){
            //Math.random() returns a number between 0 and 1
            // var x = Math.random()*6528;
            // var y = Math.random()*4096;
            // var x = 550;
            // var y = 600;
            // var height = 64*1.5;
            // var width = 64*1.5;
            // var id = Math.random();
            
            // Enemy({id: Math.random(), map:'vestibule'});
            // console.log(Enemy)
        // }

        let DEBUG = true;

        io.sockets.on('connection', function(socket) {
            socket.id = Math.random()
            SOCKET_LIST[socket.id] = socket

            Player.onConnect(socket)
            // console.log(Player)

            socket.on('disconnect', function() {
                delete SOCKET_LIST[socket.id]
                Player.onDisconnect(socket)
            })
         
            socket.on('evalServer',function(data){
                if(!DEBUG)
                    return;
                let res = eval(data);
                socket.emit('evalAnswer',res);		
            });

            console.log('socket connection')
        })

        const arrayMapVestibule = 
            [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

        const arrayMapCyberBonch = []

        let initPack = {
            player:[],
            bullet:[],
            enemy:[]
        }
        let removePack = {
            player:[],
            bullet:[],
            enemy:[]
        }

        setInterval(function() {
            //information about every single player in the game
            let pack = {
                player:Player.update(),
                bullet:Bullet.update(),
                enemy:Enemy.update()
            }
         
            for(let i in SOCKET_LIST) {
                let socket = SOCKET_LIST[i]
                socket.emit('init', initPack)
                // console.log(pack)
		        socket.emit('update', pack)
		        socket.emit('remove', removePack)             
            }
            initPack.player = []
	        initPack.bullet = []
            initPack.enemy = []
	        removePack.player = []
	        removePack.bullet = []
            removePack.enemy = []
            
        }, 1000/25);
    } catch (error) {
        console.log('Something went wrong. Please try again', error.message);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('root route')
});

start();