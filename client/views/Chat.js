export default class Chat {
    #_user;
    #_lastUser = "";
    constructor(socket) {
        this._socket= socket;
        this._view = 'chat.html'
    };

    get view() {
        return this._view;
    };

    renderMessage(data) {


        let message = document.createElement('p');

        message.innerText = data.message;
        message.className = 'message'
        console.log(this.lastuser)
        console.log(data.user)
        if (this.lastuser != data.sender ){
            let sender = document.createElement('p');
            sender.innerText = data.sender
            sender.className = 'sender';

            let messageBody = document.createElement('div');
            messageBody.className = 'messageBody';
            messageBody.appendChild(sender);
            target.prepend(messageBody);
            messageBody.appendChild(message);
        }else{
            target.firstChild.appendChild(message)
        }

        this.lastuser= data.sender
    };
    set lastuser(user){
        this.#_lastUser = user;
    };
    get lastuser(){
        return this.#_lastUser;
    }
    toMe(){
        let txtMessage = message.value;
        this._socket.emit('sendToMe', (txtMessage));
    };
    toALl(){
            let txtMessage = message.value;
            message.value = `` ;
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

