export class WijitReveal extends HTMLElement {
  abortController = new AbortController();
  #active = false;
  #position = 'start';
  #height = '45px';
  #orient = 'row';
  #speed = '1s';
  #toggle = true;
  allowed = {
    active: new Set([null, true, false, '', 'true', 'false']),
    position: new Set(['center', 'end', 'start', 'stretch']),
    orient: new Set(['column', 'column-reverse', 'row', 'row-reverse']),
    toggle: new Set([null, true, false, '', 'true', 'false']),
  }
  static observedAttributes = ['active', 'position', 'height', 'orient', 'toggle', 'speed'];

  constructor() {
    super();
    this.attachShadow( {mode:'open'} );
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --position: ${this.position};
          --height: ${this.height};
          --orient: ${this.orient};
          --speed: ${this.speed};
          position: relative;
          width: 100%;
        }

        input + #icon:hover {
          box-shadow: 2px 2px 5px black;
        }

        input + #icon:active,
        input:checked + #icon {
          box-shadow: inset 2px 2px 5px black;
        }

        label {
          cursor: pointer;
          flex: 0;
          min-height: var(--height);
          min-width: var(--height);
        }

        label:has(input:checked) ~ #content {
          flex: 2;
          opacity: 1;
        }

        main {
          display: flex;
          flex-direction: var(--orient);
          align-items: var(--position);
          gap: 1rem;
          height: 100%;
        }

        svg {
          height: 100%;
          width: 100%;
        }

        #content {
          flex: 0;
          opacity: 1;
          overflow: hidden;
          position: relative;
          transition: all var(--speed);
          width: 100%;
        }

        #icon {
          height: var(--height);
          width: 100%;
        }

        #icon.row.stretch,
        #icon.row-reverse.stretch {
          border: 1px solid yellow;

          height: 100%;
        }
      </style>

      <main part="main">
        <label aria-label="menu" title="menu" part="icon">
          <input hidden type="checkbox">
          <div id="icon" part="icon">
            <slot name="icon">
              <svg viewBox="0 6 12 12" preserveAspectRatio="none">
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
      const allowed = JSON.stringify(Array.from(this.allowed[attr].values()));
      console.error(`Value of "${attr}" must be one of ${allowed}. Value given was: ${newval}`)
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

  get position() { return this.#position; }

  set position(value) {
    const icon = this.shadowRoot.querySelector('#icon');
    this.#position = value;
    this.style.setProperty('--position', value);

    for (const cls of this.allowed.position) {
      icon.classList.remove(cls);
    }

    icon.classList.add(value);
  }

  get height() { return this.#height; }

  set height(value) {
    this.#height = value;
    this.style.setProperty('--height', value);
  }

  get orient() { return this.#orient; }

  set orient(value) {
    const icon = this.shadowRoot.querySelector('#icon');
    this.#orient = value;
    this.style.setProperty('--orient', value);

    for (const cls of this.allowed.orient) {
      icon.classList.remove(cls);
    }

    icon.classList.add(value);
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