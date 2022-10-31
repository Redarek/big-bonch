module.exports = class UserDto {
    email;
    id;
    walletAddress;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.walletAddress = model.walletAddress
        this.isActivated = model.isActivated;
    }
}