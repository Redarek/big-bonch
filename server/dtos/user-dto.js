module.exports = class UserDto {
    email;
    _id;
    walletAddress;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this._id = model._id;
        this.walletAddress = model.walletAddress
        this.isActivated = model.isActivated;
    }
}
