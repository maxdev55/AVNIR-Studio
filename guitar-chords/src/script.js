x = 'x';

var chords = {
  A: {
    minor: [x, 0, 2, 2, 1, 0],
    major: [x, 0, 2, 2, 2, 0],
  },
  B: {
    major: [x, 2, 4, 4, 3, 2],
    minor: [x, 2, 4, 4, 4, 2],
  },
  C: {
    major: [3, 3, 2, 0, 1, 0],
    minor: [x, 1, 3, 3, 2, 1],
  },
  D: {
    major: [x, x, 0, 2, 3, 2],
    minor: [x, x, 0, 2, 3, 1],
  },
  E: {
    major: [0, 2, 2, 1, 0, 0],
    minor: [0, 2, 2, 0, 0, 0],
  },
  F: {
    major: [1, 3, 3, 2, 1, 1],
    minor: [1, 3, 3, 1, 1, 1],
  },
  G: {
    major: [3, 2, 0, 0, 0, 3],
    minor: [1, 3, 3, 1, 1, 1],
  },
}

function drawChord(chord) {
  fingers = document.querySelectorAll('.finger');
  chord.forEach(function(item, index) {
    fingers[index].classList = 'finger';
    fingers[index].classList.add('finger-position-' + item);
  })
}

function findChord() {
  base = picker.elements.namedItem('base').value
  key = picker.elements.namedItem('key').value
  chord = chords[base][key];
  chord ? drawChord(chord) : drawChord([0, 0, 0, 0, 0, 0]);
}

function setup() {
  baseSelect = document.querySelectorAll('.base-select')
  baseSelect.forEach(function(item, index) {
    item.addEventListener('click', function(e, el) {
      findChord();
    })
  })
}

setup();
setTimeout(findChord, 1000);