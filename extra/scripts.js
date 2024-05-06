function change(evt, attr) {
  const el = document.querySelector('#demo');
  const slot = el.querySelector('[slot=icon]');
  const dest = document.querySelector('#demo-changes');

  let value = evt.target.value;

  if (evt.target.type && evt.target.type === 'checkbox') {
    value = (event.target.checked) ? 'true' : 'false';
  }

  if ( attr.startsWith( '--' ) ) {
    el.style.setProperty(attr, value);
  } else if (attr === 'caption') {
    el.innerHTML = evt.target.value;
  } else if (attr === 'icon') {
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
      el.append(tmpl);
    }

  } else {
    el.setAttribute( attr, value );
  }

  const clone = el.cloneNode();
  clone.removeAttribute('style');
  let cloneStr = clone.outerHTML;
  cloneStr = cloneStr.substr(0, cloneStr.indexOf('</wijit-reveal>'));
  const iconStr = el.children[1]? el.children[1].outerHTML : '';
  const str = `
  ${cloneStr}
    ${iconStr}
  `;
  dest.textContent = str;
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
