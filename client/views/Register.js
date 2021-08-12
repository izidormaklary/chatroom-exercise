export default class Register{

    constructor(socket)
    {
        this._socket= socket;
        this._view = 'register.html'
    }
    get view(){
        return this._view
    }
}