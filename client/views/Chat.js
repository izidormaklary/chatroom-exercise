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
    constructor(socket) {
        this._socket= socket;
        this._view = 'chat.html';
        this._tab = 'userList';
        this._currentChat = "public"

    };

    controller(activeUserArray){

        // const target = document.getElementById("target");
        const toMe = document.getElementById("sendToMe");
        // const message = document.getElementById("message");
        const toAll = document.getElementById("sendToAll");
        const sidebarContent = document.getElementById("sidebarContent");
        const tabUsers = document.getElementById("tabUsers");
        const tabRooms = document.getElementById("tabRooms");
        const tabFriends = document.getElementById("tabFriends");
        this._publicRoom = new PublicRoom(this._socket, this.#_user);

        console.log(this.p);
        toAll.addEventListener("click", e =>{
            if(this._currentChat === "public"){
                this._publicRoom.sendMessage();
            }else if(this._currentChat === "private"){
                this._privateRoom.sendMessage()
            }
        });
        this._socket.on('displayMessage', data => this._publicRoom.renderMessage(data));

        toMe.addEventListener("click", e => this._publicRoom.toMe());
        activeUserArray[0] ? this.makeUserList(activeUserArray):"";

        this._socket.on('updateActiveUsers', (user)=>{
            if(this._tab === 'userList'){
                this.appendUserToList(user);
            }
        });
        this._socket.on("notificationToPrivate", user=>{
            const notification = document.getElementById('notification')
            notification.style.bottom = '20px'

            notification.addEventListener('click', ev=>{
                this.changeRoom(user);
                this._privateRoom = new PrivateRoom(this._socket, this.#_user, user);
                notification.style.bottom = '-90px'
            })
        });
    }


    makeUserList(userArr){
        this._userlist = document.createElement('ul')

        this._userlist.setAttribute('id','userList');

        sidebarContent.appendChild(this._userlist);
            userArr.forEach(( el) => {
                this.appendUserToList( el)
            })
        let allUserLi = document.querySelectorAll('.activeUserList');

        allUserLi.forEach(el=>this.userClickListener(el))
    }


    appendUserToList( user){

        let li = document.createElement('li');
        li.className = 'activeUserList';
        li.innerText = user;
        this._userlist.prepend(li)
    };

    userClickListener(userLi){
        userLi.addEventListener('click', (ev)=>{
            this._privateRoom = new PrivateRoom(this._socket, this.#_user, ev.currentTarget.innerText)
            this.changeRoom("Private chat with: "+ ev.currentTarget.innerText)
        })
    }
    changeRoom(newName){
        this._currentChat = this._currentChat === "public" ? "private" : "public";
        const chatroom = document.getElementById('chatRoom');
        chatroom.innerText = newName;
        target.innerHTML = "";
        if (this._currentChat === "private") {
            this._socket.emit('startPrivateWith', newName)
        }

    }
    get view() {
        return this._view;
    };
    set user(user){
        this.#_user = user;
    };
}
