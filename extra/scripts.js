function change(evt, attr) {
  const el = document.querySelector('#demo-item');
  let value = evt.target.value;

  if (evt.target.type && evt.target.type === 'checkbox') {
    value = (event.target.checked) ? 'true' : 'false';
  }

  if ( attr.startsWith( '--' ) ) {
    el.style.setProperty(attr, value);
  } else if (attr === 'caption') {
    el.innerHTML = evt.target.value;
  } else {
    el.setAttribute( attr, value );
  }
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
