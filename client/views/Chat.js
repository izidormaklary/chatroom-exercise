import PublicRoom from "./PublicRoom.js";
import PrivateRoom from "./PrivateRoom.js";

export default class Chat {
    #_user;
    #_lastUser = "";
    _tab;
    _userlist;
    _private = "";
    _publicRoom;
    _privateRoom;
    _currentChat;

    constructor(socket) {
        this._socket = socket;
        this._view = 'chat.html';
        this._tab = 'userList';

    };

    controller(activeUserArray) {

        // const target = document.getElementById("target");
        const toMe = document.getElementById("sendToMe");
        // const message = document.getElementById("message");
        const toAll = document.getElementById("sendToAll");
        const sidebarContent = document.getElementById("sidebarContent");
        const tabUsers = document.getElementById("tabUsers");
        const tabRooms = document.getElementById("tabRooms");
        const tabFriends = document.getElementById("tabFriends");
        this._publicRoom = new PublicRoom(this._socket, this.#_user);
        this._currentChat = this._publicRoom
        toAll.addEventListener("click", e => this._currentChat.sendMessage());
        this._socket.on('displayMessage', data => {
            this._currentChat === this._publicRoom
                ? this._currentChat.renderMessage(data)
                : this._privateRoom.backupMessage(data);
        });

        this._socket.on('displayPrivate', data => {
            this._currentChat === this._privateRoom
                ? this._currentChat.renderMessage(data)
                : this._publicRoom.backupMessage(data)

        });

        toMe.addEventListener("click", e => this._currentChat.toMe());
      this.makeUserList(activeUserArray);

        this._socket.on('updateActiveUsers', (user) => {
            if (this._tab === 'userList') {
                this.appendUserToList(user);
            }
        });
        const notification = document.getElementById('notification');
        const message = document.getElementById('notificationMessage');
        const closeNotification = document.getElementById('closeNotification');

        this._socket.on("notificationToPrivate", user => {
            message.innerText = user + " wants to chat with you"
            if (this._currentChat !== this._privateRoom) {
                notification.style.bottom = '20px'
                closeNotification.addEventListener('click', ev => {
                    notification.style.bottom = '-90px'
                })
                message.addEventListener('click', ev => {
                    this._privateRoom = new PrivateRoom(this._socket, this.#_user, user);
                    this._currentChat = this._privateRoom;
                    this.changeRoom(user);
                    // this._currentChat.systemMessage(user+" joined the chat")
                    notification.style.bottom = '-90px';
                })
                closeNotification.addEventListener('click', xClick => {
                    notification.style.bottom = '-90px';
                    this._socket.emit('privateReject', {userTo: user, from: this.#_user});
                    // closeNotification.removeEventListener('click', xClick)
                })
            }
        });
        this._socket.on('rejectedPrivate', from => {
            // message.removeEventListener('click', messageClick)
            this._currentChat = this._publicRoom
            this.changeRoom()
            message.innerText = from + " rejected the private chat :("
            notification.style.bottom = '20px'
            message.addEventListener('click', ev => {
                notification.style.bottom = '-90px'
            })

        })
    }


    makeUserList(userArr) {
        this._userlist = document.createElement('ul')

        this._userlist.setAttribute('id', 'userList');

        sidebarContent.appendChild(this._userlist);

        if(userArr){
            userArr.forEach((el) => {
                this.appendUserToList(el)
            })
            let allUserLi = document.querySelectorAll('.activeUserList');

            allUserLi.forEach(el => this.userClickListener(el))
        }
    }


    appendUserToList(user) {
        // this._userlist = this._userlist ?  this._userlist : document.createElement('ul');

        let li = document.createElement('li');
        li.className = 'activeUserList';
        li.innerText = user;
        this._userlist.prepend(li)
    };

    userClickListener(userLi) {
        userLi.addEventListener('click', (ev) => {
            this._privateRoom = new PrivateRoom(this._socket, this.user, ev.currentTarget.innerText)
            console.log(this._privateRoom)
            this._currentChat = this._privateRoom
            this.changeRoom(ev.currentTarget.innerText);
            this._socket.emit('startPrivateWith', {newName: ev.currentTarget.innerText, from: this.#_user})
        })
    }

    changeRoom(newName) {
        const chatroom = document.getElementById('chatRoom');
        chatroom.innerText = this._currentChat === this._publicRoom ? "Public chat" : "private chat with: " + newName;
        target.innerHTML = "";
    }

    get view() {
        return this._view;
    };

    set user(user) {
        this.#_user = user;
    };

    get user() {
        return this.#_user;
    }
}
