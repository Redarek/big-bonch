import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";
import Web3 from "web3";
import {ethers} from 'ethers'
import mapPicture from '../images/map.png'

declare var window: any

const Canvas = () => {
    const canvasRef = React.useRef(null)

    // useEffect(() => {
    //
    //     const canvas = canvasRef.current;
    //     // @ts-ignore
    //     const ctx = canvas.getContext('2d');
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(10, 10, 150, 100)
    // }, [])

    useEffect(() => {
        const socket = io('http://localhost:8080')
        const canvas = canvasRef.current;
        // @ts-ignore
        const ctx = canvas.getContext('2d');
        // ctx.fillStyle = "red";
        // ctx.fillRect(10, 10, 150, 100)

        const contractAddr = "0xd3D7095fa12C735dfC0893CC2717670E241e1d71"

        const WIDTH = 1280
        const HEIGHT = 720


        // socket.on('BigNumber', async function(data) {
        //     if (window.ethereum) {
        //         const provider=  new ethers.providers.Web3Provider(window.ethereum);
        //         await provider.send("eth_requestAccounts", [])
        //         const signer = provider.getSigner()
        //         const contract = new ethers.Contract(
        //             contractAddr,
        //             // @ts-ignore
        //             abi = [ "function mint(uint numberOfTokens) external payable" ], signer)
        //         try {
        //             const response = await contract.mint(data, {
        //                 value: ethers.utils.parseEther("0.18"),
        //             })
        //             console.log('response: ', response)
        //         } catch(err){
        //             console.log("error", err)
        //         }
        //     }
        // })

        //game
        let Img = {}
        // @ts-ignore
        Img.player = new Image()
        // @ts-ignore
        Img.player.src = '/images/player.png';
        // @ts-ignore
        Img.bullet = new Image()
        // @ts-ignore
        Img.bullet.src = '/images/bullet.png'
        // @ts-ignore
        console.log(Img.bullet.src)
        // @ts-ignore
        Img.map = new Image()
        // @ts-ignore
        Img.map.src = '/images/map.png'
        // @ts-ignore
        console.log(Img.map.src)
        // @ts-ignore
        // const ctx = document.getElementById("ctx").getContext("2d")
        ctx.font = '30px Arial'
        // @ts-ignore
        let Player = function (initPack) {
            let self = {}
            // @ts-ignore
            self.id = initPack.id
            // @ts-ignore
            self.number = initPack.number
            // @ts-ignore
            self.x = initPack.x
            // @ts-ignore
            self.y = initPack.y
            // @ts-ignore
            self.hp = initPack.hp
            // @ts-ignore
            self.hpMax = initPack.hpMax
            // @ts-ignore
            self.score = initPack.score
            // @ts-ignore
            self.angle = 0
            // @ts-ignore
            self.spriteAnimCounter = 0

            // @ts-ignore
            self.draw = function () {
                // @ts-ignore
                let x = self.x - Player.list[selfId].x + WIDTH / 2
                // @ts-ignore
                let y = self.y - Player.list[selfId].y + HEIGHT / 2

                //hp bar
                // let hpWidth = 30 * self.hp / self.hpMax
                // ctx.fillStyle = 'red'
                // ctx.fillRect(x - hpWidth/2,y - 40,hpWidth,4)
                // @ts-ignore
                const width = Img.player.width / 3 / 7 //размеры фрейма игрока
                // @ts-ignore
                const height = Img.player.height / 4 / 7
                // @ts-ignore
                const frameWidth = Img.player.width / 3
                // @ts-ignore
                const frameHeight = Img.player.height / 4
                socket.on('angle', function (data) {
                    // @ts-ignore
                    self.angle = data
                })
                let directionMod = 2 // вправо
                // @ts-ignore
                if (self.angle >= 45 && self.angle < 135) //вниз
                    directionMod = 0
                // @ts-ignore
                else if ((self.angle >= 135 && self.angle <= 180) || (self.angle >= -180 && self.angle < -135)) //влево
                    directionMod = 3
                // @ts-ignore
                else if (self.angle >= -135 && self.angle < -45) //вверх
                    directionMod = 1

                socket.on('spriteAnimCounter', function (data) {
                    // @ts-ignore
                    self.spriteAnimCounter = data
                })
                // @ts-ignore
                let walkingMod = Math.floor(self.spriteAnimCounter) % 3
                // @ts-ignore

                ctx.drawImage(Img.player,
                    walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
                    x - width / 2, y - height / 2, width, height);

                // ctx.fillText(self.score, self.x, self.y-60);
            }
            // @ts-ignore
            Player.list[self.id] = self

            return self
        }
        // @ts-ignore
        Player.list = {}
        // @ts-ignore
        let Bullet = function (initPack) {
            let self = {}
            // @ts-ignore
            self.id = initPack.id
            // @ts-ignore
            self.x = initPack.x
            // @ts-ignore
            self.y = initPack.y
            // @ts-ignore
            self.draw = function () {
                // @ts-ignore
                let width = Img.bullet.width / 2
                // @ts-ignore
                let height = Img.bullet.height / 2
                // @ts-ignore
                let x = self.x - Player.list[selfId].x + WIDTH / 2;
                // @ts-ignore
                let y = self.y - Player.list[selfId].y + HEIGHT / 2;
                // @ts-ignore
                ctx.drawImage(Img.bullet,
                    // @ts-ignore
                    0, 0, Img.bullet.width, Img.bullet.height,
                    // @ts-ignore
                    x, y, width / 10, height / 10)
            }
            // @ts-ignore
            Bullet.list[self.id] = self
            return self
        }
        // @ts-ignore
        Bullet.list = {}
        // @ts-ignore
        let selfId = null

        socket.on('init', function (data) {
            if (data.selfId)
                selfId = data.selfId
            for (let i = 0; i < data.player.length; i++) {
                // @ts-ignore
                new Player(data.player[i])
            }
            for (let i = 0; i < data.bullet.length; i++) {
                // @ts-ignore
                new Bullet(data.bullet[i])
            }
        })
        socket.on('update', function (data) {
            //{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], bullet: []}
            for (let i = 0; i < data.player.length; i++) {
                let pack = data.player[i]
                // @ts-ignore
                let p = Player.list[pack.id]
                if (p) {
                    if (pack.x !== undefined)
                        p.x = pack.x
                    if (pack.y !== undefined)
                        p.y = pack.y
                    if (pack.hp !== undefined)
                        p.hp = pack.hp
                    if (pack.score !== undefined)
                        p.score = pack.score
                }
            }
            for (let i = 0; i < data.bullet.length; i++) {
                let pack = data.bullet[i]
                // @ts-ignore
                let b = Bullet.list[data.bullet[i].id]
                if (b) {
                    if (pack.x !== undefined)
                        b.x = pack.x
                    if (pack.y !== undefined)
                        b.y = pack.y
                }
            }
        });

        socket.on('remove', function (data) {
            //{player:[12323],bullet:[12323,123123]}
            for (let i = 0; i < data.player.length; i++) {
                // @ts-ignore
                delete Player.list[data.player[i]]
            }
            for (let i = 0; i < data.bullet.length; i++) {
                // @ts-ignore
                delete Bullet.list[data.bullet[i]]
            }
        });

        setInterval(function () {
            // @ts-ignore
            if (!selfId)
                return;
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
            drawMap()
            // @ts-ignore
            for (let i in Player.list)
                // @ts-ignore
                Player.list[i].draw()
            // @ts-ignore
            for (let i in Bullet.list)
                // @ts-ignore
                Bullet.list[i].draw()
        }, 40)

        let drawMap = function () {
            // @ts-ignore
            let x = WIDTH / 2 - Player.list[selfId].x
            // @ts-ignore
            let y = HEIGHT / 2 - Player.list[selfId].y
            // @ts-ignore
            ctx.drawImage(Img.map, x, y, WIDTH * 2, HEIGHT * 2)
        }

        //score
        let drawScore = function () {
            ctx.fillStyle = 'white';
            // @ts-ignore
            ctx.fillText(Player.list[selfId].score, 0, 30);
        }

        document.onkeydown = function (event) {
            if (event.keyCode === 68) //press "D"
                socket.emit('keyPress', {inputId: 'right', state: true})
            else if (event.keyCode === 83) //press "S"
                socket.emit('keyPress', {inputId: 'down', state: true})
            else if (event.keyCode === 65) //press "A"
                socket.emit('keyPress', {inputId: 'left', state: true})
            else if (event.keyCode === 87) //press "W"
                socket.emit('keyPress', {inputId: 'up', state: true})
        }
        document.onkeyup = function (event) {
            if (event.keyCode === 68) //press "D"
                socket.emit('keyPress', {inputId: 'right', state: false})
            else if (event.keyCode === 83) //press "S"
                socket.emit('keyPress', {inputId: 'down', state: false})
            else if (event.keyCode === 65) //press "A"
                socket.emit('keyPress', {inputId: 'left', state: false})
            else if (event.keyCode === 87) //press "W"
                socket.emit('keyPress', {inputId: 'up', state: false})
        }

        document.onmousedown = function (event) {
            socket.emit('keyPress', {inputId: 'attack', state: true})
        }
        document.onmouseup = function (event) {
            socket.emit('keyPress', {inputId: 'attack', state: false})
        }
        document.onmousemove = function (event) {
            let x = -640 + event.clientX - 20
            let y = -360 + event.clientY - 20
            let angle = Math.atan2(y, x) / Math.PI * 180
            socket.emit('keyPress', {inputId: 'mouseAngle', state: angle})
            socket.emit('moveMouse')
            //тут отдельный сокет эмит для aimAngle и на сервере вынести ON из keyPress
        }
    }, [])
    return (
        <div className="middlepart">
            <canvas
                width="1280px"
                height="720px"
                id="ctx"
                ref={canvasRef}>
                Обновите браузер
            </canvas>
        </div>
    );
};

export default Canvas;
