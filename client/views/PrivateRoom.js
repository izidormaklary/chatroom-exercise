import PublicRoom from "./PublicRoom.js";

export default class PrivateRoom extends PublicRoom{

    constructor(socket, user, privateUsr) {
        super(socket, user);
        this._private = privateUsr
        // this.systemMessage(you+" joined the chat")

    }

    sendMessage() {
        let txtMessage = this._messageInput.value;
        let username = this.private
        this._socket.emit('privateMessage', {message: txtMessage, userTo: username, from:this._user});
    }
    get private(){
        return this._private
    }
}