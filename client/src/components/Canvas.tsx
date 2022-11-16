import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";
// import Web3 from "web3";
import {ethers} from 'ethers'
import cl from '../styles/MainPage.module.css'
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {postNftMetadata} from "../store/reducers/ActionCreators";
import {INftMetadata} from "../types/INftMetadata";

declare var window: any

const Canvas = () => {

    const dispatch = useAppDispatch()

    const [height, setHeight] = useState(100);
    const [left, setLeft] = useState(0);
    const canvasRef = React.useRef(null)
    const canvasRefUi = React.useRef(null)

    const {user} =useAppSelector(state => state.authSlice.user)
    const BASE_URL = process.env.NODE_ENV === "production" ? 'https://big-bonch.herokuapp.com' : 'http://localhost:8080';

    useEffect(() => {
        const socket = io(`${BASE_URL}`)
        const canvas = canvasRef.current;
        const canvasUi = canvasRefUi.current;
        // @ts-ignore
        const ctxUi = canvasUi.getContext('2d');
        // @ts-ignore
        const ctx = canvas.getContext('2d');

        //размеры чанков карты и первоначальные размеры canvas
        const TILE_SIZE = 64
        const WIDTH = 1280
        const HEIGHT = 720
        let CANVAS_WIDTH = 1280
        let CANVAS_HEIGHT = 720

        // функция создания NFT и отправки метадаты на сервер
        const mintNftAndMetadata = async () => {
            const contractAddr = process.env.REACT_APP_SMART_CONTRACT_ADDRESS || ''
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", [])
                const signer = provider.getSigner()
                const abi = ["function mint(uint numberOfTokens) external payable"]
                const contract = new ethers.Contract(
                    contractAddr,
                    abi, signer)
                try {
                    //заглушка для metamask
                    const response = 'res'
                    // const response = await contract.mint(ethers.BigNumber.from(1), {
                    //     value: ethers.utils.parseEther("0.18"),
                    // })
                    if (response) {
                        //Создание метадаты
                        const nftMetadata: INftMetadata = {
                            name: 'Пропуск',
                            description: 'Пластиковая карта, необходимая для прохода через турникет',
                            image: 'http://localhost:8080/pass.png',
                            attributes: [
                                //@todo добавить sex на сервере
                                //@todo отредактировать route на сервере при регистрации // вместо name universityData
                                {
                                    trait_type: 'Имя',
                                    value: `${user.universityData.firstName}`
                                },
                                {
                                    trait_type: 'Фамилия',
                                    value: `${user.universityData.secondName}`
                                },
                                {
                                    trait_type: 'Отчество',
                                    value: `${user.universityData.patronymic}`
                                },
                                {
                                    trait_type: "Факультет",
                                    value: `${user.universityData.faculty}`
                                },
                                {
                                    trait_type: "Должность",
                                    value: `${user.universityData.job}`
                                },
                                {
                                    trait_type: "Пол",
                                    value: `${user.universityData.sex}`
                                },
                                {
                                    "display_type": "date",
                                    "trait_type": "Выдан",
                                    "value": new Date()
                                }
                            ],
                        }
                        dispatch(postNftMetadata(nftMetadata)) //отправка на сервер
                    }
                    console.log('response: ', response)
                } catch (err) {
                    console.log("error", err)
                }
            }
        }

        mintNftAndMetadata();


        const array =
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

        // resize game
        let resizeCanvas = function () {
            CANVAS_WIDTH = window.innerWidth - 4;
            CANVAS_HEIGHT = window.innerHeight - 4;

            let ratio = 16 / 9;
            if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
                CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
            else
                CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
            // @ts-ignore
            canvas.width = WIDTH;
            // @ts-ignore
            canvas.height = HEIGHT;
            ctx.font = '30px Arial';

            ctx.mozImageSmoothingEnabled = false;	//better graphics for pixel art
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            // @ts-ignore
            canvas.style.width = '' + CANVAS_WIDTH + 'px';
            // @ts-ignore
            canvas.style.height = '' + CANVAS_HEIGHT + 'px';
            // @ts-ignore
            canvasUi.style.width = '' + CANVAS_WIDTH + 'px';
            // @ts-ignore
            canvasUi.style.height = '' + CANVAS_HEIGHT + 'px';
            let left = (window.innerWidth - CANVAS_WIDTH)/2
            setLeft(left)
            setHeight(CANVAS_HEIGHT)
          }
          resizeCanvas();

        window.addEventListener('resize', function () {
            resizeCanvas();
        });

        //game
        let Img = {}
        // @ts-ignore
        Img.player = new Image()
        // @ts-ignore
        Img.player.src = '/images/player.png';
        // @ts-ignore
        Img.bullet = new Image()
        // @ts-ignore
        Img.bullet.src = '/images/bullet.png';
        // @ts-ignore
        Img.map = {}
        // @ts-ignore
        Img.map['vestibule'] = new Image()
        // @ts-ignore
        Img.map['vestibule'].src = '/images/map.png'
        // @ts-ignore
        Img.map['vestibule2'] = new Image()
        // @ts-ignore
        Img.map['vestibule2'].src = '/images/map.png'
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
            self.map = initPack.map
            // @ts-ignore
            self.mouseAngle = initPack.mouseAngle
            // @ts-ignore
            self.spriteAnimCounter = initPack.spriteAnimCounter

            // @ts-ignore
            self.draw = function () {
                // @ts-ignore
                if (Player.list[selfId].map !== self.map) {
                    return
                }
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
                // // @ts-ignore
                // console.log(Maps.current.width, Maps.current.height)
                // // @ts-ignore
                // console.log(Img.player.width /3 /7, Img.player.height/4/7)
                // @ts-ignore
                const frameWidth = Img.player.width / 3
                // @ts-ignore
                const frameHeight = Img.player.height / 4
                // socket.on('angle', function (data) {
                //     // @ts-ignore
                //     self.angle = data
                // })
                let directionMod = 2 // вправо
                // @ts-ignore
                if (self.mouseAngle >= 45 && self.mouseAngle < 135) //вниз
                    directionMod = 0
                // @ts-ignore
                else if ((self.mouseAngle >= 135 && self.mouseAngle <= 180) || (self.mouseAngle >= -180 && self.mouseAngle < -135)) //влево
                    directionMod = 3
                // @ts-ignore
                else if (self.mouseAngle >= -135 && self.mouseAngle < -45) //вверх
                    directionMod = 1

                // socket.on('spriteAnimCounter', function (data) {
                //     // @ts-ignore
                //     self.spriteAnimCounter = data
                // })
                // @ts-ignore
                let walkingMod = Math.floor(self.spriteAnimCounter) % 3
                // @ts-ignore

                ctx.drawImage(Img.player,
                    walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
                    x - width / 2, y - height / 2, width, height);
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
            self.map = initPack.map
            // @ts-ignore
            self.draw = function () {
                // @ts-ignore
                if (Player.list[selfId].map !== self.map) {
                    return
                }
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
                    if (pack.mouseAngle !== undefined)
                        p.mouseAngle = pack.mouseAngle
                    if (pack.spriteAnimCounter !== undefined)
                        p.spriteAnimCounter = pack.spriteAnimCounter
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
            for (let i = 0; i < data.player.length; i++) {
                // @ts-ignore
                delete Player.list[data.player[i]]
            }
            for (let i = 0; i < data.bullet.length; i++) {
                // @ts-ignore
                delete Bullet.list[data.bullet[i]]
            }
        });
        // @ts-ignore
        let Maps = function (id, imgSrc, grid) {
            // @ts-ignore

            var self = {
                id: id,
                image: new Image(),
                width: grid[0].length * TILE_SIZE,
                height: grid.length * TILE_SIZE,
                grid: grid,
            }
            self.image.src = imgSrc;
            // @ts-ignore
            self.isPositionWall = function (pt) {
                var gridX = Math.floor(pt.x / TILE_SIZE);
                var gridY = Math.floor(pt.y / TILE_SIZE);
                if (gridX < 0 || gridX >= self.grid[0].length)
                    return true;
                if (gridY < 0 || gridY >= self.grid.length)
                    return true;
                return self.grid[gridY][gridX];
            }
            // @ts-ignore
            self.draw = function () {

                // @ts-ignore
                let player = Player.list[selfId];
                // console.log(player.x, player.y)
                // @ts-ignore
                var x = WIDTH / 2 - player.x;
                // @ts-ignore
                var y = HEIGHT / 2 - player.y;
                // ctx.drawImage(self.image,0,0,self.image.width,self.image.height,x,y,self.image.width*2,self.image.height*2);
                ctx.drawImage(self.image, x, y, WIDTH * 2, HEIGHT * 2);
                // @ts-ignore
                // ctx.drawImage(Img.map[player.map],x,y, WIDTH*2, HEIGHT*2);
            }
            return self;
        }
        // @ts-ignore
        Maps.current = Maps('vestibule', '/images/map.png', array);

        // // @ts-ignore
        // let array2D = [];
        // for(let i = 0 ; i < 32; i++){
        //     // @ts-ignore
        //     array2D[i] = [];
        //     for(let j = 0 ; j < 51; j++){
        //         // @ts-ignore
        //         array2D[i][j] = array[i * 32 + j];
        //     }
        // }
        let drawMap = function () {
            // @ts-ignore
            let player = Player.list[selfId];
            // @ts-ignore
            let x = WIDTH / 2 - player.x;
            // @ts-ignore
            let y = HEIGHT / 2 - player.y;
            // @ts-ignore
            ctx.drawImage(Img.map[player.map], x, y, WIDTH * 2, HEIGHT * 2);
            // @ts-ignore

        }

        setInterval(function () {
            // @ts-ignore
            if (!selfId)
                return;
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
            // @ts-ignore
            Maps.current.draw();
            // drawMap()
            // drawScore()
            // @ts-ignore
            for (let i in Player.list)
                // @ts-ignore
                Player.list[i].draw()
            // @ts-ignore
            for (let i in Bullet.list)
                // @ts-ignore
                Bullet.list[i].draw()
        }, 40)


        //score
        let drawScore = function () {
            ctx.fillStyle = 'black';
            // @ts-ignore
            ctx.fillText(Player.list[selfId].score, 40, 80);
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
        document.onmousemove = function (mouse) {
            // @ts-ignore
            var mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
            // @ts-ignore
            var mouseY = mouse.clientY - canvas.getBoundingClientRect().top;

            mouseX -= CANVAS_WIDTH / 2;
            mouseY -= CANVAS_HEIGHT / 2;

            let angle = Math.atan2(mouseY, mouseX) / Math.PI * 180
            socket.emit('keyPress', {inputId: 'mouseAngle', state: angle})
            // socket.emit('moveMouse')
            //тут отдельный сокет эмит для aimAngle и на сервере вынести ON из keyPress
        }
    }, [])

    return (
        <div className={cl.wrap} style={{height: `${height}px`}}>
            <canvas
                style={{left: `${left}px`}}
                // width="1280px"
                // height="720px"
                id="ctx"
                ref={canvasRef}>
                Обновите браузер
            </canvas>
            <canvas
                style={{left: `${left}px`}}
                // width="1280px"
                // height="720px"
                id="ctx-ui"
                ref={canvasRefUi}>
                Обновите браузер
            </canvas>
        </div>
    );
};

export default Canvas;
