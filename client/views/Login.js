export default class Login{

    constructor(socket)
    {
        this._socket= socket;
        this._view = 'login.html'
    }
    get view(){
        return this._view
    }
}