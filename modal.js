class Modal extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
            <style>

                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }

                :host([opened]) #backdrop {
                    opacity: 1;
                    pointer-events: all;
                }

                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }

                #modal {
                    z-index: 100;
                    position: fixed;
                    top: 15vh;
                    left: 25%;
                    width: 50%;
                    background: white;
                    border-radius: 3px;
                    box-shadow: 0px 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                }

                header {
                    padding: 1rem;
                }

                ::slotted(h1) {
                    font-size: 2rem;
                }

                #main {
                    padding: 1rem;
                }

                #actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                #actions button {
                    margin: 0 1rem;
                }

            </style>

            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <slot name="title">Please Confirm Payment</slot>
                </header>
                <section id="main">
                    <slot></slot>
                </section>
                <section id="actions">
                    <button id="cancelBtn">Cancel</button>
                    <button id="confirmBtn">Confirm</button>
                </section>
            </div>
        `;

        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange', (event) => {
            console.dir(slots[1].assignedNodes());
        });

        const cancelButton = this.shadowRoot.querySelector('#cancelBtn');
        const confirmButton = this.shadowRoot.querySelector('#confirmBtn');

        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));
        // cancelButton.addEventListener('cancel', () => {
        //     console.log('cancel inside');
        // })
    }

    // This is awesome, but not the best way

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name === 'opened') {
    //         if (this.hasAttribute('opened')) {
    //             this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
    //             this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
    //             this.shadowRoot.querySelector('#modal').style.opacity = 1;
    //             this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
    //         }
    //     }
    // }

    // static get observedAttributes() {
    //     return ['opened'];
    // }

    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if (this.hasAttribute('opened')) {
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }

    _cancel(event) {
        this.hide();
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }
    // Bubbles allows us to define whether this even t should 'bubble up' or not;
    // in other words, if there are no listeners on the element, it would check parent,
    // then grandparent, etc., until it found a listener.
    // Composed: true allows the event to leave the shdow DOM.
    // Both are necessary in this case.

    _confirm() {
        this.hide();
        const confirmEvent = new Event('confirm');
        this.dispatchEvent(confirmEvent);
    }
    // This works without all of that, because you are calling the method on the 
    // custom element itself, instead of through event.target

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }

}

customElements.define('uc-modal', Modal);
