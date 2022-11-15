const ApiError = require('../exceptions/ApiError')
const nftService = require('../service/nftService')

class NftController {
    async createNftMetadata(req, res, next) {
        try {
            const {name, description, image, attributes} = req.body;
            const tokenId = await nftService.getNewTokenId();
            const external_url = `http://localhost:8080/api/${tokenId}`;
            const nftMetadata = await nftService.createNftMetadata({name, description, image, external_url: external_url, attributes, tokenId});
            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    async getNftMetadataByTokenId(req, res, next) {
        try {
            const nftMetadata = await nftService.getNftMetadataByTokenId(req.params.id)
            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    async getNewTokenId(req, res, next) {
        try {
            const tokenId = await nftService.getNewTokenId();
            return res.json(tokenId)
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new NftController();