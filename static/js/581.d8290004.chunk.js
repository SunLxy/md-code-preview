(self.webpackChunkexamples=self.webpackChunkexamples||[]).push([[581],{526:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},914:function(e){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports},982:function(e,t,r){var o=r(526);function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}e.exports=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e},e.exports.__esModule=!0,e.exports.default=e.exports},666:function(e,t,r){var o=r(600);e.exports=function(e,t){if(null==e)return{};var r,n,s=o(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s},e.exports.__esModule=!0,e.exports.default=e.exports},600:function(e){e.exports=function(e,t){if(null==e)return{};var r,o,n={},s=Object.keys(e);for(o=0;o<s.length;o++)r=s[o],t.indexOf(r)>=0||(n[r]=e[r]);return n},e.exports.__esModule=!0,e.exports.default=e.exports},611:function(e,t,r){"use strict";var o=r(914).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=o(r(982)),s=o(r(666)),i=(o(r(133)),r(265)),a=["title","html","js","css","editors","css_external","js_external","js_pre_processor"],p="0010",u="babel",c=function(e){var t=e||{},r=t.title,o=t.html,c=t.js,l=t.css,f=t.editors,d=void 0===f?p:f,h=t.css_external,y=t.js_external,v=t.js_pre_processor,_=void 0===v?u:v,m=(0,s.default)(t,a),b={title:r,html:o,js:c,css:l,editors:d,css_external:h,js_external:y,js_pre_processor:_};return(0,i.jsxs)("form",(0,n.default)((0,n.default)({action:"https://codepen.io/pen/define",method:"POST",target:"_blank"},m),{},{children:[(0,i.jsx)("input",{type:"hidden",name:"data",value:JSON.stringify(b)}),(0,i.jsx)("button",{type:"submit",children:e.children})]}))};t.default=c,e.exports=t.default},29:function(e,t,r){"use strict";r(133),r(491),r(265)},908:function(e,t,r){"use strict";r(133);function o(){return Math.random().toString(36).substring(7)}var n=function(e){var t=this;this.pending={},this.port=e,this.port.onmessage=function(e){if(e.data.payload.__reqid){var r=e.data.payload.__reqid,o=e.data.payload.__success;if(t.pending[r]){if(delete e.data.payload.__reqid,delete e.data.payload.__success,o){var n=0===Object.keys(e.data.payload).length&&e.data.payload.constructor===Object?null:e.data.payload;t.pending[r].resolve(n)}else{var s=e.data.payload.error?e.data.type+": "+e.data.payload.error:e.data.type;t.pending[r].reject(s)}delete t.pending[r]}}}};n.prototype.request=function(e){var t=this,r=o();return new Promise((function(o,n){t.pending[r]={resolve:o,reject:n},e.payload.__reqid=r,t.port.postMessage(e)}))};var s=function(e,t){var r=this;this.rdc=new n(e),this.preview={},Object.defineProperty(this.preview,"origin",{value:t.previewOrigin,writable:!1}),this.editor={openFile:function(e){return r.rdc.request({type:"SDK_OPEN_FILE",payload:{path:e}})}}};s.prototype.applyFsDiff=function(e){return this.rdc.request({type:"SDK_APPLY_FS_DIFF",payload:e})},s.prototype.getFsSnapshot=function(){return this.rdc.request({type:"SDK_GET_FS_SNAPSHOT",payload:{}})},s.prototype.getDependencies=function(){return this.rdc.request({type:"SDK_GET_DEPS_SNAPSHOT",payload:{}})};r(265)},491:function(e,t,r){"use strict";var o=r(558)},558:function(e,t,r){var o,n=function(){var e=String.fromCharCode,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",o={};function n(e,t){if(!o[e]){o[e]={};for(var r=0;r<e.length;r++)o[e][e.charAt(r)]=r}return o[e][t]}var s={compressToBase64:function(e){if(null==e)return"";var r=s._compress(e,6,(function(e){return t.charAt(e)}));switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(e){return null==e?"":""==e?null:s._decompress(e.length,32,(function(r){return n(t,e.charAt(r))}))},compressToUTF16:function(t){return null==t?"":s._compress(t,15,(function(t){return e(t+32)}))+" "},decompressFromUTF16:function(e){return null==e?"":""==e?null:s._decompress(e.length,16384,(function(t){return e.charCodeAt(t)-32}))},compressToUint8Array:function(e){for(var t=s.compress(e),r=new Uint8Array(2*t.length),o=0,n=t.length;o<n;o++){var i=t.charCodeAt(o);r[2*o]=i>>>8,r[2*o+1]=i%256}return r},decompressFromUint8Array:function(t){if(null===t||void 0===t)return s.decompress(t);for(var r=new Array(t.length/2),o=0,n=r.length;o<n;o++)r[o]=256*t[2*o]+t[2*o+1];var i=[];return r.forEach((function(t){i.push(e(t))})),s.decompress(i.join(""))},compressToEncodedURIComponent:function(e){return null==e?"":s._compress(e,6,(function(e){return r.charAt(e)}))},decompressFromEncodedURIComponent:function(e){return null==e?"":""==e?null:(e=e.replace(/ /g,"+"),s._decompress(e.length,32,(function(t){return n(r,e.charAt(t))})))},compress:function(t){return s._compress(t,16,(function(t){return e(t)}))},_compress:function(e,t,r){if(null==e)return"";var o,n,s,i={},a={},p="",u="",c="",l=2,f=3,d=2,h=[],y=0,v=0;for(s=0;s<e.length;s+=1)if(p=e.charAt(s),Object.prototype.hasOwnProperty.call(i,p)||(i[p]=f++,a[p]=!0),u=c+p,Object.prototype.hasOwnProperty.call(i,u))c=u;else{if(Object.prototype.hasOwnProperty.call(a,c)){if(c.charCodeAt(0)<256){for(o=0;o<d;o++)y<<=1,v==t-1?(v=0,h.push(r(y)),y=0):v++;for(n=c.charCodeAt(0),o=0;o<8;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1}else{for(n=1,o=0;o<d;o++)y=y<<1|n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n=0;for(n=c.charCodeAt(0),o=0;o<16;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1}0==--l&&(l=Math.pow(2,d),d++),delete a[c]}else for(n=i[c],o=0;o<d;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1;0==--l&&(l=Math.pow(2,d),d++),i[u]=f++,c=String(p)}if(""!==c){if(Object.prototype.hasOwnProperty.call(a,c)){if(c.charCodeAt(0)<256){for(o=0;o<d;o++)y<<=1,v==t-1?(v=0,h.push(r(y)),y=0):v++;for(n=c.charCodeAt(0),o=0;o<8;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1}else{for(n=1,o=0;o<d;o++)y=y<<1|n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n=0;for(n=c.charCodeAt(0),o=0;o<16;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1}0==--l&&(l=Math.pow(2,d),d++),delete a[c]}else for(n=i[c],o=0;o<d;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1;0==--l&&(l=Math.pow(2,d),d++)}for(n=2,o=0;o<d;o++)y=y<<1|1&n,v==t-1?(v=0,h.push(r(y)),y=0):v++,n>>=1;for(;;){if(y<<=1,v==t-1){h.push(r(y));break}v++}return h.join("")},decompress:function(e){return null==e?"":""==e?null:s._decompress(e.length,32768,(function(t){return e.charCodeAt(t)}))},_decompress:function(t,r,o){var n,s,i,a,p,u,c,l=[],f=4,d=4,h=3,y="",v=[],_={val:o(0),position:r,index:1};for(n=0;n<3;n+=1)l[n]=n;for(i=0,p=Math.pow(2,2),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;switch(i){case 0:for(i=0,p=Math.pow(2,8),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;c=e(i);break;case 1:for(i=0,p=Math.pow(2,16),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;c=e(i);break;case 2:return""}for(l[3]=c,s=c,v.push(c);;){if(_.index>t)return"";for(i=0,p=Math.pow(2,h),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;switch(c=i){case 0:for(i=0,p=Math.pow(2,8),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;l[d++]=e(i),c=d-1,f--;break;case 1:for(i=0,p=Math.pow(2,16),u=1;u!=p;)a=_.val&_.position,_.position>>=1,0==_.position&&(_.position=r,_.val=o(_.index++)),i|=(a>0?1:0)*u,u<<=1;l[d++]=e(i),c=d-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,h),h++),l[c])y=l[c];else{if(c!==d)return null;y=s+s.charAt(0)}v.push(y),l[d++]=s+y.charAt(0),s=y,0==--f&&(f=Math.pow(2,h),h++)}}};return s}();void 0===(o=function(){return n}.call(t,r,t,e))||(e.exports=o)}}]);
//# sourceMappingURL=581.d8290004.chunk.js.map