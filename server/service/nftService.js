const nftModel = require('../models/nftModel');

class NftService {
    async mintNft(nftMetadata) {
        const nft = await nftModel.create(nftMetadata)
        return nft;
    }

    async getNftByTokenId(tokenId) {
        const nft = await nftModel.findOne({tokenId: tokenId})
        return nft;
    }
}

module.exports = new NftService();