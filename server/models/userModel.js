const { Schema, model } = require('mongoose');

const userSchema =  new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        unique: true,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String
    },
    universityData: {
        firstName: { type: String },
        secondName: { type: String },
        patronymic: { type: String },
        faculty: { type: String },
        job: { type: String }
    },
});

module.exports = model('User', userSchema);