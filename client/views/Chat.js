import PublicRoom from "./ChatRooms.js";

export default class Chat {
    #_user;
    #_lastUser = "";
    _tab;
    _userlist;
    _private = "";
    _chatroom;
    constructor(socket) {
        this._socket= socket;
        this._view = 'chat.html';
        this._tab = 'userList';

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
        this._chatroom = new PublicRoom(this._socket, this.#_user)
        toAll.addEventListener("click", e => this._chatroom.sendMessage());

        // toAll.addEventListener("click", e => this.private ? this.toPrivate(this.private) :this.toALl());
        // if(this.private){
        //     this.toPrivate(this.private)
        // }else{
        //     this.toALl()
        // }
        this._socket.on('displayMessage', data => this._chatroom.renderMessage(data));

        toMe.addEventListener("click", e => this._chatroom.toMe());
        activeUserArray[0] ? this.makeUserList(activeUserArray):"";

        this._socket.on('updateActiveUsers', (user)=>{
            if(this._tab === 'userList'){
                this.appendUserToList(user);
            }
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

        allUserLi.forEach((liEl)=>{
            liEl.addEventListener('click', (ev)=>{
                this.changeRoom("Private chat with: "+ ev.currentTarget.innerText)
                this._private = ev.currentTarget.innerText
            })
        })
    }


    appendUserToList( user){

        let li = document.createElement('li');
        li.className = 'activeUserList';
        li.innerText = user;
        this._userlist.prepend(li)
    };

    userClickListener(userLi){
        userLi.addEventListener('click', ()=>{

        })
    }
    changeRoom(newName){
        const chatroom = document.getElementById('chatRoom');
        chatroom.innerText= newName;
        target.innerHTML = "";
    }
    get view() {
        return this._view;
    };
    set user(user){
        this.#_user = user;
    };
}
