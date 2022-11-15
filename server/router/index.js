const Router = require('express').Router;
const userController = require('../controllers/userController');
const nftController = require('../controllers/nftController');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
router.post('/login',userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);


router.get('/token-id', authMiddleware, nftController.getNewTokenId);
router.post('/mint-nft', authMiddleware, nftController.mintNft)
router.get('/:id', nftController.getNftByTokenId);



module.exports = router;
