import User from "../UserClass.js";

export default class Login{

    constructor(socket)
    {
        this._socket= socket;
        this._view = 'login.html'
    }
    get view(){
        return this._view
    }
    fetchUser(){
        const nameInput = document.getElementById('userName');
        const pwInput = document.getElementById('password');
        let username = nameInput.value
        let password = pwInput.value;
        // console.log(bcrypt.hash(password, saltRounds, function(err, hash){}))
        // hashing should happen here
        return new User(username, password)
    }
    listen(){
        const login = document.getElementById('login')
        login.addEventListener('click', () => {
            let newUser = this.fetchUser()
            this._socket.emit('authenticateMe', newUser)
        });
    }
}