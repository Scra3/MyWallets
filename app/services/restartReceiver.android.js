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
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return c > 3 && r && Object.defineProperty(target, key, r), r
  }
exports.__esModule = true
var continuous_service_android_1 = require('./continuousService.android')
exports.RESTART_RECEIVER_CLASSNAME =
  'org.nativescript.mywallets.Restart_Receiver'
var Restart_Receiver = /** @class */ (function(_super) {
  __extends(Restart_Receiver, _super)
  function Restart_Receiver() {
    return (_super !== null && _super.apply(this, arguments)) || this
  }
  Restart_Receiver.prototype.onReceive = function(context, intent) {
    console.log('RESTART INTENT RECEIVED')
    var serviceIntent = new android.content.Intent()
    serviceIntent.setClassName(
      context,
      continuous_service_android_1.CONTINUOUS_SERVICE_CLASSNAME
    )
    context.startService(serviceIntent)
  }
  Restart_Receiver = __decorate(
    [JavaProxy('org.nativescript.mywallets.Restart_Receiver')],
    Restart_Receiver
  )
  return Restart_Receiver
})(android.content.BroadcastReceiver)
