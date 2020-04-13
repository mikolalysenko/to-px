'use strict'

var parseUnit = require('parse-unit')

module.exports = toPX

var PIXELS_PER_INCH


function getPropertyInPX(element, prop) {
  var parts = parseUnit(getComputedStyle(element).getPropertyValue(prop))
  return parts[0] * toPX(parts[1], element)
}

//This brutal hack is needed
function getSizeBrutal(unit, element) {
  var testDIV = document.createElement('div')
  testDIV.style['height'] = '128' + unit
  element.appendChild(testDIV)
  var size = getPropertyInPX(testDIV, 'height') / 128
  element.removeChild(testDIV)
  return size
}

function getPixelsPerInch() {
  if (PIXELS_PER_INCH == null) {
    PIXELS_PER_INCH = getSizeBrutal('in', document.body) // 96
  }
  return PIXELS_PER_INCH
}

function toPX(str, element) {
  if (!str && str !== 0) return null

  element = element || document.body
  str = (str + '' || 'px').trim().toLowerCase()
  if(element === window || element === document) {
    element = document.body
  }

  switch(str) {
    case '%':  //Ambiguous, not sure if we should use width or height
      return element.clientHeight / 100.0
    case 'ch':
    case 'ex':
      return getSizeBrutal(str, element)
    case 'em':
      return getPropertyInPX(element, 'font-size')
    case 'rem':
      return getPropertyInPX(document.body, 'font-size')
    case 'vw':
      return window.innerWidth/100
    case 'vh':
      return window.innerHeight/100
    case 'vmin':
      return Math.min(window.innerWidth, window.innerHeight) / 100
    case 'vmax':
      return Math.max(window.innerWidth, window.innerHeight) / 100
    case 'in':
      return getPixelsPerInch()
    case 'cm':
      return getPixelsPerInch() / 2.54
    case 'mm':
      return getPixelsPerInch() / 25.4
    case 'pt':
      return getPixelsPerInch() / 72
    case 'pc':
      return getPixelsPerInch() / 6
    case 'px':
      return 1
  }

  // detect number of units
  var parts = parseUnit(str)
  if (!isNaN(parts[0])) {
    if (parts[1]) {
      var px = toPX(parts[1], element)
      return typeof px === 'number' ? parts[0] * px : null
    }
    else {
      return parts[0]
    }
  }

  return null
}
