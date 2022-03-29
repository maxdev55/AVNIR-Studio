var supportsES6 = function() {
  // https://gist.github.com/bendc/d7f3dbc83d0f65ca0433caf90378cd95
  try {
    new Function("(a = 0) => a");
    return true;
  }
  catch (err) {
    return false;
  }
}();


var supportsPointerEvents = function() {
  if (window.PointerEvent) {
    document.documentElement.className += " hasPointerEvents"
  } else {
    document.documentElement.className += " noPointerEvents"
  }
  return (window.PointerEvent);
}




// Click any chord to rotate the chord wheel.
// Or drag the wheel left, or right, by 32px or more.
// Drag uses pointer events, so unavailable in Safari.
// Version 5 01/10/2019

(function (window, document) {

  // 12 semitones across 360deg.
  // 1 semitone rotation is a 30deg step 

  "use strict";
  if (!supportsES6) return false;

  const config = {
    clickSelect : '.clickLayer',
    dragLayerSelect : '[data-drag]',
    rotationSelect : '.rotationLayer',
    rotationVar : '--rotation',
    rotationAttr : 'data-rotate',
    durationVar : '--transitionDuration',
    durationAttr : 'data-duration',
    durationDefault : '0.3',
    minDrag : 32
  };
  
  // Get the required control and data elements.
  // Exit if unavailable.

  const clickLayer = document.querySelector(config.clickSelect);
  if (!clickLayer) return false;

  const paths = clickLayer.querySelectorAll(`[${config.rotationAttr}]`);
  if (!paths) return false;

  const dragLayer = document.querySelector(config.dragLayerSelect);
  if (!dragLayer) return false;

  const rotationLayer = document.querySelector(config.rotationSelect);
  if (!rotationLayer) return false;

  const positionX = {
    start : 0,
    end : 0
  };

  const _setCssVars = (duration, rotation) => {
    
    // V3a - Also rotates a mirrored version
    const rotationLayers = document.querySelectorAll(config.rotationSelect);
    if (!rotationLayers) return false;
    for (const rotationLayer of rotationLayers) {
      window.requestAnimationFrame(_ => {
        rotationLayer.style.setProperty(config.durationVar, duration + 's');
        rotationLayer.style.setProperty(config.rotationVar, rotation + 'deg');
      });
    }
  };

  const _getCurrentRotation = _ => {
    const currentRotation = getComputedStyle(rotationLayer)
        .getPropertyValue(config.rotationVar)
        .replace('deg', '');
    return parseInt(currentRotation || 0);
  };

  const _getClickedRotateTo = (element, current) => {
    const rotate = element.getAttribute(config.rotationAttr);
    return current - (rotate || 0) * -1;
  };

  const _getDuration = element => {
    const duration = element.getAttribute(config.durationAttr);
    return duration || config.durationDefault;
  };
  
  const _resetRotation = _ => {
    // Keeps rotation value within +/-360 degrees
    const current = _getCurrentRotation();
    if (current >= -360 && current <= 360) return;

    const rotation = Math.floor(current % 360);
    _setCssVars(0, rotation);
  }

  const _chordClicked = event => {
    const current = _getCurrentRotation();
    const rotation = _getClickedRotateTo(event.target, current);
    const duration = _getDuration(event.target);
    _setCssVars(duration, rotation);
  };


  // Dragging the wheel left or right using pointer events (sorry Safari)

  const _hasDraggedEnough = _ => {
    // Has the cursor travelled far enough?
    const isEndMore = positionX.end > (positionX.start + config.minDrag);
    const isEndLess = positionX.end < (positionX.start - config.minDrag);
    return isEndMore || isEndLess;
  };

  const _getDraggedRotateTo = current => {
    // 30 (deg) is a twelth of 360 degrees = 1 chord (semitone)
    const rotateBy = positionX.end > positionX.start ? 30 : -30;
    return current + rotateBy;
  };

  const _dragMove = event => {
    positionX.end = event.clientX;
    if (!_hasDraggedEnough()) return;

    const current = _getCurrentRotation();
    const rotation = _getDraggedRotateTo(current);
    _setCssVars(config.durationDefault, rotation);
    positionX.start = event.clientX;
  };

  const _dragEnd = event => {
    dragLayer.removeEventListener('pointerup', _dragEnd);
    dragLayer.removeEventListener('pointermove', _dragMove);
  };

  const _dragStart = event => {
    event.preventDefault();
    positionX.start = event.clientX;
    dragLayer.addEventListener('pointerup', _dragEnd);
    dragLayer.addEventListener('pointermove', _dragMove);
  };
  
  const initEvents = (_ => {

    // Clicking on a chord moves it to the top of the wheel.
    clickLayer.addEventListener('click', _chordClicked);

    // Dragging the wheel incrementally rotates the wheel
    // Currently unsupported in Safari, though I'm certain they'll get around to it.
    if (window.PointerEvent) {
      dragLayer.addEventListener('pointerdown', _dragStart);
    }

    // Resets the rotation angle to be within +/- 360deg - Tidy like.
    rotationLayer.addEventListener('transitionend', _resetRotation);
    
  })();

}(window, document));





