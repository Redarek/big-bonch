const ApiError = require('../exceptions/ApiError')
const nftMetadataService = require('../service/nftMetadataService')

class NftMetadataController {
    async createNftMetadata(req, res, next) {
        try {
            const {name, description, image, attributes} = req.body;
            const tokenId = await nftMetadataService.getNewTokenId();
            const external_url = `http://localhost:8080/api/${tokenId}`;
            const nftMetadata = await nftMetadataService.createNftMetadata({name, description, image, external_url: external_url, attributes, tokenId});
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

}

module.exports = new NftMetadataController();