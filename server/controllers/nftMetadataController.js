const { trusted } = require('mongoose');
const ApiError = require('../exceptions/ApiError')
const nftMetadataService = require('../service/nftMetadataService')
const API_URL = process.env.NODE_ENV === "production" ? 'https://big-bonch.herokuapp.com/api' : 'http://localhost:8080/api';


class NftMetadataController {
    async createNftMetadata(req, res, next) {
        try {
            console.log('create nft')
            const {name, description, image, attributes} = req.body;
            const tokenId = await nftMetadataService.getNewTokenId();
            const external_url = `${API_URL}${tokenId}`;
            const expectedOwnerAddress = await nftMetadataService.getWalletAddressByUserId(req.user._id);

            const nftMetadata = await nftMetadataService.createNftMetadata({
                tokenId, 
                name, 
                description, 
                image, 
                external_url: external_url, 
                attributes, 
                ownerId: req.user._id,
                expectedOwnerAddress: expectedOwnerAddress,
                actualOwnerAddress: expectedOwnerAddress});

            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    async getNftMetadataByTokenId(req, res, next) {
        try {
            const nftMetadata = await nftMetadataService.getNftMetadataByTokenId(req.params.id)
            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    async getNewTokenId(req, res, next) {
        try {
            const tokenId = await nftMetadataService.getNewTokenId();
            return res.json(tokenId)
        } catch (error) {
            next(error);
        }
    }

    async getNftMetadatasByUserId(req, res, next) {
        try {
            const nftMetadatas = await nftMetadataService.getNftMetadatasByUserId(req.params.id);
            return res.json(nftMetadatas)
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new NftMetadataController();