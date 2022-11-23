const nftMetadataModel = require('../models/nftMetadataModel');
const userModel = require('../models/userModel');
const { ethers } = require("ethers");

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
        const tokenId = await nftMetadataModel.countDocuments({tokenId: {$exists: true}});
        return tokenId - 1;// количество NFT - 1 = новый tokenId
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

    async assignIdToNftMetadata(id, update) {
        const nftMetadata = await nftMetadataModel.findByIdAndUpdate({_id: id}, update)
        return nftMetadata;
    }

    async setActualOwnerOfNft(nftMetadatas) {
        const contractAddr = '0xd57354f4AbF8B0A15fc480874c70CB21260cee3d'
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", [])
            const signer = provider.getSigner()
            const abi = [
                "function ownerOf(uint256 tokenId) external view returns (address)",
                "function mint(uint numberOfTokens) external payable",
                "function balanceOf(address owner) view returns (uint256)"
            ]
            const contract = new ethers.Contract(
                contractAddr,
                abi, signer)
            try {
                // nftMetadatas.forEach (async (metadata, index) => {
                //     const expected = metadata.expectedOwnerAddress
                //     const actual = await contract.ownerOf(ethers.BigNumber.from(metadata.tokenId))
                //     if (expected != actual) {
                //         return metadata[index].expectedOwnerAddress = actual;
                //     }
                // })
                const actualNftMetadatas = nftMetadatas.map(async (metadata, index) => {
                    const expected = metadata.expectedOwnerAddress
                    const actual = await contract.ownerOf(ethers.BigNumber.from(metadata.tokenId))
                    if (expected === actual) {
                        return metadata[index]
                    }
                })
                return actualNftMetadatas
                // console.log('response: ', response)
            } catch (error) {
                console.log("error", error)
            }
        }
    }
}

module.exports = new NftMetadataService();