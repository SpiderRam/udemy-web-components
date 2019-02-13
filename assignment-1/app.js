class App extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <button>Show</button>
            <p id="info-box" style="display: none">More infos!</p>
        `;
    }

    connectedCallback() {
        const infoButton = this.shadowRoot.querySelector('button');
        const text = this.shadowRoot.querySelector('#info-box');
        let isHidden = true;

        infoButton.addEventListener('click', () => {
            if (isHidden) {
                text.style.display = 'block';
                infoButton.textContent = 'Hide';
                isHidden = false;
            } else {
                text.style.display = 'none';
                infoButton.textContent = 'Show';
                isHidden = true;
            }
        })
    }
}

customElements.define('uc-app-1', App);