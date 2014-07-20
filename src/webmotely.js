(function (global) {
  var room = 'c3ce9e42-0f7e-11e4-8261-b2227cce2b54'
  var element = null

  function toArray(arr) {
    return Array.prototype.slice.call(arr)
  }

  function extend(target) {
    var origins = toArray(arguments).slice(1)
    origins.forEach(function (origin) {
      for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
          target[key] = origin[key]
        }
      }
    })
    return target
  }

  function throttle(fn, ms) {
    var time = new Date().getTime()
    return function () {
      if ((new Date().getTime() - time) > ms) {
        time = new Date().getTime()
        return fn.apply(null, arguments)
      }
    }
  }

  function Webmotely(options) {
    this.options = extend({}, this.options, options)
    this.con = Primus.connect(this.options.server)
    this._connect()
    this._init()
  }

  Webmotely.prototype.options = {
    server: 'ws://localhost:3000'
  }

  Webmotely.prototype._connect = function () {
    var primus = this.con
    var cursor = false
    primus.once('open', function () {
      primus.write({ action: 'join', room: room, type: 'client' })
      primus.on('joinroom', function (room, spark) {
        console.log(spark.id + ' joined to room ' + room)
      })
      primus.on('data', function (data) {
        if (!cursor) {
          cursor = create()
          info = createInfo()
        }
        update(cursor, data)
      })
    })
  }

  Webmotely.prototype.send = function (data) {
    this.con.write({ room: room, data: data })
  }

  Webmotely.prototype.leave = function () {
    this.con.write({ action: 'leave', room: room })
  }

  Webmotely.prototype._init = function () {
    var self = this.con
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        window.onresize = function () {
          var w = window,
              d = document,
              e = d.documentElement,
              g = d.getElementsByTagName('body')[0]
          var data = {
            type: 'resize',
            width: w.innerWidth || e.clientWidth || g.clientWidth,
            height: w.innerHeight || e.clientHeight|| g.clientHeight
          }
          self.write({ room: room, data: data })
        }
      }
    }
  }

  function create() {
    var div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.zIndex = 10000
    div.style.top = '-50px'
    div.innerHTML = '<img src="http://rawgit.com/webmotely/webmotely.js/master/static/cursor.png" width="18" />'
    document.body.appendChild(div)
    return div
  }

  function createInfo() {
    var div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.zIndex = 10000
    div.style.bottom = '5px'
    div.style.left = '5px'
    div.style.padding = '7px'
    div.style.background = '#CCC'
    div.style.opacity = '0.8'
    div.style.borderRadius = '12px'
    div.style.webkitBorderRadius = '12px'
    div.style.mozBorderRadius = '12px'
    div.innerHTML = '<span><b>Webmotely is enabled</b> - <a href="#">Disable</a></span>'
    document.body.appendChild(div)
    return div
  }

  function triggerMouseEvent(el, type, data) {
    var ev = document.createEvent('MouseEvent')
    ev.initMouseEvent(
        type, true /* bubble */,
        true /* cancelable */,
        window, null,
        data.x, data.y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /* left */, null
    )
    if (el.tagName === 'INPUT') {
      el.focus()
    }
    el.dispatchEvent(ev)
  }

  function triggerClick(data) {
    var el = document.elementFromPoint(data.x, data.y)
    triggerMouseEvent(el, 'click', data)
  }

  function triggerScroll(x, y) {
    window.scrollTo(x, y)
  }

  function dispatchEvent(el, type) {
    if (el.fireEvent) {
      el.fireEvent('on' + type)
    } else {
      var evObj = document.createEvent('Events')
      evObj.initEvent(type, true, false)
      el.dispatchEvent(evObj)
    }
  }

  function triggers(data) {
    var el = document.elementFromPoint(data.x, data.y)
    if (el) {
      if (el !== element) {
        if (element !== null) {
          triggerMouseEvent(element, 'mouseleave', data)
        }
        triggerMouseEvent(el, 'mouseenter', data)
        element = el
      }
      triggerMouseEvent(el, 'mouseover', data)
    }
  }

  function triggerKey(data) {
    var el = document.elementFromPoint(data.elX, data.elY)
    if (data.value && el) {
      if (el.tagName !== 'INPUT') {
        if (el = el.querySelector('input')) {
          el.value = data.value
        }
      } else {
        el.value = data.value
      }
    }
  }

  function triggerEvent(data) {
    var el = document.elementFromPoint(data.x, data.y)
    if (el) {
      if (data.type === 'focus') {
        var ev = new FocusEvent(data.type)
      } else {
        var ev = new Event(data.type)
      }
      el.dispatchEvent(ev)
    }
  }

  function update(cursor, data) {
    cursor.style.display = 'none'

    switch (data.type) {
      case 'mousemove':
        cursor.style.top = data.y + 'px'
        cursor.style.left = data.x + 'px'
        break;
      case 'click':
        triggerClick(data)
        break;
      case 'scroll':
        triggerScroll(data.pageX, data.pageY)
        break;
      case 'keyup':
        triggerKey(data)
        break
      default:
        triggerEvent(data)
        break;
    }

    triggers(data)
    cursor.style.display = 'block'
  }

  var webmotely = global.webmotely = function (options) {
    return new Webmotely(options)
  }

  webmotely.start = function (options) {
    return webmotely(options)
  }

}(window))
