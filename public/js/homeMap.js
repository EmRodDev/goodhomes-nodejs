/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/homeMap.js":
/*!***************************!*\
  !*** ./src/js/homeMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n        //Logical OR\r\n        const lat = 25.8727564;\r\n        const lng = -80.2939832;\r\n        \r\n        const map = L.map('home-map').setView([lat, lng ], 20);\r\n        let markers = new L.FeatureGroup().addTo(map);\r\n                \r\n        //Filters \r\n        const filters = {\r\n            category: '',\r\n            price: '',\r\n            published: true\r\n        }\r\n\r\n        const categoriesSelect = document.querySelector('#categories');\r\n        const pricesSelect = document.querySelector('#prices');\r\n\r\n        //Filtering of Categories and Prices\r\n\r\n        categoriesSelect.addEventListener('change', e => {\r\n            filters.category = +e.target.value\r\n        });\r\n\r\n        pricesSelect.addEventListener('change', e => {\r\n            filters.price = +e.target.value\r\n        });\r\n\r\n        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n        }).addTo(map);\r\n\r\n        const getProperties = async () =>{\r\n            try{\r\n                const url = '/api/properties';\r\n                const response = await fetch(url);\r\n                const properties = await response.json();\r\n\r\n\r\n                showProperties(properties);\r\n\r\n            } catch(err){\r\n                console.log(err);\r\n            }\r\n        }\r\n\r\n        const showProperties = properties => {\r\n            properties.forEach(property =>{\r\n                \r\n                if(property.published){\r\n\r\n                    //Add the pins\r\n                    const marker = new L.marker([property?.lat, property?.lng], {\r\n                        autoPan: true\r\n                    }).addTo(map)\r\n                    .bindPopup(`\r\n                    <h1 class=\"text-xl font-extrabold my-2\">${property.title}</h1>\r\n                    <img src=\"/uploads/${property?.images}\" alt=\"Property's image\"></img>\r\n                    <p class=\"text-gray-600 font-bold\">${property.price.value}</p>\r\n                    <p class=\"text-green-600 font-bold\">${property.category.name}</p>\r\n                    <a href=\"/property/${property.id}\" class=\"bg-green-600 block p-2 text-center font-bold uppercase text-white-0\">View property</a>\r\n                    `);\r\n\r\n                    markers.addLayer(marker);\r\n                }\r\n\r\n            });\r\n        }\r\n\r\n        getProperties();\r\n})()\n\n//# sourceURL=webpack://goodhomes-nodejs/./src/js/homeMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/homeMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;