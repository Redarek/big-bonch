const nftMetadataModel = require('../models/nftMetadataModel');
const userModel = require('../models/userModel');

class NftMetadataService {
    async createNftMetadata (nftMetadata) {
        const nft = await nftMetadataModel.create(nftMetadata)
        console.log(nft)
        return nft;
    }

    async getNftMetadataByTokenId(tokenId) {
        const nftMetadata = await nftMetadataModel.findOne({tokenId: tokenId})
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
        const tokenId = await nftMetadataModel.countDocuments();
        return tokenId + 1;// количество NFT + 1 = новый tokenId
    }

    async getNftMetadatasByUserId(id) {
        const nftMetadatas = await nftMetadataModel.find({ownerId: id});
        return nftMetadatas;
    }

    async getWalletAddressByUserId(id) {
        const user = await userModel.findOne({_id: id})
        console.log('получен адрес')
        console.log(user.walletAddress)
        return user.walletAddress;
    }
}

module.exports = new NftMetadataService();