!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=3)}([function(e,t){e.exports=rsdll},function(e,t,n){e.exports=n(0)(0)},function(e,t,n){e.exports=n(0)(1)},function(e,t,n){n(4),n(5),e.exports=n(19)},function(e,t,n){e.exports=n(0)(929)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),o=n(7),a=n(17);window.__REKIT_PLUGINS.push({ui:r,route:o.a,reducer:a.a})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={menu:{}}},function(e,t,n){"use strict";var r=n(8);t.a={path:"/",name:"Home",childRoutes:[{path:"default-page",name:"Default page",component:r.a,isIndex:!0}]}},function(e,t,n){"use strict";var r=(n(9),n(10));n.d(t,"a",function(){return r.a})},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var c=n(1),u=n.n(c),i=n(2),l=n.n(i),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),s(t,[{key:"render",value:function(){return u.a.createElement("div",{className:"home-app"},u.a.createElement("div",{className:"page-container"},this.props.children))}}]),t}(c.Component);f.propTypes={children:l.a.node},f.defaultProps={children:""}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function c(e){return{home:e.home}}function u(e){return{actions:Object(p.bindActionCreators)(Object.assign({},b),e)}}var i=n(1),l=n.n(i),s=n(2),f=n.n(s),p=n(11),h=n(12),m=n(13),d=n(14),b=n(15),y=(n.n(b),n(16)),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),v(t,[{key:"render",value:function(){return Object(y.fetchProjectData)(),l.a.createElement("div",{className:"home-default-page"},l.a.createElement("header",{className:"app-header"},l.a.createElement(d.Button,null),l.a.createElement("h1",{className:"app-title"},"Welcome to React")),l.a.createElement("div",{className:"app-intro"},l.a.createElement("h3",null,"To get started:"),l.a.createElement("ul",null,l.a.createElement("li",null,"Edit component"," ",l.a.createElement("a",{href:"http://localhost:6076/element/src%2Ffeatures%2Fhome%2FDefaultPage.js/code",target:"_blank",rel:"noopener noreferrer"},"src/features/home/DefaultPage.js")," ","for this page."),l.a.createElement("li",null,"Edit component"," ",l.a.createElement("a",{href:"http://localhost:6076/element/src%2Ffeatures%2Fhome%2FApp.js/code",target:"_blank",rel:"noopener noreferrer"},"src/features/home/App.js")," ","for the root container layout."),l.a.createElement("li",null,"To see examples, access:\xa0",l.a.createElement(m.Link,{to:"/examples"},"/examples")),l.a.createElement("li",null,"Rekit Studio is running at:\xa0",l.a.createElement("a",{href:"http://localhost:6076/",target:"_blank",rel:"noopener noreferrer"},"http://localhost:6076/"),"."))))}}]),t}(i.Component);_.propTypes={home:f.a.object.isRequired,actions:f.a.object.isRequired},t.a=Object(h.connect)(c,u)(_)},function(e,t,n){e.exports=n(0)(18)},function(e,t,n){e.exports=n(0)(11)},function(e,t,n){e.exports=n(0)(106)},function(e,t,n){e.exports=n(0)(13)},function(e,t){},function(e,t,n){e.exports=n(0)(768)},function(e,t,n){"use strict";function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o.a,t=arguments[1],n=void 0;return t.type,n=e,a.reduce(function(e,n){return n(e,t)},n)}t.a=r;var o=n(18),a=[]},function(e,t,n){"use strict";var r={};t.a=r},function(e,t,n){e.exports=n(0)(2472)}]);
//# sourceMappingURL=main.144fbb61.js.map