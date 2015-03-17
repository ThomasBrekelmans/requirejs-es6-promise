/* jslint regexp: true */
/* global require, define */
/* global Promise */
define(function () {
	'use strict';

	var VERSION = 0.1;

	/**
	 * A function that is called to load a resource. This is the only mandatory API method that needs to be implemented
	 *  for the plugin to be useful.
	 *
	 * @param name {String} The name of the resource to load. This is the part after the ! separator in the name.
	 *   So, if a module asks for 'foo!something/for/foo', the foo module's load function will receive
	 *   'something/for/foo' as the name.
	 * @param parentRequire {Function} A local "require" function to use to load other modules. This require function
	 *   has some utilities on it:
	 *     parentRequire.toUrl(moduleResource) where moduleResource is a module name plus an extension. For instance
	 *       "view/templates/main.html". It will return a full path to the resource, obeying any RequireJS configuration.
	 *     parentRequire.defined(moduleName) Returns true if the module has already been loaded and defined.
	 *       Used to be called require.isDefined before RequireJS 0.25.0.
	 *     parentRequire.specified(moduleName) Returns true if the module has already been requested or is in the process
	 *       of loading and should be available at some point.
	 * @param onLoad {Function} A function to call with the value for name. This tells the loader that the plugin is
	 *   done loading the resource.
	 *     onLoad.error() can be called, passing an error object to it, if the plugin detects an error condition that
	 *     means the resource will fail to load correctly.
	 * @param config {Object} A configuration object. This is a way for the optimizer and the web app to pass
	 *   configuration information to the plugin. The i18n! plugin uses this to get the current current locale, if the
	 *   web app wants to force a specific locale. The optimizer will set an isBuild property in the config to true if
	 *   this plugin (or pluginBuilder) is being called as part of an optimizer build.
	 */
	function load (name, parentRequire, onLoad, config) {
		// load is being called by the browser
		parentRequire([name], function (loadedModule) {
			// if it is not a Promise, continue normally
			if (!loadedModule || !loadedModule.then) {
				onLoad(loadedModule);
				return;
			}

			// loadedModule is now assumed to be a Promise
			// When it is resolved, call onLoad, when it is rejected, call onLoad.error.
			loadedModule.then(onLoad, onLoad.error);
		});
	}

	return {
		version: VERSION,

		load: load
	};
});
