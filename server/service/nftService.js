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

    async getNewTokenId() {
        const tokenId = await nftModel.countDocuments();
        return tokenId + 1;// количество NFT + 1 = новый tokenId
    }
}

module.exports = new NftService();