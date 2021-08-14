export default class PublicRoom {
    #_lastuser='';
    constructor(socket, user) {
        this._user = user
        this._socket = socket;
        this._target = document.getElementById("target");
        this._messages = [];
        this._messageInput = document.getElementById("message");
        // this._toAll = document.getElementById("sendToAll");
    }

    controller(){
        this._socket.on('displayMessage', data => this.renderMessage(data));
    }

    renderMessage(data) {
        let message = document.createElement('p');

        message.innerText = data.message;
        message.className = 'message';
        if (this._lastuser !== data.sender) {
            let sender = document.createElement('p');
            sender.innerText = data.sender;
            sender.className = 'sender';

            let messageBody = document.createElement('div');
            messageBody.className = 'messageBody';
            messageBody.appendChild(sender);
            this._target.prepend(messageBody);
            messageBody.appendChild(message);
        } else if (target.firstChild) {
            target.firstChild.appendChild(message);
        } else {
            target.appendChild(message);
        }
        this._lastuser = data.sender;
    };

    backupMessage(data) {
        this._messages.push(data);
    };

    toMe() {
        let txtMessage = this._messageInput.value;
        this._socket.emit('sendToMe', (txtMessage));
    };

    sendMessage() {
        let txtMessage = this._messageInput.value;
        this._messageInput.value = ``;
        let username = this._user;
        this._socket.emit('sendToAll', {message: txtMessage, sender: username});
    };
    // toPrivate() {
    //     let txtMessage = this._messageInput.value;
    //     let username = this.private
    //     this._socket.emit('privateMessage', {message: txtMessage, to: username});
    // }

}