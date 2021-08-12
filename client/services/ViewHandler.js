import Login from "../views/Login.js";
import Chat from "../views/Chat.js";
import Register from "../views/Register.js";
export default class ViewHandler {

    constructor(socket) {
        this._login = new Login(socket);
        this._chat = new Chat(socket);
        this._register = new Register(socket);
    }

    get login(){
        return this._login;
    }

    get chat(){
        return this._chat;
    }
    get register(){
        return this._register;
    }
}