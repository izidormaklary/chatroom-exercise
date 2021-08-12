export default class Chat {

    constructor(socket) {
        this._socket= socket;
        this._view = 'chat.html'
    };

    get view() {
        return this._view;
    };

    renderMessage(data) {
        target.innerText += data.sender + ":" + data.message;
        target.innerHTML += '<br>';
    };

    toMe(){
        let txtMessage = message.value;
        this._socket.emit('sendToMe', (txtMessage));
    };
    toALl(user){
            let txtMessage = message.value;
            let username = user.username;
            this._socket.emit('sendToAll', {message: txtMessage, sender: username});
    };
}