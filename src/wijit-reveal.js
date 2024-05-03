export class WijitReveal extends HTMLElement {
  abortController = new AbortController();
  #active = false;
  #align = 'center';
  #height = '45px';
  #orient = 'row';
  #speed = '.5s';
  #toggle = true;
  allowed = {
    active: new Set([null, true, false, '', 'true', 'false']),
    align: new Set(['center', 'end', 'start', 'stretch']),
    orient: new Set(['column', 'column-reverse', 'row', 'row-reverse']),
    toggle: new Set([null, true, false, '', 'true', 'false']),
  }
  static observedAttributes = ['active', 'align', 'height', 'orient', 'toggle', 'speed'];

  constructor() {
    super();
    this.attachShadow( {mode:'open'} );
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --align: ${this.align};
          --height: ${this.height};
          --orient: ${this.orient};
          --speed: ${this.speed};
        }

        ::slotted(*) {
          min-height: var(--height);
        }

        label {
          cursor: pointer;
          flex: 0;
        }

        label:active {
          border: solid rgba(0,0,0,0.3);
          border-width: 2px 0 0 2px;
          box-shadow: inset 2px 2px 5px black;
        }

        label:has(input:checked) ~ #content {
          flex: 2;
          opacity: 1;
          overflow: visible;
        }

        main {
          display: flex;
          flex-direction: var(--orient);
          align-items: var(--align);
          gap: 1rem;
          height: 100%;
          padding: 0 1rem;
        }

        #content {
          align-self: stretch;
          align-items: start;
          flex: 0;
          max-height: var(--height);
          opacity: 0;
          overflow: hidden;
          transition: all var(--speed);
        }

        svg {
          width: var(--height);
        }

        #icon {
          height: var(--height);
        }
      </style>

      <main part="main">
        <label aria-label="menu" title="menu" part="icon">
          <input hidden type="checkbox">
          <div id="icon" part="icon">
            <slot name="icon">
              <svg viewBox="0 6 12 12">
                <path fill="currentColor" d="M0 6H20V8H0V6zM0 11H20V13H0V11zM0 16H20V18H0V16z"/>
              </svg>
            </slot>
          </div>
        </label>

        <div id="content" part="content">
          <slot></slot>
        </div>
      </main>
    `;

    this.shadowRoot.querySelector('input').addEventListener('change', event => {
      if (event.target.checked) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }
    }, { signal:this.abortController.signal });
  }

  attributeChangedCallback(attr, oldval, newval) {
    if (this.allowed[attr] && !this.allowed[attr].has(newval)) {
      console.error(`Value of "${attr}" must be one of [${Array.from(this.allowed[attr].values())}]. Value given was: ${newval}`)
      return false;
    }
    this[attr] = newval;
  }

  connectedCallback() {
    const links = this.querySelectorAll('a[href]');
    for (const link of links) {
      this.addClickhandler(link);
    }

    this.addWindowClickHandler();
  }

  disconnectedCallback() {
    this.abortController.abort();
  }

  addClickhandler(elem) {
    elem.addEventListener('click', event => {
      if (this.toggle) this.removeAttribute('active');
      event.stopPropagation();
    }, { signal:this.abortController.signal });
  }

  addWindowClickHandler() {
    window.addEventListener('click', event => {
      let isMenu = false;
      if (event.target === this || this.contains(event.target)) isMenu = true;

      if (!isMenu && this.toggle) this.removeAttribute('active');
      event.stopPropagation();
    });
  }

  get active() { return this.#active; }

  set active(value) {
    const input = this.shadowRoot.querySelector('input');
    switch(value) {
      case 'false':
      case null:
      case false:
        value = false;
        if (input.checked) input.checked = false;
        break;
      default:
        value = true;
        if (!input.checked) input.checked = true;
        break;
    }

    this.#active = value;
  }

  get align() { return this.#align; }

  set align(value) {
    this.#align = value;
    this.style.setProperty('--align', value);
  }

  get height() { return this.#height; }

  set height(value) {
    this.#height = value;
  }

  get orient() { return this.#orient; }

  set orient(value) {
    this.#orient = value;
    this.style.setProperty('--orient', value);
  }

  get speed() { return this.#speed; }

  set speed(value) {
    this.#speed = value;
  }

  get toggle() { return this.#toggle; }

  set toggle(value) {
    switch(value) {
    case false:
    case 'false':
      value = false;
      break;
    default:
      value = true;
      break;
    }

    this.#toggle = value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('wijit-reveal')) {
    customElements.define('wijit-reveal', WijitReveal);
  }
});
