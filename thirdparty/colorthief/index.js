import quantize from 'quantize'

/*
 * Color Thief v2.3.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

function createPixelArray (imgData, pixelCount, quality) {
  const pixels = imgData
  const pixelArray = []

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
    offset = i * 4
    r = pixels[offset + 0]
    g = pixels[offset + 1]
    b = pixels[offset + 2]
    a = pixels[offset + 3]

    // If pixel is mostly opaque and not white
    if (typeof a === 'undefined' || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b])
      }
    }
  }
  return pixelArray
}

const CanvasImage = function (image) {
  this.canvas = document.createElement('canvas')
  this.context = this.canvas.getContext('2d')
  this.width = this.canvas.width = image.width
  this.height = this.canvas.height = image.height
  this.context.drawImage(image, 0, 0, this.width, this.height)
}

CanvasImage.prototype.getImageData = function (sy) {
  return this.context.getImageData(0, sy, this.width, this.height - sy)
}

const ColorThief = function () {}

ColorThief.prototype.getColor = function (sourceImage, start = 0, quality = 10) {
  const image = new CanvasImage(sourceImage)
  const sy = Math.floor(image.height * start)
  const imageData = image.getImageData(sy)
  const pixelCount = image.width * (image.height - sy)

  const pixelArray = createPixelArray(imageData.data, pixelCount, quality)

  const cmap = quantize(pixelArray, 4)
  const palette = cmap ? cmap.palette() : null

  return palette[0]
}

export default ColorThief
