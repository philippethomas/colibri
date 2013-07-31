// Generated by CoffeeScript 1.3.3
(function() {
  var Del, Method,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Method = require('../Method');

  module.exports = Del = (function(_super) {

    __extends(Del, _super);

    function Del() {
      return Del.__super__.constructor.apply(this, arguments);
    }

    Del.prototype.defaultVerb = function() {
      return 'del';
    };

    Del.prototype.defaultSteps = function() {
      return ['begin', 'input', 'load', 'remove', 'output'];
    };

    Del.prototype.input = function(req, res, next) {
      var rest;
      rest = req.rest;
      rest._id = req.param('_id');
      return next(null);
    };

    Del.prototype.load = function(req, res, next) {
      var rest, _id;
      rest = req.rest;
      _id = rest._id;
      return rest.model.findById(_id, function(err, doc) {
        if (err) {
          return next(err);
        } else {
          rest.document = doc;
          return next(null);
        }
      });
    };

    Del.prototype.remove = function(req, res, next) {
      var rest;
      rest = req.rest;
      return rest.document.remove(function(err) {
        if (err) {
          return next(err);
        } else {
          return next(null);
        }
      });
    };

    Del.prototype.output = function(req, res, next) {
      return res.json(null, 204);
    };

    return Del;

  })(Method);

}).call(this);
