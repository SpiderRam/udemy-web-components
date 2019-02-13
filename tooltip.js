class Tooltip extends HTMLElement {
    constructor() {
        super();
        this._tooltipContainer;
        this._tooltipText = "Default tooltip text.";
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: black;
                    color: white;
                    position: absolute;
                    z-index: 10;
                }

                .highlight {
                    background-color: red;
                }

                ::slotted(.highlight) {
                    border-bottom: 1px dotted red;
                }
            </style>
            <slot></slot>
            <span> (?)</span>
        `;
    }
    
    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        const tooltipIcon = this.shadowRoot.querySelector('span');
        tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this.shadowRoot.appendChild(tooltipIcon);
        this.style.position = 'relative';
    }

    _showTooltip() {
        this._tooltipContainer = document.createElement('div');
        this._tooltipContainer.textContent = this._tooltipText;
        this.shadowRoot.appendChild(this._tooltipContainer);
    }

    _hideTooltip() {
        this.shadowRoot.removeChild(this._tooltipContainer)
    }
}

customElements.define('uc-tooltip', Tooltip);

// Slotted text will not take styles defined on the component, 
// unless you use the ::slotted() selector.
// To style ANY slotted content, use ::slotted(*).
// Note, you can't style nested components this way, i.e. .highlight div.
// Styles applied to the same element in the shadow dom will be overridden 
// by anything that was applied in the light dom