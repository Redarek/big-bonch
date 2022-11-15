const nftModel = require('../models/nftModel');

class NftService {
    async createNftMetadata (nftMetadata) {
        const nft = await nftModel.create(nftMetadata)
        return nft;
    }

    async getNftMetadataByTokenId(tokenId) {
        const nftMetadata = await nftModel.findOne({tokenId: tokenId})
        const croppedNftMetadata = {
            tokenId: nftMetadata.tokenId,
            name: nftMetadata.name,
            description: nftMetadata.description,
            external_url: nftMetadata.external_url,
            attributes: nftMetadata.attributes,
        }
        return croppedNftMetadata;
    }

    async getNewTokenId() {
        const tokenId = await nftModel.countDocuments();
        return tokenId + 1;// количество NFT + 1 = новый tokenId
    }
}

module.exports = new NftService();