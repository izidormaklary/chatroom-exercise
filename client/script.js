import Renderer from "./services/Renderer.js";
import ViewHandler from "./services/ViewHandler.js";


const socket = io.connect();

const render_to = document.getElementById("root")

const views = new ViewHandler(socket);

const renderLogin = new Renderer(views.login.view, render_to)
const renderReg = new Renderer(views.register.view, render_to)
const renderChat = new Renderer(views.chat.view, render_to)

renderLogin.render('login').then(() => {
    const toRegistration = document.getElementById('toregister');
    // listens to the button leading to registration rather then login
    toRegistration.addEventListener('click', () => {
        renderReg.render('registration')
            .then(() => {
                // after rendering properly sets the relevant listener to submit the registration
                views.register.listen()
            });
    });
    // listens to login submit, then asks for authentication,
    // either success(renders chat view) or alerting error
    views.login.listen()
});

// case where user is authenticated (either through registration or login)
socket.on('authenticate', function (data) {
    if (data.success) {
        renderChat.render('chat').then(() => {
            // needs user for certain methods
            views.chat.user = data.user;
            console.log(data.user)
            // triggers the brain of the chat class,
            // sets all the event/socket-listeners/emitters
            views.chat.controller();
        })
    }
})

//general socket listener for error
socket.on('error', (message) => {
    alert(message)
})