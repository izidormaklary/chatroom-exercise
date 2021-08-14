class User{
    _password;
    _username;
    _active;
    _socketId;
    // profilePic;
    constructor(username,password) {
        this._username = username;
        this._password = password;
        this._active = false;
        this._socketId = '';
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }
}

module.exports = User;