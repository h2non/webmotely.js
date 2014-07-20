(function (global) {
  var server = 'ws://localhost:3000'
  var room = 'c3ce9e42-0f7e-11e4-8261-b2227cce2b54'

  function throttle(fn, ms) {
    var time = new Date().getTime()
    return function () {
      if ((new Date().getTime() - time) > ms) {
        time = new Date().getTime()
        return fn.apply(null, arguments)
      }
    }
  }

  function Webmotely() {
    this.con = Primus.connect(server)
    this._connect()
    this._init()
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
    div.style.position = 'absolute'
    div.style.zIndex = 10000
    div.style.top = '10px'
    div.innerHTML = '<img src="/static/cursor.png" width="20" />'
    document.body.appendChild(div)
    return div
  }

  function click(x, y) {
    var ev = document.createEvent('MouseEvent')
    var el = document.elementFromPoint(x, y)
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        x, y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev)
  }

  function scroll(x, y) {
    window.scrollTo(x, y)
  }

  function update(cursor, data) {
    cursor.style.top = data.y + 'px'
    cursor.style.left = data.x + 'px'

    cursor.style.display = 'none'
    switch (data.type) {
      case 'click':
        click(data.x, data.y)
        break;
      case 'scroll':
        scroll(data.pageX, data.pageY)
        break;
    }
    cursor.style.display = 'block'
  }

  global.Webmotely = Webmotely

}(window))
