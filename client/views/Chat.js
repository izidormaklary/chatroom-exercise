export default class Chat {
    #_user;
    constructor(socket) {
        this._socket= socket;
        this._view = 'chat.html'
    };

    get view() {
        return this._view;
    };

    renderMessage(data) {
        let messageBody = document.createElement('div');
        messageBody.className = 'messageBody';
        messageBody.innerText += data.sender + ":" + data.message;
        target.appendChild(messageBody);
        // target.innerHTML += '<br>';
    };

    toMe(){
        let txtMessage = message.value;
        this._socket.emit('sendToMe', (txtMessage));
    };
    toALl(){
            let txtMessage = message.value;
            let username = this.#_user._username;
            this._socket.emit('sendToAll', {message: txtMessage, sender: username});
    };

    set user(user){
        this.#_user = user;
    }

    controller(){
        const target = document.getElementById("target");
        const toMe = document.getElementById("sendToMe");
        const message = document.getElementById("message");
        const toAll = document.getElementById("sendToAll");

        toAll.addEventListener("click", e => this.toALl());

        toMe.addEventListener("click", e => this.toMe());

        this._socket.on('displayMessage', data => this.renderMessage(data));
    }
}

