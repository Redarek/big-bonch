const { Schema, model } = require('mongoose');

const nftSchema = new Schema({
    tokenId: {type: String, required: true, unique: true},
    name: {type: String},
    // collection_name: {type: String, default: 'Big Bonch'},
    // artist_address: {type: String, default: ''},
    description: {type: String},
    image: {type: String},
    external_url: {type: String},
    attributes: {type: Array}
});

module.exports = model('Nft', nftSchema);