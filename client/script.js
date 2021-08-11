import Renderer from "./Renderer.js";
import ViewHandler from "./ViewHandler.js";

const socket = io.connect();

const render_to = document.getElementById("root")

const views = new ViewHandler();

const renderLogin = new Renderer(views.login.view, render_to)
const renderChat = new Renderer(views.chat.view, render_to)

let user;
renderLogin.render().then(() => {
    let nameInput = document.getElementById('userName');
    let pwInput = document.getElementById('password');
    document.getElementById('login')
        .addEventListener('click', () => {
            let username = nameInput.value
            let password = pwInput.value
            user = {'username':username,'password':password}
            socket.emit('authenticateMe', user)
        })
})




socket.on('authenticate', (success) => {
    if (success) {
        renderChat.render().then(() => {
            const target = document.getElementById("target");
            const toMe = document.getElementById("sendToMe");
            const message = document.getElementById("message");
            const toAll = document.getElementById("sendToAll");
            toAll.addEventListener("click", () => {
                let txtMessage = message.value;
                let username = user.username
                socket.emit('sendToAll', {message:txtMessage, sender:username});
            });

            toMe.addEventListener("click", () => {
                let txtMessage = message.value;
                socket.emit('sendToMe', (txtMessage));
            });
            socket.on('displayMessage', function(data){
                target.innerText +=data.sender +":"+ data.message;
                target.innerHTML += '<br>'
            });
        })
    }
})
