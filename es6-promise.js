/* jslint regexp: true */
/* global require, define */
define(function () {
	'use strict';

	var VERSION = '0.8.0';

	/**
	 * The implementation of the RequireJS plugin load() method. This method is called automatically by RequireJS
	 * whenever a resource is prefixed with the (aliased) name of this plugin (@see README.md#usage); the part before
	 * the ! separator.
	 *
	 * @param name           {String}   The name of the resource to load; this is the part after the ! separator.
	 * @param parentRequire  {Function} A local "require" function to use to load other modules.
	 * @param onLoad         {Function} A function to call with the value for name. This tells the loader that the
	 *                                      plugin is done loading the resource.
	 *          onLoad.error {Function} A function to call with an error object whenever an error occurs in this plugin.
	 * @param config         {Object}   A configuration object. This is a way for the optimizer and the web app to pass
	 *                                    configuration information to the plugin. (Not used for this plugin.)
	 */
	function load (name, parentRequire, onLoad, config) {
		// load is being called by the browser
		parentRequire([name], function (loadedModule) {
			// if it is not a ('then-able') Promise
			if (!loadedModule || !loadedModule.then) {
				// continue normally by invoking onLoad directly (handing the responsibility to load this resource back
				// to the default load implementation of RequireJS).
				onLoad(loadedModule);
				return;
			}

			// loadedModule is now assumed to be a Promise
			// When it is resolved, call onLoad with the resolved data. When it is rejected, call onLoad.error with the
			// given reason; the value passed to the reject method of the returned Promise.
			// (@see MDN Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
			// TODO: onLoad.error is called when the Promise is rejected, but RequireJS doesn't rethrow the error which
			//   causes the module which depends on a resource/module using this plugin is never instantiated and
			//   nothing is shown to the developer.
			loadedModule.then(onLoad, onLoad.error);
		});
	}

	return {
		version: VERSION,

		load: load
	};
});
