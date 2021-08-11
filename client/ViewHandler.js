import Login from "./Login.js";
import Chat from "./Chat.js";
export default class ViewHandler {

    constructor() {
        this._login = new Login();
        this._chat = new Chat();
    }

    get login(){
        return this._login;
    }

    get chat(){
        return this._chat;
    }
}