export default class PublicRoom {
    #_lastuser = '';

    constructor(socket, user) {
        this._user = user
        this._socket = socket;
        this._target = document.getElementById("target");
        this._messages = [];
        this._messageInput = document.getElementById("message");
    }
    systemMessage(message){
        let sysmessage = document.createElement("div");
        sysmessage.className = "systemMessage";
        sysmessage.innerText = message;
        this._target.prepend(sysmessage);
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
}

