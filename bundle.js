!function(){"use strict";function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function t(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function r(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?t(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var a=["пользователь","пользователя","пользователей"],c={loadMore:document.querySelector("[data-load-more]"),usersContainer:document.querySelector("[data-users-container]"),user:document.querySelector("#user-template"),spiner:document.querySelector("[data-load-spiner]"),statistic:document.querySelector("#statistics")};function o(e){var t=e.picture,r=e.name,n=e.gender,a=e.phone,o=e.email,l=e.location,u=e.dob,s=e.registered,f=new Date(u.date),p="".concat(i(f.getUTCDate()),"-").concat(i(f.getUTCMonth()+1),"-").concat(f.getUTCFullYear()),d=new Date(s.date),m="".concat(i(d.getUTCDate()),"-").concat(i(d.getUTCMonth()+1),"-").concat(d.getUTCFullYear()),y=c.user.innerHTML.replaceAll(/{{hrefImg}}/gi,t.large).replace(/{{lastName}}/,r.last).replace(/{{firstName}}/,r.first).replace(/{{gender}}/,n).replaceAll(/{{phone}}/gi,a).replaceAll(/{{email}}/gi,o).replace(/{{state}}/,l.state).replace(/{{city}}/,l.city).replace(/{{street}}/,l.street.name).replace(/{{birthday}}/,p).replace(/{{registered}}/,m);c.usersContainer.insertAdjacentHTML("afterbegin",y)}function i(e){return String(e).padStart(2,"0")}function l(t){var r,n,c=(n=2,function(e){if(Array.isArray(e))return e}(r=t)||function(e,t){var r=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null!=r){var n,a,c=[],o=!0,i=!1;try{for(r=r.call(e);!(o=(n=r.next()).done)&&(c.push(n.value),!t||c.length!==t);o=!0);}catch(e){i=!0,a=e}finally{try{o||null==r.return||r.return()}finally{if(i)throw a}}return c}}(r,n)||function(t,r){if(t){if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}(r,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),o=c[0],i=c[1],l=function(e,t){return t[e%100>4&&e%100<20?2:[2,0,1,1,1,2][e%10<5?e%10:5]]}(i,a);return"<div>".concat(o,": ").concat(i," ").concat(l,"</div>")}c.loadMore.addEventListener("click",(function(e){var t,a;c.spiner.classList.remove("is-hidden"),c.usersContainer.innerHTML="",(101,t=Math.floor(101*Math.random()),a="".concat("https://randomuser.me/api/","?results=").concat(t),fetch(a).then((function(e){return e.json()})).then((function(e){return e.results}))).then((function(e){!function(e){e.map(o),c.spiner.classList.add("is-hidden")}(e),function(e){var t=e.filter((function(e){return"female"===e.gender})),a=e.filter((function(e){return"male"===e.gender})),o=t>a?"женщин":t<a?"мужчин":"равное количество",i=e.flatMap((function(e){return e.nat})).reduce((function(e,t){return r(r({},e),{},n({},t,e[t]?e[t]+1:1))}),{}),u=c.statistic.innerHTML.replace(/{{users}}/,e.length).replace(/{{female}}/,t.length).replace(/{{male}}/,a.length).replace(/{{dominantGender}}/,o).replace(/{{nationality}}/,function(e){return Object.entries(e).map(l).join("")}(i));c.usersContainer.insertAdjacentHTML("beforeend",u)}(e)}))}))}();
//# sourceMappingURL=bundle.js.map