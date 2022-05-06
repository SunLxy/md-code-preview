"use strict";(self.webpackChunkexamples=self.webpackChunkexamples||[]).push([[833],{833:function(e,s,n){n.d(s,{Z:function(){return q}});var t=n(189),c=n(773),i=n(808),o=n(133),r=n(809),a=n(135),d=n.n(a),l=n(791),p=n(265),u=["previewBodyClassName","component"],v=function(e){var s=e.previewBodyClassName,n=e.component,t=(0,i.Z)(e,u),a=o.useState(null),v=(0,r.Z)(a,2),m=v[0],x=v[1],h=function(){var e=(0,l.Z)(d().mark((function e(){var s;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:"function"===typeof n?(s=o.lazy(n),x((0,p.jsx)(o.Suspense,{fallback:"loading...",children:(0,p.jsx)(s,{})}))):x(n);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return o.useEffect((function(){n&&h()}),[n]),(0,p.jsx)("div",(0,c.Z)({children:m},t,{className:"preview-body "+s}))},m=function(e){var s=e.comments,n=void 0===s?{}:s,t=o.useMemo((function(){var e=[],s=!0;return n&&Object.keys(n).length&&(n.title&&e.push((0,p.jsx)("legend",{className:"preview-title-head",children:n.title},"1")),n.description&&(s=!1,e.push((0,p.jsx)("div",{className:"preview-title-body",children:n.description},"3")))),(0,p.jsx)("fieldset",{className:"preview-title preview-fieldset "+(s&&"preview-title-top-border"),children:e})}),[n]);return(0,p.jsx)(o.Fragment,{children:t})};var x=n.p+"static/media/copy.ff04822ec1c7df0a045fbff88997d571.svg";var h=n.p+"static/media/checkSign.ca85b15514f3a0d45c20e45f12c5959f.svg",f=n(497),w=n.n(f),j=function(e){var s=e.copyNodes,n=o.useRef(),t=o.useRef(),c=o.useMemo((function(){return!!s}),[s]),i=function(){if(!t.current){t.current=!0;var e=n.current.getAttribute("class");n.current.setAttribute("class",e+" preview-button-copy-active"),w()(s,(function(){setTimeout((function(){t.current=!1,n.current.setAttribute("class",""+e)}),2e3)}))}},r=o.useMemo((function(){return c?(0,p.jsxs)("div",{ref:n,onClick:i,className:"preview-button-span preview-button-copy",children:[(0,p.jsx)("img",{className:"copy",width:20,height:20,src:x}),(0,p.jsx)("img",{className:"check",width:20,height:20,src:h})]}):(0,p.jsx)(o.Fragment,{})}),[c,s]);return(0,p.jsx)(o.Fragment,{children:r})};var g=n.p+"static/media/expand.d8ce9844eb98a7800210a2416af0c23d.svg";var N=n.p+"static/media/unexpand.5e37d6751dab933177b1ed6fc220d5c6.svg",b=function(e){var s=e.show,n=e.onClick;return(0,p.jsx)(o.Fragment,{children:(0,p.jsxs)("div",{className:"preview-button-span preview-code-exand-unexpand-icon",onClick:function(){return n(!s)},children:[(0,p.jsx)("img",{width:20,height:20,src:g,className:"preview-code-exand-unexpand-icon-"+!s}),(0,p.jsx)("img",{width:20,height:20,src:N,className:"preview-code-exand-unexpand-icon-"+s})]})})},y=n(29),z=function(e){return(0,p.jsx)("div",{className:"preview-button-ccs",children:(0,p.jsx)(y.Z,(0,c.Z)({},e,{children:(0,p.jsx)("svg",{className:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4088",width:"18",height:"18",children:(0,p.jsx)("path",{d:"M85.333333 256l446.08-256L977.493333 256 981.333333 765.866667 531.413333 1024 85.333333 768V256z m89.088 105.856v202.965333l142.72 79.36v150.016l169.472 97.962667v-352.938667L174.421333 361.856z m714.197334 0l-312.192 177.365333v352.938667l169.472-97.962667V644.266667l142.72-79.402667V361.813333zM219.050667 281.642667l311.594666 176.810666 312.32-178.346666-165.162666-93.738667-145.493334 82.986667-146.346666-83.968L219.008 281.6z","p-id":"4089"})})}))})},Z=n(908),k=function(e){return(0,p.jsx)("div",{className:"preview-button-ccs",children:(0,p.jsx)(Z.Z,(0,c.Z)({},e,{children:(0,p.jsx)("svg",{className:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"7514",width:"18",height:"18",children:(0,p.jsx)("path",{d:"M271.973 508.68l-0.467 0.516c-15.161 17.134-6.178 44.443 16.396 49.075l162.817 33.411-147.137 354.746c-12.63 30.449 26.067 55.938 49.027 32.294l410.916-423.155 0.486-0.511c15.79-16.999 6.974-44.925-15.926-49.613l-152.962-31.315L718.788 109.69c10.37-30.56-28.32-53.605-50.226-29.915L271.972 508.68z m345.075-285.15l-89.404 263.48-0.215 0.657c-5.298 16.85 5.123 34.684 22.518 38.245l132.675 27.162L418.71 824.845l101.086-243.71 0.25-0.621c6.7-17.199-3.668-36.397-21.844-40.127l-146.367-30.033L617.048 223.53z",fill:"#333333","p-id":"7515"})})}))})},O=n(611),L=n.n(O),M=["includeModule"],S=function(e){var s=e.includeModule,n=(0,i.Z)(e,M);if(n&&n.js){var t=(s||[]).join("|");n.js=n.js.replace(/import([\s\S]*?)(?=['"])['"].*['"]( *;|;)?/gm,(function(e){return t&&new RegExp("from\\s+['\"]("+t+")['\"](s.+)?;?").test(e)?e:"/** "+e+" **/"}))}return(0,p.jsx)("div",{className:"preview-button-ccs",children:(0,p.jsx)(L(),(0,c.Z)({},n,{children:(0,p.jsx)("svg",{className:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"2070",width:"18",height:"18",children:(0,p.jsx)("path",{d:"M123.428571 668l344.571429 229.714286v-205.142857L277.142857 565.142857z m-35.428571-82.285714l110.285714-73.714286-110.285714-73.714286v147.428572z m468 312l344.571429-229.714286-153.714286-102.857143-190.857143 127.428572v205.142857z m-44-281.714286l155.428571-104-155.428571-104-155.428571 104zM277.142857 458.857143l190.857143-127.428572V126.285714L123.428571 356z m548.571429 53.142857l110.285714 73.714286V438.285714z m-78.857143-53.142857l153.714286-102.857143-344.571429-229.714286v205.142857z m277.142857-102.857143v312q0 23.428571-19.428571 36.571429l-468 312q-12 7.428571-24.571429 7.428571t-24.571429-7.428571L19.428571 704.571429q-19.428571-13.142857-19.428571-36.571429V356q0-23.428571 19.428571-36.571429L487.428571 7.428571q12-7.428571 24.571429-7.428571t24.571429 7.428571l468 312q19.428571 13.142857 19.428571 36.571429z","p-id":"2071"})})}))})},B=function(e){var s=e.code,n=e.comments,t=void 0===n?{}:n,i=e.copyNodes,a=e.codePenOptions,d=e.codeSandboxOptions,l=e.stackBlitzOptions,u=o.useState(!1),v=(0,r.Z)(u,2),x=v[0],h=v[1];return(0,p.jsxs)(o.Fragment,{children:[(0,p.jsx)(m,{comments:t}),(0,p.jsxs)("div",{className:"preview-button",children:[d&&(0,p.jsx)(z,(0,c.Z)({},d)),a&&(0,p.jsx)(S,(0,c.Z)({},a)),l&&(0,p.jsx)(k,(0,c.Z)({},l)),(0,p.jsx)(j,{copyNodes:i}),(0,p.jsx)(b,{show:x,onClick:h})]}),(0,p.jsx)("div",{className:"preview-code preview-code-"+x,children:s})]})},C=["code","comments","className","isSpacing","copyNodes","properties","codePenOptions","codeSandboxOptions","stackBlitzOptions"],R=function(e){var s=e.code,n=e.comments,t=e.className,o=void 0===t?"":t,r=e.isSpacing,a=void 0===r||r,d=e.copyNodes,l=void 0===d?"":d,u=e.codePenOptions,m=e.codeSandboxOptions,x=e.stackBlitzOptions,h=(0,i.Z)(e,C);return(0,p.jsxs)("div",{className:"preview-fieldset "+(a?"preview-fieldset-warp":"")+" "+o,children:[(0,p.jsx)(v,(0,c.Z)({},h)),(0,p.jsx)(B,{codePenOptions:u,codeSandboxOptions:m,stackBlitzOptions:x,code:s,comments:n,copyNodes:l})]})},q=function(e){e.copyNodes,"".concat(e.copyNodes.replace("export default","const App_Render = "),'\nReactDOM.createRoot(document.getElementById("root")).render(<App_Render />);\n    '),e.copyNodes;return console.log("props----\x3e",e),(0,p.jsx)(R,(0,t.Z)({},e))}}}]);
//# sourceMappingURL=833.8a6bf0e6.chunk.js.map