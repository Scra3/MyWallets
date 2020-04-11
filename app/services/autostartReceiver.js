/* eslint-disable */
'use strict'
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function(d, b) {
      extendStatics(d, b)
      function __() {
        this.constructor = d
      }
      d.prototype =
        b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()
exports.__esModule = true
var continuous_service_android_1 = require('./continuousService')
exports.AUTOSTART_RECEIVER_CLASSNAME =
  'org.nativescript.mywallets.Autostart_Receiver'
var Autostart_Receiver = /** @class */ (function(_super) {
  __extends(Autostart_Receiver, _super)
  function Autostart_Receiver() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  Autostart_Receiver.prototype.onReceive = function(context, intent) {
    var pm = context.getPackageManager()
    var launchIntent = pm.getLaunchIntentForPackage(
      continuous_service_android_1.CONTINUOUS_SERVICE_CLASSNAME
    )
    launchIntent.setPackage(null)
    context.startService(launchIntent)
  }
  return Autostart_Receiver
})(android.content.BroadcastReceiver)
