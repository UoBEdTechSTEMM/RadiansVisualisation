/* TwoJS http://jonobr1.github.io/two.js/ */
/* colors  orangered #FF8000 rgb(0, 200, 255)*/

'use strict'

/* Library namespace */
var radians = {};

(function (rd) {
  // The main application closure
  rd.runApp = function (canvasElem) {
    // app size
    var viewportw = 400
    var viewporth = 300

    // geometric parameters
    var x0 = 72
    var y0 = 100
    var radius = 50
    var xoffset = 110

    var x
    var y
    var mouse = new Two.Vector()

    var styles = {
      family: 'proxima-nova, sans-serif',
      size: 40,
      leading: 40,
      weight: 900
    }

    // angle constants
    var angle = Math.PI / 2  // angle in units of pi
    var maxangle = 6 * Math.PI

    // Make an instance of two and place it on the page.
    var params = { width: viewportw, height: viewporth }
    var two = new Two(params).appendTo(canvasElem)

    // create sliderbar
    var rect = two.makeRectangle(viewportw / 2, viewporth - 20, viewportw - 20, 10)
    rect.stroke = 'rgb(0, 200, 255)'
    rect.fill = 'rgb(0, 200, 255)' // Accepts all valid css color
    rect.linewidth = 5

    // create slider marker
    var slidermarker = two.makeCircle(viewportw / 2, viewporth - 20, 10)
    slidermarker.fill = '#FF8000'
    slidermarker.stroke = 'white' // Accepts all valid css color
    slidermarker.linewidth = 3

    // array to store dynmaic two.js objects
    var elements = []

    rd.drag = function (e) {
      var mousex = e.clientX

      if (mousex <= 20) {
        angle = 0
      } else if (mousex >= viewportw - 20) {
        angle = maxangle
      } else {
        angle = maxangle * (mousex - 20) / (viewportw - 40)
      }

      mouse.set(x, y)
    }

    rd.dragEnd = function (e) {
      $(window)
        .unbind('mousemove', radians.drag)
        .unbind('mouseup', radians.dragEnd)
    }

    rd.touchDrag = function (e) {
      e.preventDefault()
      var touch = e.originalEvent.changedTouches[0]
      radians.drag({
        clientX: touch.pageX,
        clientY: touch.pageY
      })
      return false
    }

    rd.touchEnd = function (e) {
      e.preventDefault()
      $(window)
        .unbind('touchmove', radians.touchDrag)
        .unbind('touchend', radians.touchEnd)
      return false
    }

    rd.angletox = function (angle) {
      return 20 + angle * (viewportw - 40) / maxangle
    }

    rd.drawFullCircle = function (x0, y0, r) {
      var circle = two.makeCircle(-70, 0, 50)
      circle.fill = '#FF8000'
      circle.stroke = 'orangered'
      circle.linewidth = 5
      return circle
    }

    rd.drawWedge = function (ox, oy, ir, or, sa, ea, res) {
      var wedge = two.makeArcSegment(ox, oy, ir, or, sa, ea, res)
      wedge.fill = '#FF8000'
      wedge.stroke = 'orangered'
      wedge.linewidth = 5
      return wedge
    }

    // bind mouse/touch evenets
    $(window)
    .bind('mousedown', function (e) {
      mouse.set(e.clientX, e.clientY)
      $(window)
        .bind('mousemove', radians.drag)
        .bind('mouseup', radians.dragEnd)
    })
    .bind('touchstart', function (e) {
      e.preventDefault()
      var touch = e.originalEvent.changedTouches[0]
      mouse.set(touch.pageX, touch.pageY)
      $(window)
        .bind('touchmove', radians.touchDrag)
        .bind('touchend', radians.touchEnd)
      return false
    })

    // This code is called everytime two.update() is called.
    // Effectively 60 times per second.
    two.bind('update', function (frameCount) {
        // remove previous objects from two

      two.remove(elements)
      //elements.clear()

      // add text for angle
      var text = two.makeText('angle: ' + (angle / Math.PI).toFixed(2) + '\u03C0', viewportw / 2, 20, styles)
      text.fill = '#00aaFF'
      elements.push(text)

      // calculates the number of full circles to draw
      var nfullcircles = Math.floor(angle / (2 * Math.PI))

      // draws full circles
      for (var i = 0; i < nfullcircles; i = i + 1) {
        elements.push(radians.drawWedge(x0 + i * xoffset, y0, 0, radius, 0, 2 * Math.PI))
      }

      // draws left of radians as a segment
      elements.push(radians.drawWedge(x0 + nfullcircles * xoffset, y0, 0, radius, 0, angle % (2 * Math.PI)))

      // translates the slidermaker to the appropriate x position for the angle
      slidermarker.translation.set(radians.angletox(angle), viewporth - 20)
    }).play()  // Finally, start the animation loop
  }
})(radians)
