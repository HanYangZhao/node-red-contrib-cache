'use strict';

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    'default': e
  };
}

function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
}

Object.defineProperty(exports, '__esModule', {
  'value': !0
});

var _nodeCache = require('node-cache'),
    _nodeCache2 = _interopRequireDefault(_nodeCache);

exports.default = function (e) {
  var t = function t(c) {
    function s(e) {
      this.nodeList.push(e);
    }

    function a() {
      this.nodeList.forEach(function (e) {
        e.emit('updated');
      });
    }

    var o = this;
    _classCallCheck(this, t), e.nodes.createNode(this, c), this.name = c.name, this.cache = new _nodeCache2.default({
      'stdTTL': c.defaultTtl || 0,
      'checkperiod': c.checkPeriod || 0
    }), this.cache.nodeList = [], this.cache.addNode = s.bind(this.cache), this.cache.onChanged = a.bind(this.cache), ['set', 'del', 'expired', 'flush'].forEach(function (e) {
      o.cache.on(e, o.cache.onChanged);
    }), this.on('close', function () {
      o.cache.close(), delete o.cache;
    });
  };

  e.nodes.registerType('Cache', t);

  var c = function t(c) {
    var s = this;
    _classCallCheck(this, t), e.nodes.createNode(this, c), this.keyProperty = c.keyProperty || 'topic', this.valueProperty = c.valueProperty || 'payload', this.useString = c.useString, this.cacheNodeId = c.cache, this.cacheNode = e.nodes.getNode(this.cacheNodeId), this.cacheNode && (this.cacheNode.cache.addNode(this), this.on('updated', function () {
      s.status({
        'fill': 'green',
        'shape': 'dot',
        'text': e._('cache.status.keys', {
          'n': s.cacheNode.cache.getStats().keys
        })
      });
    })), this.name = c.name, this.on('input', function (t) {
      if (s.cacheNode) if (t.hasOwnProperty('flush')) s.cacheNode.cache.flushAll();else if (t.hasOwnProperty('keys')) s.cacheNode.cache.keys(function (c, a) {
        c || (e.util.setMessageProperty(t, s.valueProperty, '' === a ? null : a), s.send(t));
      });else {
        var c = e.util.getMessageProperty(t, s.keyProperty);
        c && s.cacheNode.cache.get(c, function (c, a) {
          c || (e.util.setMessageProperty(t, s.valueProperty, '' === a ? null : a), s.send(t));
        });
      }
    }), process.nextTick(function () {
      s.emit('updated');
    });
  };

  e.nodes.registerType('Cache in', c);

  var s = function t(c) {
    var s = this;
    _classCallCheck(this, t), e.nodes.createNode(this, c), this.keyProperty = c.keyProperty || 'topic', this.valueProperty = c.valueProperty || 'payload', this.ttlProperty = c.ttlProperty || '', this.useString = c.useString, this.cacheNodeId = c.cache, this.cacheNode = e.nodes.getNode(this.cacheNodeId), this.cacheNode && (this.cacheNode.cache.addNode(this), this.on('updated', function () {
      s.status({
        'fill': 'green',
        'shape': 'dot',
        'text': e._('cache.status.keys', {
          'n': s.cacheNode.cache.getStats().keys
        })
      });
    })), this.name = c.name, this.on('input', function (t) {
      if (s.cacheNode) if (t.hasOwnProperty('flush')) s.cacheNode.cache.flushAll();else {
        var c = e.util.getMessageProperty(t, s.keyProperty);

        if (c) {
          var a = e.util.getMessageProperty(t, s.valueProperty);

          if (s.ttlProperty) {
            var o = e.util.getMessageProperty(t, s.ttlProperty) || 0;
            s.cacheNode.cache.set(c, a, o);
          } else s.cacheNode.cache.set(c, a);
        }
      }
    }), process.nextTick(function () {
      s.emit('updated');
    });
  };

  e.nodes.registerType('Cache out', s);
}, module.exports = exports.default;
//# sourceMappingURL=cache.js.map
