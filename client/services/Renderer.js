export default class Renderer{
    constructor(filename, location) {
        this._filename = filename
        this._location = location
    }

    async render(className){
        return fetch('./views/'+this._filename)
            .then((fetchedView)=>{
                return fetchedView.text();
            })
            .then((pureHtml)=>{
                let element = document.createElement('div');
                    element.className = className;
                    element.innerHTML = pureHtml;
                return element;
            })
            .then((viewEl)=>{
                this._location.innerHTML = "";
                this._location.appendChild(viewEl);
            })

    }
}