/**
 * @class WijitReveal
 * @extends HTMLElement
 * @description A web component that reveals content based on a toggle mechanism.
 * @author Holmes Bryant <https://github.com/HolmesBryant>
 * @license GPL-3.0
 */
export class WijitReveal extends HTMLElement {
  /**
   * @private
   * @type {AbortController}
   */
  abortController = new AbortController();

  /**
   * @private
   * @type {boolean}
   */
  #active = false;

  /**
   * @private
   * @type {string}
   */
  #gap = '.5rem';

  /**
   * @private
   * @type {string}
   */
  #width = '45px';

  /**
   * @private
   * @type {string}
   */
  #orient = 'row';

  /**
   * @private
   * @type {string}
   */
  #position = 'start';

  /**
   * @private
   * @type {string}
   */
  #speed = '1s';

  /**
   * @private
   * @type {boolean}
   */
  #toggle = true;

  /**
   * @public
   * @readonly
   * @type {Set<string|null>}
   */
  static allowed = {
    active: new Set([null, true, false, '', 'true', 'false']),
    position: new Set(['center', 'end', 'start', 'stretch']),
    orient: new Set(['column', 'column-reverse', 'row', 'row-reverse']),
    toggle: new Set([null, true, false, '', 'true', 'false']),
  };

  /**
   * @public
   * @readonly
   * @type {string[]}
   */
  static observedAttributes = ['active', 'gap', 'width', 'orient', 'position', 'speed', 'toggle'];

  /**
   * @constructor
   */
  constructor() {
    super();
    this.attachShadow( {mode:'open'} );
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --gap: ${this.gap};
          --width: ${this.width};
          --orient: ${this.orient};
          --position: ${this.position};
          --speed: ${this.speed};
          position: relative;
        }

        slot[name="icon"]::slotted(*) {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        input + #icon:hover {
          box-shadow: 2px 2px 5px black;
        }

        input + #icon:active {
          box-shadow: inset 2px 2px 5px black;
        }

        label {
          cursor: pointer;
          flex: 0;
          min-height: var(--width);
          min-width: var(--width);
        }

        label:has(input) ~ #content {
          flex: 0 1 0%;
          opacity: 0;
          overflow: hidden;
          transition: all var(--speed);
          width: 100%;
          max-height: 0vh;
        }

        label:has(input:checked) ~ #content {
          flex: 2 1 100%;
          max-height: 100vh;
          opacity: 1;
        }

        main {
          align-items: var(--position);
          display: flex;
          flex-direction: var(--orient);
          gap: var(--gap);
        }

        svg {
          height: 100%;
          width: 100%;
        }

        #icon {
          height: var(--width);
          width: 100%;
        }

        #icon.row.stretch,
        #icon.row-reverse.stretch {
          height: 100%;
        }
      </style>

      <main part="main">
        <label aria-label="menu" title="menu" part="icon">
          <input hidden type="checkbox">
          <div id="icon" class="${this.orient} ${this.position}">
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

  /**
   * @param {string} attr
   * @param {string} oldval
   * @param {string} newval
   */
  attributeChangedCallback(attr, oldval, newval) {
    if (WijitReveal.allowed[attr] && !WijitReveal.allowed[attr].has(newval)) {
      const allowed = JSON.stringify(Array.from(WijitReveal.allowed[attr].values()));
      console.error(`Value of "${attr}" must be one of ${allowed}. Value given was: ${newval}`)
      return false;
    }
    this[attr] = newval;
    this.sendEvent(attr, oldval, newval);
  }

  /**
   * @override
   */
  connectedCallback() {
    this.addClickhandler();
    this.addWindowClickHandler();
  }

  /**
   * @override
   */
  disconnectedCallback() {
    this.abortController.abort();
  }

  /**
   * @private
   * @param {string} attr
   * @param {*} oldval
   * @param {*} newval
   */
  sendEvent(attr, oldval, newval) {
    const info = { attr:attr, old:oldval, new:newval };
    const evt = new CustomEvent('wijitChanged', { detail:info });
    window.dispatchEvent(evt);
  }

  /**
   * @private
   */
  addClickhandler() {
    this.addEventListener('click', event => {
      if (
        event.target.localName === 'a' &&
        !!event.target.href &&
        this.toggle
      ) this.removeAttribute('active');
    }, { signal:this.abortController.signal });
  }

  /**
   * @private
   */
  addWindowClickHandler() {
    window.addEventListener('click', event => {
      let isMenu = false;
      if (event.target === this || this.contains(event.target)) isMenu = true;

      if (!isMenu && this.toggle) {
        this.removeAttribute('active');
      }

      event.stopPropagation();
    });
  }

  /**
   * @public
   * @type {boolean}
   */
  get active() { return this.#active; }

  /**
   * @public
   * @param {boolean|string|null} value
   */
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

  /**
   * @public
   * @type {string}
   */
  get gap() { return this.#gap; }

  /**
   * @public
   * @type {string}
   */
  set gap(value) {
    this.#gap = value;
    this.style.setProperty('--gap', value);
  }

  /**
   * @public
   * @type {string}
   */
  get width() { return this.#width; }

  /**
   * @public
   * @type {string}
   */
  set width(value) {
    this.#width = value;
    this.style.setProperty('--width', value);
  }

  /**
   * @public
   * @type {string}
   */
  get orient() { return this.#orient; }

  /**
   * @public
   * @type {string}
   */
  set orient(value) {
    const icon = this.shadowRoot.querySelector('#icon');
    this.#orient = value;
    this.style.setProperty('--orient', value);

    for (const cls of WijitReveal.allowed.orient) {
      if (icon) icon.classList.remove(cls);
    }

    icon.classList.add(value);
  }

  /**
   * @public
   * @type {string}
   */
  get position() { return this.#position; }

  /**
   * @public
   * @type {string}
   */
  set position(value) {
    const icon = this.shadowRoot.querySelector('#icon');
    this.#position = value;
    this.style.setProperty('--position', value);

    for (const cls of WijitReveal.allowed.position) {
      icon.classList.remove(cls);
    }

    if (icon) icon.classList.add(value);
  }

  /**
   * @public
   * @type {string}
   */
  get speed() { return this.#speed; }

  /**
   * @public
   * @type {string|number}
   */
  set speed(value) {
    if (/\d+$/.test(value)) value += 's';
    this.#speed = value;
    this.style.setProperty('--speed', value);
  }

  /**
   * @public
   * @type {boolean}
   */
  get toggle() { return this.#toggle; }

  /**
   * @public
   * @param {boolean|string|null} value
   */
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
