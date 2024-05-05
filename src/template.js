export const template = `
<style>
        :host {
          --position: ${this.position};
          --height: ${this.height};
          --orient: ${this.orient};
          --speed: ${this.speed};
          border: 1px solid purple;
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

        label:active {

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
          transform-origin: center;
        }

        #content {

          flex: 0;

          width: 100%;
          opacity: 1;
          overflow: hidden;
          position: relative;
          transition: all var(--speed);
        }

        #icon {
          height: 100%;
          min-height: var(--height);
          min-width: inherit;
          overflow: hidden;
          position: relative;
        }
      </style>

      <main part="main">
        <label aria-label="menu" title="menu" part="icon">
          <input hidden type="checkbox">
          <div id="icon" part="icon">
            <slot name="icon">
              <svg viewBox="0 4 15 15" preserveAspectRatio="none">
                <path fill="currentColor" d="M0 6H20V8H0V6zM0 11H20V13H0V11zM0 16H20V18H0V16z"/>
              </svg>
            </slot>
          </div>
        </label>

        <div id="content" part="content">
          <slot></slot>
        </div>
      </main>
`
