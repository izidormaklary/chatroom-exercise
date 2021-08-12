import Renderer from "./services/Renderer.js";
import ViewHandler from "./services/ViewHandler.js";
import User from "./UserClass.js";

const socket = io.connect();

const render_to = document.getElementById("root")

const views = new ViewHandler(socket);

const renderLogin = new Renderer(views.login.view, render_to)
const renderReg = new Renderer(views.register.view, render_to)
const renderChat = new Renderer(views.chat.view, render_to)

let user;
renderLogin.render().then(() => {
    const nameInput = document.getElementById('userName');
    const pwInput = document.getElementById('password');
    const toRegistration = document.getElementById('toregister');

    function fetchUser() {
        let username = nameInput.value
        let password = pwInput.value // hashing should happen here
        return new User(username, password)
    }

    toRegistration.addEventListener('click', () => {
        renderReg.render()
            .then(() => {
                const register = document.getElementById('register')
                register.addEventListener('click', () => {
                    socket.emit('register', fetchUser())
                });
            });
    });

    document.getElementById('login')
        .addEventListener('click', () => {
            socket.emit('authenticateMe', fetchUser())
        });
});


socket.on('authenticate', (success) => {
    if (success) {
        renderChat.render().then(() => {
            const target = document.getElementById("target");
            const toMe = document.getElementById("sendToMe");
            const message = document.getElementById("message");
            const toAll = document.getElementById("sendToAll");

            toAll.addEventListener("click", e => views.chat.toALl(user));
            toMe.addEventListener("click", e => views.chat.toMe());

            socket.on('displayMessage', data => views.chat.renderMessage(data));
        })
    }
})

socket.on('error',(message)=> {
    alert(message)
})

