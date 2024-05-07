function switchIcon(elem, slot, value) {
  let tmpl;

    switch (value) {
    case 'button':
      tmpl = document.querySelector('#button-template').content.cloneNode(true);
      break;
    case 'image':
      tmpl = document.querySelector('#image-template').content.cloneNode(true);
      break;
    default:
      if (slot) slot.remove();
    }

    if (slot && tmpl) {
      slot.replaceWith(tmpl);
    } else if (tmpl) {
      elem.append(tmpl);
    }
}

function updateCodeExample(elem, target) {
  const clone = elem.cloneNode();
  clone.removeAttribute('style');
  let cloneStr = clone.outerHTML;
  cloneStr = cloneStr.substr(0, cloneStr.indexOf('</wijit-reveal>'));
  const iconStr = elem.children[1]? elem.children[1].outerHTML : '';
  const str = `
  ${cloneStr}
    ${iconStr}
  `;
  target.textContent = str;
}

function change(evt, attr) {
  const elem = document.querySelector('#demo');
  const slot = elem.querySelector('[slot=icon]');
  const target = document.querySelector('#demo-changes');

  let value = evt.target.value;

  if (evt.target.type && evt.target.type === 'checkbox') {
    value = (event.target.checked) ? 'true' : 'false';
  }

  if ( attr.startsWith( '--' ) ) {
    elem.style.setProperty(attr, value);

  } else if (attr === 'icon') {
    switchIcon(elem, slot, value);

  } else {
    elem.setAttribute( attr, value );
  }

  updateCodeExample(elem, target);
}

/**
 * Grab the README file and stick it in the "instructions" container
 */
function getReadme () {
  const elem = document.querySelector('details#instructions > div');
  fetch ('./README.md')
  .then (response => response.text())
  .then (text => {
    elem.textContent = text;
  });
}

getReadme();
