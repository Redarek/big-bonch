const ApiError = require('../exceptions/ApiError')
const nftService = require('../service/nftService')

class NftController {
    async mintNft(req, res, next) {
        try {
            const {name, description, image, attributes, tokenId} = req.body;
            const external_url = `http://localhost:8080/api/${tokenId}`;
            const nftMetadata = await nftService.mintNft({name, description, image, external_url: external_url, attributes, tokenId});
            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    async getNftByTokenId(req, res, next) {
        try {
            
            const nftMetadata = await nftService.getNftByTokenId(req.params.id)
            return res.json(nftMetadata);
        } catch (error) {
            next(error);
        }
    }

    

}

module.exports = new NftController();