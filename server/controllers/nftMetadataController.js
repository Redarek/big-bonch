const { trusted } = require('mongoose');
const ApiError = require('../exceptions/ApiError')
const nftMetadataService = require('../service/nftMetadataService')
const API_URL = process.env.NODE_ENV === "production" ? 'https://big-bonch.herokuapp.com/api' : 'http://localhost:8080/api';


class NftMetadataController {
    async createNftMetadata(req, res, next) {
        try {
            console.log('creating nft metadata')
            const {name, description, image, attributes} = req.body;
            const heHas = await nftMetadataService.checkIfUserHasNft(name, req.user._id)
            if (heHas) {
                console.log('user already has the NFT with name ' + name)
                return
            }
            // const tokenId = await nftMetadataService.getNewTokenId();
            // const external_url = `${API_URL}${tokenId}`;
            const expectedOwnerAddress = await nftMetadataService.getWalletAddressByUserId(req.user._id);

            const nftMetadata = await nftMetadataService.createNftMetadata({
                // tokenId, 
                name, 
                description, 
                image, 
                // external_url: external_url, 
                attributes, 
                ownerId: req.user._id,
                expectedOwnerAddress: expectedOwnerAddress,
                // actualOwnerAddress: expectedOwnerAddress
            });

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
            // const actualNftMetadatas = await nftMetadataService.setActualOwnerOfNft(nftMetadatas)
            return res.json(nftMetadatas)
        } catch (error) {
            next(error);
        }
    }

    async assignIdToNftMetadata(req, res, next) {
        try {
            const tokenId = await nftMetadataService.getNewTokenId();
            const external_url = `${API_URL}/${tokenId}`;
            const update = {tokenId: tokenId, external_url: external_url}
            const nftMetadata = await nftMetadataService.assignIdToNftMetadata(req.params.id, update)
            return res.json(nftMetadata);
        } catch (error) {
          next(error);  
        }
    }

    async getFirstEverPass(req, res, next) {
        try {
            const firstEverPass = await nftMetadataService.getFirstEverPass();
            return res.json(firstEverPass)
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new NftMetadataController();