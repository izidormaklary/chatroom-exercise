import PublicRoom from "./PublicRoom.js";

export default class PrivateRoom extends PublicRoom{

    constructor(props, privateUsr) {
        super(props);
        this._private = privateUsr
    }

    sendMessage() {
        let txtMessage = this._messageInput.value;
        let username = this.private
        this._socket.emit('privateMessage', {message: txtMessage, to: username});
    }
    get private(){
        return this._private
    }
}