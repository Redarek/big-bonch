module.exports = class UserDto {
    email;
    _id;
    walletAddress;
    isActivated;
    universityData;

    constructor(model) {
        this.email = model.email;
        this._id = model._id;
        this.walletAddress = model.walletAddress
        this.isActivated = model.isActivated;
        this.universityData = model.universityData
    }
}
