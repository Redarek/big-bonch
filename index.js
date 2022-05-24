const express = require('express')
const bodyParser = require('body-parser');
const res = require('express/lib/response')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const { db_url } = require('./config');
const { init } = require('./models/User');
const { ethers, BigNumber} = require("ethers");


const PORT = process.env.PORT || 3000

const app = express()
const serv =  require('http').Server(app); // для socket.io

const io = require('socket.io')(serv, {}) // socket io инициализация

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json()); 
app.use(express.json()) // парсер данных json
app.use("/auth", authRouter)

app.use('/client', express.static(__dirname + '/client')) // отправка статических файлов из директории /client
app.get('/', function(req, res) { 
    res.sendFile(__dirname + '/client/signup.html') // отправка страницы регистрации при переходе в директорию /
})

const big_number = BigNumber.from(1) // BigNumber для функции выдачи NFT

const start = async () => { // функция старта сервера
    try {

        await mongoose.connect(db_url) // подключение БД
        serv.listen(PORT, () => console.log(`Server started on port ${PORT}`)) // запуск сервера

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

            //ПЕРЕОПРЕДЕЛИТЬ updatePosition ТОЛЬКО В ОБЪЕКТЕ ИГРОКА Player
            // А ТУТ ВЕРНУТЬ ТЕЛО ФУНКЦИИ КАК НИЖЕ
            // self.x += self.spdX
            // self.y += self.spdY
            //ИНАЧЕ Bullet ТОЖЕ ОТСКАКИВАЕТ ОТ СТЕН
            self.updatePosition = function() { // перемещение игрока со скоростью spdX и spdY
                self.x += self.spdX
                self.y += self.spdY
                // if (self.x > 0)
                //     self.x += self.spdX
                // else 
                //     self.x += 5

                // if (self.x < 1300)
                //     self.x += self.spdX
                // else 
                //     self.x -= 5

                // if (self.y > 0)
                //     self.y += self.spdY
                // else
                //     self.y += 5

                // if (self.y < 745)
                //     self.y += self.spdY
                // else
                //     self.y -= 5
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
            // self.hp = 10;
            // self.hpMax = 10;
            // self.score = 0;
            var super_update = self.update
            self.update = function() {
                self.updateSpd() //обновление скорости при нажатии клавиш
                super_update() 

                if(self.pressingAttack){
                    self.shootBullet(self.mouseAngle)
                }
            }

            self.shootBullet = function(angle) {
                var b = Bullet(self.id,angle)
                b.x = self.x
                b.y = self.y
            }

            self.updateSpd = function() {
                if(self.pressingRight)
                    self.spdX = self.maxSpd
                else if(self.pressingLeft) {
                        self.spdX = -self.maxSpd
                        if (self.y < 200 && self.x < 450)
                            self.spdX = 0
                        if (self.x < 100)
                            self.spdX = 0
                }
                else
                    self.spdX = 0
         
                if(self.pressingUp)
                    self.spdY = -self.maxSpd
                else if(self.pressingDown)
                    self.spdY = self.maxSpd
                else
                    self.spdY = 0
                
                if (self.pressingLeft && self.x < 60) // столкновение с левой стеной
                    self.spdX = 0

                if (self.pressingRight && self.x > 1280) // столкновение с правой стеной
                    self.spdX = 0
                
                if (self.pressingUp && self.y < 60) // столкновение с верхней стеной
                    self.spdY = 0

                if (self.pressingDown && self.y > 650) //столкновение с нижней стеной
                    self.spdY = 0
                // //////////
                // if (self.pressingLeft && self.x < 450) { // столкновение с левой стеной
                //     self.spdX = 0
                //     if (self.y > 200)
                //         self.spdX = -self.maxSpd
                // }
                
                // if (self.pressingRight && self.x > 1280) // столкновение с правой стеной
                //     self.spdX = 0

                // if (self.pressingUp && self.y < 200) { // столкновение с верхней стеной
                //     self.spdY = 0
                //     if (self.x > 250)
                //         self.spdY = -self.maxSpd
                // }

                // if (self.pressingDown && self.y > 650) //столкновение с нижней стеной
                //     self.spdY = 0


                // if(self.pressingLeft) {
                //     self.spdX = -self.maxSpd
                //     if (self.y < 200 && self.x < 450)
                //         self.spdX = 0
                //     if (self.x < 100)
                //         self.spdX = 0
                // }

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
                if(data.inputId === 'left')
                    player.pressingLeft = data.state;
                else if(data.inputId === 'right')
                    player.pressingRight = data.state;
                else if(data.inputId === 'up')
                    player.pressingUp = data.state;
                else if(data.inputId === 'down')
                    player.pressingDown = data.state;
                else if(data.inputId === 'attack')
			        player.pressingAttack = data.state;
		        else if(data.inputId === 'mouseAngle')
			        player.mouseAngle = data.state;
            });

            socket.emit('init',{
                selfId:socket.id,
                player:Player.getAllInitPack(),
                bullet:Bullet.getAllInitPack()
            })
        }

        Player.getAllInitPack = function(){
            var players = []
            for(var i in Player.list)
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


        var Bullet = function(parent,angle){
            var self = Entity();
            self.id = Math.random();
            self.spdX = Math.cos(angle/180*Math.PI) * 10;
            self.spdY = Math.sin(angle/180*Math.PI) * 10;
            self.parent = parent;
            self.timer = 0;
            self.toRemove = false;
            var super_update = self.update;
            self.update = function(){
                if(self.timer++ > 100)
                    self.toRemove = true;
                super_update();
         
                for(var i in Player.list){
                    var p = Player.list[i];
                    if(self.getDistance(p) < 32 && self.parent !== p.id){
                        //handle collision. ex: hp--;
                        self.toRemove = true;
                    }
                }
            }
        self.getInitPack = function(){
            return {
                id:self.id,
                x:self.x,
                y:self.y,		
            };
        }
        self.getUpdatePack = function(){
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
            var pack = [];
            for(var i in Bullet.list){
                var bullet = Bullet.list[i];
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
            var bullets = [];
            for(var i in Bullet.list)
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
                var playerName = ("" + socket.id).slice(2,7);
                for(var i in SOCKET_LIST){
                    SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
                }
            });
         
            socket.on('evalServer',function(data){
                if(!DEBUG)
                    return;
                var res = eval(data);
                socket.emit('evalAnswer',res);		
            });

            console.log('socket connection')
        })

        let initPack = {
            player:[],
            bullet:[]
        };
        var removePack = {
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
                socket.emit('init',initPack)
		        socket.emit('update',pack)
		        socket.emit('remove',removePack)
            }
            initPack.player = []
	        initPack.bullet = []
	        removePack.player = []
	        removePack.bullet = []
        }, 1000/25);




    } catch {
        console.log(e)
    }
}

start()