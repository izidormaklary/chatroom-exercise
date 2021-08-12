export default class User{
    _password;
    _username;
    // profilePic;
    constructor(username,password) {

        this._username = username
        this._password = password;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }
}