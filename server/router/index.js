const Router = require('express').Router;
const userController = require('../controllers/userController');
const nftMetadataController = require('../controllers/nftMetadataController');
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

// NFT metadata
router.get('/token/id', authMiddleware, nftMetadataController.getNewTokenId);
router.post('/token-metadata', authMiddleware, nftMetadataController.createNftMetadata)
router.get('/token/:id', nftMetadataController.getNftMetadataByTokenId);
router.get('/tokens/:id', nftMetadataController.getNftMetadatasByUserId)
router.patch('/token/:id', nftMetadataController.assignIdToNftMetadata)

// Specific NFTs
router.get('/nft/first-ever-pass', nftMetadataController.getFirstEverPass);

module.exports = router;
