# requirejs-es6-promise
A RequireJS loader plugin which allows modules to delay their availability by exporting an ES6 Promise.

## TODO
- Improve this file's Markdown.
- Improve this file's usage section.
- Publish this package on bower.

## Usage
- Install this package with bower (as soon as it is published)
```sh
bower install requirejs-es6-promise
```

- Configure the RequireJS path for this library
@see http://requirejs.org/docs/api.html#jsfiles

- Define a RequireJS (AMD) module which returns a Promise 
(assume this is stored in a file called async-dependency.js)
```js
define(function () {
	// Pretend this module has an api whose value needs to be resolved asynchronously 
	// (perhaps it has to be loaded from an external service?).
	var api = {
			value: ''
		};

	// Create a simple Promise which resolves after a timeout of 500ms 
	// (to fake an external service) or is rejected immediately with a 50% chance.
	var promise = new Promise(function (resolve, reject) {
		// Do something asynchronously here and when it's finished, 
		// call resolve with the actual value to return by this module.
		var resolveTimeoutId = setTimeout(function () {
			api.value = 'Resolved value set after 500ms';
			
			resolve(api);
		}, 500);
		
		// If an error occurs,
		if (Math.random() > 0.5) {
			// prevent resolve from being called by aborting the timeout,
			clearTimeout(resolveTimeoutId);
			
			// and call reject instead.
			reject(new Error('Oops something went wrong'));
		}
	});
	
	return promise;
});
```

- Define another module which depends on the first module using this plugin
```js
define([
	'promise!./async-dependency'
],
function (
	asyncDependency
) {
	// Logs 'Resolved value set after 500ms'.
	console.log(asyncDependency.value);
});
```
