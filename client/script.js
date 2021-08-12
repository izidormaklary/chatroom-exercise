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

    // listens to the button leading to registration rather then login
    toRegistration.addEventListener('click', () => {
        renderReg.render()
            .then(() => {
                // after rendering properly sets the relevant listener to submit the registration
                const register = document.getElementById('register')
                register.addEventListener('click', () => {
                    // emits the filled user data checks for username validity (no-repeat)
                    socket.emit('register', fetchUser())
                });
            });
    });

    // listens to login submit, then asks for authentication,
    // either success(renders chat view) or alerting error
    const login = document.getElementById('login')
        login.addEventListener('click', () => {
            socket.emit('authenticateMe', fetchUser())
        });
});

// case where user is authenticated (either through registration or login)
socket.on('authenticate', function(data){
    if (data.success) {
        renderChat.render().then(() => {
            // needs user for certain methods
            views.chat.user = data.user;
            // triggers the brain of the chat class,
            // sets all the event/socket-listeners/emitters
            views.chat.controller();
        })
    }
})

//general socket listener for error
socket.on('error',(message)=> {
    alert(message)
})