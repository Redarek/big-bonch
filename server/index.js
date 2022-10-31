require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');

const { ethers, BigNumber} = require("ethers");
const { Server } = require('socket.io');
const http = require('http');

const User = require('./models/userModel');

const router = require('./router/index.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware); // middleware ошибок всегда последний app.use

const server = http.createServer(app)
const io = new Server(server,{ 
    cors: {
      origin: ['http://localhost:3000']
    }
})

const big_number = BigNumber.from(1) // BigNumber для функции выдачи NFT

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

        let Entity = function() { //Сущность с параметрами для игры
            let self = {
                x: 750, // координаты x
                y: 370, // координаты y
                spdX: 0, // скорость
                spdY: 0,
                id: "", // id
            }
            self.update = function() { // для перемещения
                self.updatePosition()
            }
            self.updatePosition = function() { // перемещение игрока со скоростью spdX и spdY
                self.x += self.spdX
                self.y += self.spdY
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

        let Player = function(id) { // Игрок
            let self = Entity() //создание экземпляра сущности
            self.id = id // id
            self.number = "" + Math.floor(10 * Math.random()) // присвоение рандомного номера игрока (никнейм, по сути)
            self.pressingRight = false // нажаты ли клавиши – нет, т.к. false
            self.pressingLeft = false
            self.pressingUp = false
            self.pressingDown = false
            self.pressingAttack = false
	        self.mouseAngle = 0 // угол наведения курсора
            self.maxSpd = 10 // скорость передвижения игрока
            self.hp = 10
            self.hpMax = 10
            self.score = 0
            self.spriteAnimCounter = 0
            let super_update = self.update
            self.update = function() {
                self.updateSpd() //обновление скорости при нажатии клавиш
                super_update() 
                self.spriteAnimCounter += 0.5   
                
                if (self.pressingAttack) { //стрельба по нажатии клавиши мыши
                    self.shootBullet(self.mouseAngle)
                }
            }

            self.shootBullet = function(angle) {
                let b = Bullet(self.id,angle)
                b.x = self.x
                b.y = self.y
            }

            self.updateSpd = function() {
                if(self.pressingRight)
			        self.spdX = self.maxSpd;
		        else if(self.pressingLeft)
                    self.spdX = -self.maxSpd;
                else
                    self.spdX = 0;
                
                if(self.pressingUp)
                    self.spdY = -self.maxSpd;
                else if(self.pressingDown)
                    self.spdY = self.maxSpd;
                else
                    self.spdY = 0;		
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
                }
            }

            self.getUpdatePack = function() { // получение пакета с данными о сущности
                return {
                    id:self.id,
                    x:self.x,
                    y:self.y,
                    hp:self.hp,
                    score:self.score,
                }	
            }

            Player.list[id] = self
            initPack.player.push(self.getInitPack())
            return self
        }
        Player.list = {}

        Player.onConnect = function(socket){
            let player = Player(socket.id)
            socket.on('keyPress',function(data){
                if (data.inputId === 'left') {
                    player.pressingLeft = data.state;
                    socket.emit('spriteAnimCounter', player.spriteAnimCounter)
                }
                else if (data.inputId === 'right') {
                    player.pressingRight = data.state;
                    socket.emit('spriteAnimCounter', player.spriteAnimCounter)
                }
                else if (data.inputId === 'up') {
                    player.pressingUp = data.state;
                    socket.emit('spriteAnimCounter', player.spriteAnimCounter)
                }
                else if (data.inputId === 'down') {
                    player.pressingDown = data.state;
                    socket.emit('spriteAnimCounter', player.spriteAnimCounter)
                }
                else if (data.inputId === 'attack')
			        player.pressingAttack = data.state;
		        else if (data.inputId === 'mouseAngle')
			        player.mouseAngle = data.state;         
            });
            socket.on('moveMouse', function() {socket.emit('angle', player.mouseAngle)})

            socket.emit('init',{
                selfId:socket.id,
                player:Player.getAllInitPack(),
                bullet:Bullet.getAllInitPack()
            })
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


        let Bullet = function(parent,angle){
            let self = Entity();
            self.id = Math.random();
            self.spdX = Math.cos(angle/180*Math.PI) * 10;
            self.spdY = Math.sin(angle/180*Math.PI) * 10;
            self.parent = parent;
            self.timer = 0;
            self.toRemove = false;
            let super_update = self.update;
            self.update = function(){
                if(self.timer++ > 100)
                    self.toRemove = true;
                super_update();
         
                for(let i in Player.list){
                    let p = Player.list[i];
                    if(self.getDistance(p) < 32 && self.parent !== p.id){
                        p.hp -= 1;
                                        
                        if(p.hp <= 0){
                            let shooter = Player.list[self.parent];
                            if(shooter)
                                shooter.score += 1;
                            p.hp = p.hpMax;
                            p.x = Math.random() * 500;
                            p.y = Math.random() * 500;					
                        }
                        self.toRemove = true;
                    }
                }
            }
        self.getInitPack = function() {
            return {
                id:self.id,
                x:self.x,
                y:self.y,		
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

        let DEBUG = true;

        io.sockets.on('connection', function(socket) {
            socket.id = Math.random()
            SOCKET_LIST[socket.id] = socket

            Player.onConnect(socket)

            socket.emit('BigNumber', big_number)

            socket.on('disconnect', function() {
                delete SOCKET_LIST[socket.id]
                Player.onDisconnect(socket)
            })

            socket.on('sendMsgToServer',function(data){
                let playerName = ("" + socket.id).slice(2,7);
                for(let i in SOCKET_LIST) {
                    SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
                }
            });
         
            socket.on('evalServer',function(data){
                if(!DEBUG)
                    return;
                let res = eval(data);
                socket.emit('evalAnswer',res);		
            });

            console.log('socket connection')
        })

        let initPack = {
            player:[],
            bullet:[]
        }
        let removePack = {
            player:[],
            bullet:[]
        }

        setInterval(function() {
            //information about every single player in the game
            let pack = {
                player:Player.update(),
                bullet:Bullet.update(),
            }
         
            for(let i in SOCKET_LIST) {
                let socket = SOCKET_LIST[i]
                socket.emit('init', initPack)
		        socket.emit('update', pack)
		        socket.emit('remove', removePack)             
            }
            initPack.player = []
	        initPack.bullet = []
	        removePack.player = []
	        removePack.bullet = []
            
        }, 1000/25);
    } catch (error) {
        console.log('Something went wrong. Please try again', error.message);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('root route')
});

// app.get('/api/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// });

// app.get('/api/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find();
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// });

start();