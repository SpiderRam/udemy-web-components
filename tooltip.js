class Tooltip extends HTMLElement {
    constructor() {
        super();
        // this._tooltipContainer;
        this._tooltipVisible = false;
        this.attachShadow({ mode: 'open' });
        this._tooltipText = "Default tooltip text";
        this._tooltipIcon;
        this.shadowRoot.innerHTML = `
            <style>

                div {
                    font-weight: normal;
                    background-color: black;
                    color: white;
                    position: absolute;
                    top: 1.5rem;
                    left: 0.75rem;
                    z-index: 10;
                    padding: 0.15rem;
                    border-radius: 3px;
                    box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
                }

                :host {
                    position: relative;
                }

                :host(.important) {
                    background: var(--color-primary);
                    padding: 0.25rem;
                }

                :host-context(p) {
                    font-weight: bold;
                }

                .highlight {
                    background-color: red;
                }

                ::slotted(.highlight) {
                    border-bottom: 1px dotted red;
                }

                .icon {
                   background-color: black;
                   color: white;
                   padding: 0.15rem 0.5rem;
                   text-align: center;
                   border-radius: 50%;
                }

            </style>
            <slot></slot>
            <span class="icon"> ?</span>
        `;
    }
    
    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        this._tooltipIcon = this.shadowRoot.querySelector('span');
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        if (oldValue === newValue) {
            return;
        }
        if (name === 'text') {
            this._tooltipText = newValue;
        }
    }

    static get observedAttributes() {
        return ['text'];
    }

    disconnectedCallback() {
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    // Method responsible for updating the DOM
    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if (this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }

    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }

    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }

    // This is really the best for such a simple app, but better practice
    // is to use the _render function 
    
    // _showTooltip() {
    //     this._tooltipContainer = document.createElement('div');
    //     this._tooltipContainer.textContent = this._tooltipText;
    //     this.shadowRoot.appendChild(this._tooltipContainer);
    // }

    // _hideTooltip() {
    //     this.shadowRoot.removeChild(this._tooltipContainer)
    // }
}

customElements.define('uc-tooltip', Tooltip);

// -----------------------------------------------------------------------
// Slotted text will not take styles defined on the component, 
// unless you use the ::slotted() selector.
// To style ANY slotted content, use ::slotted(*).
// Note, you can't style nested components this way, i.e. .highlight div.
// Styles applied to the same element in the shadow dom will be overridden 
// by anything that was applied in the light dom
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// :host is used to style the element from within.  
// From outside the component you would use: 

// uc-tooltip {
//     border: 1px solid blue;
//     padding: 0.15rem;
// }

// But from inside, you style thusly: 

// :host {
//     border: 1px solid blue;
//     padding: 0.15rem;
// }

// ======OR======

// :host(.className) {
//     border: 1px solid blue;
//     padding: 0.15rem;
// }

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// You can also specify specific conditions with :host.  For example:
// :host-context(p) => all of these components which are inside a p tag;
// :host-context(p.className) => all of these components which are 
// inside a p tag with class="className";
// :host-context(p .className) => all of these components which are 
// inside a p tag with a nested element with class="className";
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// You can use var(--color-primary) on your component, and in case 
// that variable is destroyed or otherwise unavailable, 
// set a fallback default like so: var(--color-primary, #ccc);