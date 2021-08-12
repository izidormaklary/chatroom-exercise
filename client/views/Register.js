import Login from "./Login.js";

export default class Register extends Login{

    constructor(props) {
        super(props);
        this._view = 'register.html'
    }
    listen(){
        const register = document.getElementById('register')
        register.addEventListener('click', () => {
            // emits the filled user data checks for username validity (no-repeat)
            let newUser = this.fetchUser()
            console.log(newUser)
            this._socket.emit('register', newUser)
    });
    }

}