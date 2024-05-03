function change(evt, attr) {
  const el = document.querySelector('#demo-item');

  if ( attr.startsWith( '--' ) ) {
    el.style.setProperty(attr, evt.target.value);
  } else if (attr === 'caption') {
    el.innerHTML = evt.target.value;
  } else {
    el.setAttribute( attr, evt.target.value );
  }
}

/**
 * Grab the README file and stick it in the "instructions" container
 */
function getReadme () {
  const elem = document.querySelector('#instructions');
  fetch ('./README.md')
  .then (response => response.text())
  .then (text => {
    elem.textContent = text;
  });
}

getReadme();
