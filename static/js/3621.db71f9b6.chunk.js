"use strict";(self.webpackChunkexamples=self.webpackChunkexamples||[]).push([[3621],{3621:function(e,t,n){n.r(t),t.default={5:function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}var t=r(n(1473)),o=(r(n(7510)),n(8861));function r(e){return e&&e.__esModule?e:{default:e}}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(n=e,!(null!=(o=t)&&"undefined"!==typeof Symbol&&o[Symbol.hasInstance]?o[Symbol.hasInstance](n):n instanceof o))throw new TypeError("Cannot call a class as a function");var n,o}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},c(e,t)}function f(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=s(e);if(t){var r=s(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return a(this,n)}}function a(t,n){if(n&&("object"===e(n)||"function"===typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}function s(e){return s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},s(e)}var b=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&c(e,t)}(b,e);var n,r,a,s=f(b);function b(){var e;return i(this,b),(e=s.call(this)).state={visible1:!1,visible2:!1},e}return n=b,(r=[{key:"onClick",value:function(e){this.setState(l({},e,!this.state[e]))}},{key:"onClosed",value:function(e){this.setState(l({},e,!1))}},{key:"render",value:function(){return t.default.createElement("div",null,t.default.createElement(o.Alert,{isOpen:this.state.visible1,confirmText:"\u786e\u5b9a\u6309\u94ae",onClosed:this.onClosed.bind(this,"visible1"),content:"\u8fd9\u4e2a\u5bf9\u8bdd\u6846\u53ea\u6709\u4e24\u4e2a\u4e2a\u6309\u94ae\uff0c\u5355\u51fb\u201c\u786e\u5b9a\u6309\u94ae\u201d\u540e\uff0c\u6b64\u5bf9\u8bdd\u6846\u5c06\u5173\u95ed\u3002\u7528\u4f5c\u901a\u77e5\u7528\u6237\u91cd\u8981\u4fe1\u606f\u3002"}),t.default.createElement(o.Alert,{isOpen:this.state.visible2,confirmText:"\u786e\u5b9a\u6309\u94ae",cancelText:"\u53d6\u6d88\u6309\u94ae",type:"danger",onConfirm:function(){return console.log("\u60a8\u70b9\u51fb\u4e86\u786e\u5b9a\u6309\u94ae\uff01")},onCancel:function(){return console.log("\u60a8\u70b9\u51fb\u4e86\u53d6\u6d88\u6309\u94ae\uff01")},onClosed:this.onClosed.bind(this,"visible2")},"\u8fd9\u4e2a\u5bf9\u8bdd\u6846\u6709\u4e24\u4e2a\u6309\u94ae\uff0c\u5355\u51fb \u201c",t.default.createElement("b",null,"\u786e\u5b9a\u6309\u94ae"),"\u201d \u6216 \u201c",t.default.createElement("b",null,"\u53d6\u6d88\u6309\u94ae"),"\u201d \u540e\uff0c\u6b64\u5bf9\u8bdd\u6846\u5c06\u5173\u95ed\uff0c\u89e6\u53d1 \u201c",t.default.createElement("b",null,"onConfirm"),"\u201d \u6216 \u201c",t.default.createElement("b",null,"onCancel"),"\u201d \u4e8b\u4ef6\u3002\u7528\u4f5c\u901a\u77e5\u7528\u6237\u91cd\u8981\u4fe1\u606f\u3002"),t.default.createElement(o.ButtonGroup,null,t.default.createElement(o.Button,{onClick:this.onClick.bind(this,"visible1")},"\u5355\u4e2a\u6309\u94ae\u786e\u8ba4\u5bf9\u8bdd\u6846"),t.default.createElement(o.Button,{onClick:this.onClick.bind(this,"visible2")},"\u786e\u8ba4\u5bf9\u8bdd\u6846")))}}])&&u(n.prototype,r),a&&u(n,a),Object.defineProperty(n,"prototype",{writable:!1}),b}(t.default.Component);return t.default.createElement(b)}}}}]);
//# sourceMappingURL=3621.db71f9b6.chunk.js.map