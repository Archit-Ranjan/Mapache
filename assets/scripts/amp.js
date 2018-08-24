/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4e115e6371bcd9101bb1"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(53)(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html5-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 3);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
/*!**********************************************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 5);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 8);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 10)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 15);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 4)(module)))

/***/ }),
/* 4 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 6);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 7);


/***/ }),
/* 6 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 7 */
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 8 */
/*!*******************************************!*\
  !*** ../node_modules/strip-ansi/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 9)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 9 */
/*!*******************************************!*\
  !*** ../node_modules/ansi-regex/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/client-overlay.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 11);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 11 */
/*!******************************************!*\
  !*** ../node_modules/ansi-html/index.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 12 */
/*!**********************************************!*\
  !*** ../node_modules/html-entities/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 13),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 14),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 1),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 1)
};


/***/ }),
/* 13 */
/*!*********************************************************!*\
  !*** ../node_modules/html-entities/lib/xml-entities.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 14 */
/*!***********************************************************!*\
  !*** ../node_modules/html-entities/lib/html4-entities.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 15 */
/*!****************************************************************!*\
  !*** ../node_modules/webpack-hot-middleware/process-update.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 16 */,
/* 17 */
/*!**************************************************!*\
  !*** ../node_modules/css-loader/lib/css-base.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 18 */
/*!*****************************************************!*\
  !*** ../node_modules/style-loader/lib/addStyles.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 19 */
/*!************************************************!*\
  !*** ../node_modules/style-loader/lib/urls.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 20 */
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/cache-loader/dist/cjs.js!../node_modules/css-loader?{"sourceMap":true}!../node_modules/postcss-loader/lib?{"config":{"path":"C://Users//Smigol//projects//ghost//content//themes//mapache//src//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]","paths":{"root":"C://Users//Smigol//projects//ghost//content//themes//mapache","assets":"C://Users//Smigol//projects//ghost//content//themes//mapache//src","dist":"C://Users//Smigol//projects//ghost//content//themes//mapache//assets"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["**_/*.hbs"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"amp":["./scripts/amp.js","./styles/amp.scss"]},"publicPath":"/assets/","devUrl":"http://localhost:2368","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!../node_modules/resolve-url-loader?{"sourceMap":true}!../node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!../node_modules/import-glob!./styles/amp.scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 17)(true);
// imports


// module
exports.push([module.i, "/* line 9, stdin */\n\n.u-bgColor {\n  background-color: #1C9963;\n}\n\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 32, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 45, node_modules/normalize.css/normalize.css */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 56, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 68, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 77, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 87, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 97, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 108, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 117, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 129, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 140, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 152, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 168, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 178, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 187, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 198, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 210, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 221, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 232, node_modules/normalize.css/normalize.css */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 245, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 262, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 272, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 282, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 291, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 300, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 312, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 331, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/* line 15, stdin */\n\n.u-flexCenter {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n/* line 16, stdin */\n\n.u-block {\n  display: block;\n}\n\n/* line 17, stdin */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 18, stdin */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 19, stdin */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 20, stdin */\n\n.u-flex1 {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n/* line 21, stdin */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 22, stdin */\n\n.u-textCenter {\n  text-align: center;\n}\n\n/* line 24, stdin */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n/* line 31, stdin */\n\n.u-textColorNormal {\n  color: rgba(0, 0, 0, 0.44);\n  fill: rgba(0, 0, 0, 0.44);\n}\n\n/* line 39, stdin */\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* line 43, stdin */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 47, stdin */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 53, stdin */\n\nbody {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 1rem;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4em;\n  text-rendering: optimizeLegibility;\n  -webkit-text-size-adjust: 100%;\n     -moz-text-size-adjust: 100%;\n      -ms-text-size-adjust: 100%;\n          text-size-adjust: 100%;\n}\n\n/* line 64, stdin */\n\nblockquote {\n  border-left: 3px solid rgba(0, 0, 0, 0.8);\n  font-style: italic;\n  letter-spacing: -.003em;\n  margin-left: -5px;\n  margin-right: 0;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 74, stdin */\n\nfigure {\n  margin: 20px 0 0;\n  padding: 0;\n}\n\n/* line 79, stdin */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  -webkit-font-feature-settings: \"liga\" on, \"lnum\" on;\n          font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 97, stdin */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-style: normal;\n  font-weight: 600;\n  letter-spacing: -.028em;\n  line-height: 1.1;\n  margin: 25px 0 0;\n}\n\n/* line 106, stdin */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 107, stdin */\n\nh2 {\n  font-size: 1.75rem;\n}\n\n/* line 108, stdin */\n\nh3 {\n  font-size: 1.5rem;\n}\n\n/* line 109, stdin */\n\nh4 {\n  font-size: 1.375rem;\n}\n\n/* line 110, stdin */\n\nh5 {\n  font-size: 1.25rem;\n}\n\n/* line 111, stdin */\n\nh6 {\n  font-size: 1.125rem;\n}\n\n/* line 113, stdin */\n\nhr {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n  overflow: visible;\n  height: 0;\n}\n\n/* line 121, stdin */\n\nhr::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -30px;\n}\n\n/* line 134, stdin */\n\nmark {\n  background-color: transparent;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d7fdd3), to(#d7fdd3));\n  background-image: -webkit-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: -o-linear-gradient(top, #d7fdd3, #d7fdd3);\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 140, stdin */\n\np {\n  margin: 20px 0 0 0;\n}\n\n/* line 144, stdin */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 151, stdin */\n\np code {\n  background: #EFEFEF;\n  border-radius: 2px;\n  color: #c7254e;\n  padding: 1px 6px;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 159, stdin */\n\npre {\n  background: #EFEFEF;\n  border-radius: 3px;\n  padding: 10px;\n  overflow-x: auto;\n  font-size: 0.875rem;\n}\n\n/* line 167, stdin */\n\nsvg {\n  width: 100%;\n  height: 100%;\n}\n\n/* line 172, stdin */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tables */\n\n/* line 177, stdin */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 192, stdin */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 198, stdin */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 202, stdin */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 210, stdin */\n\niframe,\namp-iframe,\n.fluid-width-video-wrapper {\n  margin-top: 30px;\n}\n\n/* line 217, stdin */\n\n.header {\n  position: relative;\n  width: 100%;\n  height: 50px;\n  line-height: 1;\n}\n\n/* line 229, stdin */\n\n.logo-link {\n  color: #fff;\n  font-size: 24px;\n  font-weight: 600;\n}\n\n/* line 238, stdin */\n\n.follow a {\n  margin: 0 5px;\n  width: 22px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 245, stdin */\n\n.follow svg {\n  fill: rgba(0, 0, 0, 0.8);\n  stroke: none;\n}\n\n/* line 251, stdin */\n\n.copyright {\n  font-size: 0.875rem;\n}\n\n/* line 254, stdin */\n\n.copyright a {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n/* line 259, stdin */\n\n.article-meta {\n  color: #999;\n  margin: 10px 0;\n  font-size: 0.875rem;\n}\n\n/* line 264, stdin */\n\n.article-meta a {\n  font-weight: 600;\n  color: #222;\n}\n\n/* line 273, stdin */\n\n.sidebar {\n  width: 280px;\n  background: #fff;\n}\n\n/* line 277, stdin */\n\n.sidebar ul {\n  margin: 18px 0 20px;\n}\n\n/* line 279, stdin */\n\n.sidebar ul li a {\n  margin-bottom: 5px;\n  padding: 6px 20px;\n}\n\n/* line 284, stdin */\n\n.sidebar .follow {\n  padding: 20px;\n  border-top: 1px solid #ddd;\n}\n\n/* line 287, stdin */\n\n.close-sidebar {\n  height: 50px;\n  font-size: 25px;\n  line-height: 50px;\n  text-align: right;\n  padding-right: 20px;\n  color: #fff;\n}\n\n/* line 299, stdin */\n\n.main {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n/* line 304, stdin */\n\n.article {\n  padding: 25px 16px;\n  /* stylelint-disable */\n  /* stylelint-enable */\n}\n\n/* line 307, stdin */\n\n.article-title {\n  line-height: 1.04;\n  margin-top: 0;\n}\n\n/* line 309, stdin */\n\n.article-excerpt {\n  margin-bottom: 20px;\n  margin-top: 10px;\n  color: #7d7d7d;\n  font-size: 1.125rem;\n}\n\n/* line 317, stdin */\n\n.article amp-img,\n.article amp-anim {\n  position: relative;\n  left: 50%;\n  display: block;\n  padding: 0;\n  min-width: 0;\n  max-width: 112%;\n  width: calc(100% + 32px);\n  height: auto;\n  -webkit-transform: translateX(-50%);\n       -o-transform: translateX(-50%);\n          transform: translateX(-50%);\n}\n\n/* line 331, stdin */\n\n.article-tags {\n  padding: 30px 0 0;\n  /* stylelint-disable-next-line */\n}\n\n/* line 335, stdin */\n\n.article-tags a {\n  background: rgba(0, 0, 0, 0.08);\n  border-radius: 3px;\n  color: rgba(0, 0, 0, 0.6);\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 600;\n  height: 37px;\n  line-height: 35px;\n  margin: 0 8px 8px 0;\n  padding: 0 16px;\n}\n\n/* line 350, stdin */\n\n.article-body {\n  font-family: \"Merriweather\", serif;\n  line-height: 1.65em;\n  /* stylelint-disable-next-line */\n}\n\n/* line 355, stdin */\n\n.article-body a {\n  text-decoration: underline;\n}\n\n/* line 357, stdin */\n\n.article-body ul,\n.article-body ol {\n  counter-reset: post;\n  margin-top: 20px;\n}\n\n/* line 362, stdin */\n\n.article-body ul li,\n.article-body ol li {\n  letter-spacing: -.003em;\n  margin: 5px;\n  margin-left: 30px;\n  position: relative;\n}\n\n/* line 368, stdin */\n\n.article-body ul li::before,\n.article-body ol li::before {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  display: inline-block;\n  margin-left: -30px;\n  position: absolute;\n  text-align: right;\n  width: 30px;\n}\n\n/* line 379, stdin */\n\n.article-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n}\n\n/* line 385, stdin */\n\n.article-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 391, stdin */\n\n.article-body .kg-embed-card,\n.article-body pre {\n  margin-right: -16px;\n  margin-left: -16px;\n}\n\n/* line 399, stdin */\n\n.share {\n  margin: 15px 0 0;\n}\n\n/* line 403, stdin */\n\namp-social-share.custom-style {\n  background-color: #008080;\n  background-image: url(\"https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_white_48dp.png\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n}\n\n/* line 411, stdin */\n\namp-social-share.rounded {\n  border-radius: 10%;\n  background-size: 85%;\n}\n\n/* line 420, stdin */\n\n.related {\n  padding-top: 20px;\n  padding-bottom: 20px;\n  margin-top: 30px;\n  background: #fafafa;\n}\n\n/* line 426, stdin */\n\n.related-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  margin-bottom: 30px;\n}\n\n/* line 430, stdin */\n\n.related-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  color: rgba(0, 0, 0, 0.84);\n  display: inline-block;\n  font-size: 18px;\n  font-weight: 600;\n  padding-bottom: 20px;\n}\n\n/* line 443, stdin */\n\n.story-border {\n  border-left: 3px solid #CC116E;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  font-size: 36px;\n  font-weight: 600;\n  left: 0;\n  padding: 15px 10px 10px;\n  top: 0;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 458, stdin */\n\n.story:nth-child(3n) .story-border {\n  border-color: #f59e00;\n}\n\n/* line 459, stdin */\n\n.story:nth-child(3n+2) .story-border {\n  border-color: #26a8ed;\n}\n\n/* line 461, stdin */\n\n.story-link {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  -webkit-box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n          box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  min-height: 50px;\n  padding: 15px 15px 15px 55px;\n}\n\n/* line 469, stdin */\n\n.story-title {\n  line-height: 1.1;\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0;\n}\n\n/* line 479, stdin */\n\n.footer {\n  background-color: #fafafa;\n  color: rgba(0, 0, 0, 0.44);\n  font-weight: 600;\n  padding-top: 20px;\n  padding-bottom: 45px;\n}\n\n/* line 488, stdin */\n\n.hamburgermenu {\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  height: 48px;\n  position: relative;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  -o-transition: -o-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s, -o-transform .4s;\n  width: 48px;\n  margin-right: -15px;\n}\n\n/* line 498, stdin */\n\n.hamburgermenu span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  width: 20px;\n}\n\n/* line 508, stdin */\n\n.hamburgermenu span:first-child {\n  -webkit-transform: translate(0, -6px);\n       -o-transform: translate(0, -6px);\n          transform: translate(0, -6px);\n}\n\n/* line 509, stdin */\n\n.hamburgermenu span:last-child {\n  -webkit-transform: translate(0, 6px);\n       -o-transform: translate(0, 6px);\n          transform: translate(0, 6px);\n}\n\n", "", {"version":3,"sources":["C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/amp.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/src/styles/amp.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/amp.scss","C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/C:/Users/Smigol/projects/ghost/content/themes/mapache/src/styles/node_modules/normalize.css/normalize.css"],"names":[],"mappings":"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","file":"amp.scss","sourcesContent":["/* line 9, stdin */\n.u-bgColor {\n  background-color: #1C9963; }\n\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n/* line 11, node_modules/normalize.css/normalize.css */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers.\n */\n/* line 23, node_modules/normalize.css/normalize.css */\nbody {\n  margin: 0; }\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n/* line 32, node_modules/normalize.css/normalize.css */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n/* line 45, node_modules/normalize.css/normalize.css */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 56, node_modules/normalize.css/normalize.css */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Remove the gray background on active links in IE 10.\n */\n/* line 68, node_modules/normalize.css/normalize.css */\na {\n  background-color: transparent; }\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n/* line 77, node_modules/normalize.css/normalize.css */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n/* line 87, node_modules/normalize.css/normalize.css */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n/* line 97, node_modules/normalize.css/normalize.css */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n * Add the correct font size in all browsers.\n */\n/* line 108, node_modules/normalize.css/normalize.css */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n/* line 117, node_modules/normalize.css/normalize.css */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\n/* line 125, node_modules/normalize.css/normalize.css */\nsub {\n  bottom: -0.25em; }\n\n/* line 129, node_modules/normalize.css/normalize.css */\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove the border on images inside links in IE 10.\n */\n/* line 140, node_modules/normalize.css/normalize.css */\nimg {\n  border-style: none; }\n\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n/* line 152, node_modules/normalize.css/normalize.css */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n/* line 168, node_modules/normalize.css/normalize.css */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n/* line 178, node_modules/normalize.css/normalize.css */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n/* line 187, node_modules/normalize.css/normalize.css */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n/* line 198, node_modules/normalize.css/normalize.css */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n/* line 210, node_modules/normalize.css/normalize.css */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n * Correct the padding in Firefox.\n */\n/* line 221, node_modules/normalize.css/normalize.css */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n/* line 232, node_modules/normalize.css/normalize.css */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n/* line 245, node_modules/normalize.css/normalize.css */\nprogress {\n  vertical-align: baseline; }\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n/* line 253, node_modules/normalize.css/normalize.css */\ntextarea {\n  overflow: auto; }\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n/* line 262, node_modules/normalize.css/normalize.css */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n/* line 272, node_modules/normalize.css/normalize.css */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n/* line 282, node_modules/normalize.css/normalize.css */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n/* line 291, node_modules/normalize.css/normalize.css */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n/* line 300, node_modules/normalize.css/normalize.css */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n/* line 312, node_modules/normalize.css/normalize.css */\ndetails {\n  display: block; }\n\n/*\n * Add the correct display in all browsers.\n */\n/* line 320, node_modules/normalize.css/normalize.css */\nsummary {\n  display: list-item; }\n\n/* Misc\n   ========================================================================== */\n/**\n * Add the correct display in IE 10+.\n */\n/* line 331, node_modules/normalize.css/normalize.css */\ntemplate {\n  display: none; }\n\n/**\n * Add the correct display in IE 10.\n */\n/* line 339, node_modules/normalize.css/normalize.css */\n[hidden] {\n  display: none; }\n\n/* line 15, stdin */\n.u-flexCenter {\n  align-items: center;\n  display: flex; }\n\n/* line 16, stdin */\n.u-block {\n  display: block; }\n\n/* line 17, stdin */\n.u-relative {\n  position: relative; }\n\n/* line 18, stdin */\n.u-overflowHidden {\n  overflow: hidden; }\n\n/* line 19, stdin */\n.u-fontSizeSmaller {\n  font-size: 14px; }\n\n/* line 20, stdin */\n.u-flex1 {\n  flex: 1 1 auto; }\n\n/* line 21, stdin */\n.u-absolute {\n  position: absolute; }\n\n/* line 22, stdin */\n.u-textCenter {\n  text-align: center; }\n\n/* line 24, stdin */\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px; }\n\n/* line 31, stdin */\n.u-textColorNormal {\n  color: rgba(0, 0, 0, 0.44);\n  fill: rgba(0, 0, 0, 0.44); }\n\n/* line 39, stdin */\n*, *::before, *::after {\n  box-sizing: border-box; }\n\n/* line 43, stdin */\na {\n  color: inherit;\n  text-decoration: none; }\n  /* line 47, stdin */\n  a:active, a:hover {\n    outline: 0; }\n\n/* line 53, stdin */\nbody {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 1rem;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4em;\n  text-rendering: optimizeLegibility;\n  text-size-adjust: 100%; }\n\n/* line 64, stdin */\nblockquote {\n  border-left: 3px solid rgba(0, 0, 0, 0.8);\n  font-style: italic;\n  letter-spacing: -.003em;\n  margin-left: -5px;\n  margin-right: 0;\n  padding-bottom: 2px;\n  padding-left: 20px; }\n\n/* line 74, stdin */\nfigure {\n  margin: 20px 0 0;\n  padding: 0; }\n\n/* line 79, stdin */\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%; }\n\n/* line 97, stdin */\nh1, h2, h3, h4, h5, h6 {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-style: normal;\n  font-weight: 600;\n  letter-spacing: -.028em;\n  line-height: 1.1;\n  margin: 25px 0 0; }\n\n/* line 106, stdin */\nh1 {\n  font-size: 2rem; }\n\n/* line 107, stdin */\nh2 {\n  font-size: 1.75rem; }\n\n/* line 108, stdin */\nh3 {\n  font-size: 1.5rem; }\n\n/* line 109, stdin */\nh4 {\n  font-size: 1.375rem; }\n\n/* line 110, stdin */\nh5 {\n  font-size: 1.25rem; }\n\n/* line 111, stdin */\nh6 {\n  font-size: 1.125rem; }\n\n/* line 113, stdin */\nhr {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n  overflow: visible;\n  height: 0; }\n  /* line 121, stdin */\n  hr::before {\n    color: rgba(0, 0, 0, 0.6);\n    content: '...';\n    display: inline-block;\n    font-family: \"Source Sans Pro\", sans-serif;\n    font-size: 28px;\n    font-weight: 400;\n    letter-spacing: .6em;\n    position: relative;\n    top: -30px; }\n\n/* line 134, stdin */\nmark {\n  background-color: transparent;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8); }\n\n/* line 140, stdin */\np {\n  margin: 20px 0 0 0; }\n\n/* line 144, stdin */\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0; }\n\n/* line 151, stdin */\np code {\n  background: #EFEFEF;\n  border-radius: 2px;\n  color: #c7254e;\n  padding: 1px 6px;\n  text-shadow: 0 1px #fff; }\n\n/* line 159, stdin */\npre {\n  background: #EFEFEF;\n  border-radius: 3px;\n  padding: 10px;\n  overflow-x: auto;\n  font-size: 0.875rem; }\n\n/* line 167, stdin */\nsvg {\n  width: 100%;\n  height: 100%; }\n\n/* line 172, stdin */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Tables */\n/* line 177, stdin */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch; }\n  /* line 192, stdin */\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5; }\n  /* line 198, stdin */\n  table tr:nth-child(2n) {\n    background-color: #f6f8fa; }\n  /* line 202, stdin */\n  table th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600; }\n\n/* line 210, stdin */\niframe,\namp-iframe,\n.fluid-width-video-wrapper {\n  margin-top: 30px; }\n\n/* line 217, stdin */\n.header {\n  position: relative;\n  width: 100%;\n  height: 50px;\n  line-height: 1; }\n\n/* line 229, stdin */\n.logo-link {\n  color: #fff;\n  font-size: 24px;\n  font-weight: 600; }\n\n/* line 238, stdin */\n.follow a {\n  margin: 0 5px;\n  width: 22px;\n  display: inline-block;\n  vertical-align: middle; }\n\n/* line 245, stdin */\n.follow svg {\n  fill: rgba(0, 0, 0, 0.8);\n  stroke: none; }\n\n/* line 251, stdin */\n.copyright {\n  font-size: 0.875rem; }\n  /* line 254, stdin */\n  .copyright a {\n    color: rgba(0, 0, 0, 0.7); }\n\n/* line 259, stdin */\n.article-meta {\n  color: #999;\n  margin: 10px 0;\n  font-size: 0.875rem; }\n  /* line 264, stdin */\n  .article-meta a {\n    font-weight: 600;\n    color: #222; }\n\n/* line 273, stdin */\n.sidebar {\n  width: 280px;\n  background: #fff; }\n  /* line 277, stdin */\n  .sidebar ul {\n    margin: 18px 0 20px; }\n  /* line 279, stdin */\n  .sidebar ul li a {\n    margin-bottom: 5px;\n    padding: 6px 20px; }\n  /* line 284, stdin */\n  .sidebar .follow {\n    padding: 20px;\n    border-top: 1px solid #ddd; }\n\n/* line 287, stdin */\n.close-sidebar {\n  height: 50px;\n  font-size: 25px;\n  line-height: 50px;\n  text-align: right;\n  padding-right: 20px;\n  color: #fff; }\n\n/* line 299, stdin */\n.main {\n  max-width: 600px;\n  margin: 0 auto; }\n\n/* line 304, stdin */\n.article {\n  padding: 25px 16px;\n  /* stylelint-disable */\n  /* stylelint-enable */ }\n  /* line 307, stdin */\n  .article-title {\n    line-height: 1.04;\n    margin-top: 0; }\n  /* line 309, stdin */\n  .article-excerpt {\n    margin-bottom: 20px;\n    margin-top: 10px;\n    color: #7d7d7d;\n    font-size: 1.125rem; }\n  /* line 317, stdin */\n  .article amp-img,\n  .article amp-anim {\n    position: relative;\n    left: 50%;\n    display: block;\n    padding: 0;\n    min-width: 0;\n    max-width: 112%;\n    width: calc(100% + 32px);\n    height: auto;\n    transform: translateX(-50%); }\n  /* line 331, stdin */\n  .article-tags {\n    padding: 30px 0 0;\n    /* stylelint-disable-next-line */ }\n    /* line 335, stdin */\n    .article-tags a {\n      background: rgba(0, 0, 0, 0.08);\n      border-radius: 3px;\n      color: rgba(0, 0, 0, 0.6);\n      display: inline-block;\n      font-size: 14px;\n      font-weight: 600;\n      height: 37px;\n      line-height: 35px;\n      margin: 0 8px 8px 0;\n      padding: 0 16px; }\n\n/* line 350, stdin */\n.article-body {\n  font-family: \"Merriweather\", serif;\n  line-height: 1.65em;\n  /* stylelint-disable-next-line */ }\n  /* line 355, stdin */\n  .article-body a {\n    text-decoration: underline; }\n  /* line 357, stdin */\n  .article-body ul,\n  .article-body ol {\n    counter-reset: post;\n    margin-top: 20px; }\n    /* line 362, stdin */\n    .article-body ul li,\n    .article-body ol li {\n      letter-spacing: -.003em;\n      margin: 5px;\n      margin-left: 30px;\n      position: relative; }\n      /* line 368, stdin */\n      .article-body ul li::before,\n      .article-body ol li::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -30px;\n        position: absolute;\n        text-align: right;\n        width: 30px; }\n  /* line 379, stdin */\n  .article-body ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px; }\n  /* line 385, stdin */\n  .article-body ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px; }\n  /* line 391, stdin */\n  .article-body .kg-embed-card,\n  .article-body pre {\n    margin-right: -16px;\n    margin-left: -16px; }\n\n/* line 399, stdin */\n.share {\n  margin: 15px 0 0; }\n\n/* line 403, stdin */\namp-social-share.custom-style {\n  background-color: #008080;\n  background-image: url(\"https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_white_48dp.png\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain; }\n\n/* line 411, stdin */\namp-social-share.rounded {\n  border-radius: 10%;\n  background-size: 85%; }\n\n/* line 420, stdin */\n.related {\n  padding-top: 20px;\n  padding-bottom: 20px;\n  margin-top: 30px;\n  background: #fafafa; }\n  /* line 426, stdin */\n  .related-title {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n    margin-bottom: 30px; }\n    /* line 430, stdin */\n    .related-title span {\n      border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n      color: rgba(0, 0, 0, 0.84);\n      display: inline-block;\n      font-size: 18px;\n      font-weight: 600;\n      padding-bottom: 20px; }\n\n/* line 443, stdin */\n.story-border {\n  border-left: 3px solid #CC116E;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  font-size: 36px;\n  font-weight: 600;\n  left: 0;\n  padding: 15px 10px 10px;\n  top: 0;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888; }\n\n/* line 458, stdin */\n.story:nth-child(3n) .story-border {\n  border-color: #f59e00; }\n\n/* line 459, stdin */\n.story:nth-child(3n+2) .story-border {\n  border-color: #26a8ed; }\n\n/* line 461, stdin */\n.story-link {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  min-height: 50px;\n  padding: 15px 15px 15px 55px; }\n\n/* line 469, stdin */\n.story-title {\n  line-height: 1.1;\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0; }\n\n/* line 479, stdin */\n.footer {\n  background-color: #fafafa;\n  color: rgba(0, 0, 0, 0.44);\n  font-weight: 600;\n  padding-top: 20px;\n  padding-bottom: 45px; }\n\n/* line 488, stdin */\n.hamburgermenu {\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n  margin-right: -15px; }\n  /* line 498, stdin */\n  .hamburgermenu span {\n    background-color: #fff;\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    width: 20px; }\n    /* line 508, stdin */\n    .hamburgermenu span:first-child {\n      transform: translate(0, -6px); }\n    /* line 509, stdin */\n    .hamburgermenu span:last-child {\n      transform: translate(0, 6px); }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMvYW1wLnNjc3MiLCJub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIDAxLiBWYXJpYWJsZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4kY29kZS1jb2xvcjojYzcyNTRlO1xuJGhlYWRlci1oZWlnaHQ6IDUwcHg7XG4kcHJpbWFyeS1jb2xvcjogIzFDOTk2MztcbiRwcmltYXJ5LWZvbnQ6ICdTb3VyY2UgU2FucyBQcm8nLCBzYW5zLXNlcmlmO1xuJHNlY3VuZGFyeS1mb250OiAgJ01lcnJpd2VhdGhlcicsIHNlcmlmOyAvLyBmb250IGZvciBjb250ZW50XG5cbi51LWJnQ29sb3IgeyBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpbWFyeS1jb2xvciB9XG5cbkBpbXBvcnQgXCJ+bm9ybWFsaXplLmNzcy9ub3JtYWxpemVcIjtcblxuLy8gMDIuIFV0aWxpdGllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi51LWZsZXhDZW50ZXIgeyBhbGlnbi1pdGVtczogY2VudGVyOyBkaXNwbGF5OiBmbGV4OyB9XG4udS1ibG9jayB7IGRpc3BsYXk6IGJsb2NrIH1cbi51LXJlbGF0aXZlIHsgcG9zaXRpb246IHJlbGF0aXZlIH1cbi51LW92ZXJmbG93SGlkZGVuIHsgb3ZlcmZsb3c6IGhpZGRlbiB9XG4udS1mb250U2l6ZVNtYWxsZXIgeyBmb250LXNpemU6IDE0cHggfVxuLnUtZmxleDEgeyBmbGV4OiAxIDEgYXV0byB9XG4udS1hYnNvbHV0ZSB7IHBvc2l0aW9uOiBhYnNvbHV0ZSB9XG4udS10ZXh0Q2VudGVyIHsgdGV4dC1hbGlnbjogY2VudGVyIH1cblxuLnUtY29udGFpbmVyIHtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIG1hcmdpbi1yaWdodDogYXV0bztcbiAgcGFkZGluZy1sZWZ0OiAxNnB4O1xuICBwYWRkaW5nLXJpZ2h0OiAxNnB4O1xufVxuXG4udS10ZXh0Q29sb3JOb3JtYWwge1xuICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQ0KTtcbiAgZmlsbDogcmdiYSgwLCAwLCAwLCAwLjQ0KTtcbn1cblxuLy8gMDMuIEdsb2JhbFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmEge1xuICBjb2xvcjogaW5oZXJpdDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuXG4gICY6YWN0aXZlLFxuICAmOmhvdmVyIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG59XG5cbmJvZHkge1xuICBmb250LWZhbWlseTogJHByaW1hcnktZm9udDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAwO1xuICBsaW5lLWhlaWdodDogMS40ZW07XG4gIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XG4gIHRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7XG59XG5cbmJsb2NrcXVvdGUge1xuICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xuICBsZXR0ZXItc3BhY2luZzogLS4wMDNlbTtcbiAgbWFyZ2luLWxlZnQ6IC01cHg7XG4gIG1hcmdpbi1yaWdodDogMDtcbiAgcGFkZGluZy1ib3R0b206IDJweDtcbiAgcGFkZGluZy1sZWZ0OiAyMHB4O1xufVxuXG5maWd1cmUge1xuICBtYXJnaW46IDIwcHggMCAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG5maWdjYXB0aW9uIHtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjY4KTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtZmVhdHVyZS1zZXR0aW5nczogXCJsaWdhXCIgb24sIFwibG51bVwiIG9uO1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgbGVmdDogMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDA7XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIG91dGxpbmU6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB0b3A6IDA7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDI4ZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjE7XG4gIG1hcmdpbjogMjVweCAwIDA7XG59XG5cbmgxIHsgZm9udC1zaXplOiAycmVtIH1cbmgyIHsgZm9udC1zaXplOiAxLjc1cmVtIH1cbmgzIHsgZm9udC1zaXplOiAxLjVyZW0gfVxuaDQgeyBmb250LXNpemU6IDEuMzc1cmVtIH1cbmg1IHsgZm9udC1zaXplOiAxLjI1cmVtIH1cbmg2IHsgZm9udC1zaXplOiAxLjEyNXJlbSB9XG5cbmhyIHtcbiAgYm9yZGVyOiAwO1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luOiA1MHB4IGF1dG87XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIGhlaWdodDogMDtcblxuICAmOjpiZWZvcmUge1xuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC42KTtcbiAgICBjb250ZW50OiAnLi4uJztcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gICAgZm9udC1zaXplOiAyOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IC42ZW07XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRvcDogLTMwcHg7XG4gIH1cbn1cblxubWFyayB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDIxNSwgMjUzLCAyMTEsIDEpLCByZ2JhKDIxNSwgMjUzLCAyMTEsIDEpKTtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjgpO1xufVxuXG5wIHtcbiAgbWFyZ2luOiAyMHB4IDAgMCAwO1xufVxuXG5vbCwgdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBsaXN0LXN0eWxlLWltYWdlOiBub25lO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbnAgY29kZSB7XG4gIGJhY2tncm91bmQ6ICNFRkVGRUY7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgY29sb3I6ICRjb2RlLWNvbG9yO1xuICBwYWRkaW5nOiAxcHggNnB4O1xuICB0ZXh0LXNoYWRvdzogMCAxcHggI2ZmZjtcbn1cblxucHJlIHtcbiAgYmFja2dyb3VuZDogI0VGRUZFRjtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBwYWRkaW5nOiAxMHB4O1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBmb250LXNpemU6IDAuODc1cmVtO1xufVxuXG5zdmcge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG5zdmc6bm90KDpyb290KSB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi8qIFRhYmxlcyAqL1xudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiO1xuICBmb250LXNpemU6IDFyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIG1hcmdpbjogMjBweCAwIDA7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IGF1dG87XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcblxuICB0aCxcbiAgdGQge1xuICAgIHBhZGRpbmc6IDZweCAxM3B4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZmUyZTU7XG4gIH1cblxuICB0cjpudGgtY2hpbGQoMm4pIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmOGZhO1xuICB9XG5cbiAgdGgge1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjJweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIH1cbn1cblxuLy8gc3R5bGVsaW50LWRpc2FibGVcbmlmcmFtZSxcbmFtcC1pZnJhbWUsXG4uZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciB7IG1hcmdpbi10b3A6IDMwcHggfVxuLy8gc3R5bGVsaW50LWVuYWJsZVxuXG4vLyAwNC4gSGVhZGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmhlYWRlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxuXG4vLyAuYmxvZy10aXRsZSB7XG4vLyAgIGhlaWdodDogNTBweDtcbi8vICAgbGluZS1oZWlnaHQ6IDA7XG4vLyB9XG5cbi5sb2dvLWxpbmsge1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogNjAwO1xufVxuXG4vLyAxMCBGb2xsb3cgTUVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4uZm9sbG93IHtcbiAgYSB7XG4gICAgbWFyZ2luOiAwIDVweDtcbiAgICB3aWR0aDogMjJweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgfVxuXG4gIHN2ZyB7XG4gICAgZmlsbDogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICAgIHN0cm9rZTogbm9uZTtcbiAgfVxufVxuXG4uY29weXJpZ2h0IHtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcblxuICBhIHsgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjcpIH1cbn1cblxuLy8gMDYuIFBvc3QgTWV0YVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi5hcnRpY2xlLW1ldGEge1xuICBjb2xvcjogIzk5OTtcbiAgbWFyZ2luOiAxMHB4IDA7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG5cbiAgYSB7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBjb2xvcjogIzIyMjtcbiAgfVxufVxuXG4vLyAwNS4gU2lkZWJhclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLnNpZGViYXIge1xuICB3aWR0aDogMjgwcHg7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG5cbiAgdWwgeyBtYXJnaW46IDE4cHggMCAyMHB4IH1cblxuICB1bCBsaSBhIHtcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgcGFkZGluZzogNnB4IDIwcHg7XG4gIH1cblxuICAuZm9sbG93IHsgcGFkZGluZzogMjBweDsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZGQgfVxufVxuXG4uY2xvc2Utc2lkZWJhciB7XG4gIGhlaWdodDogJGhlYWRlci1oZWlnaHQ7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgbGluZS1oZWlnaHQ6ICRoZWFkZXItaGVpZ2h0O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgY29sb3I6ICNmZmY7XG59XG5cbi8vIDA3LiBBcnRpY2xlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4ubWFpbiB7XG4gIG1heC13aWR0aDogNjAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuXG4uYXJ0aWNsZSB7XG4gIHBhZGRpbmc6IDI1cHggMTZweDtcblxuICAmLXRpdGxlIHsgbGluZS1oZWlnaHQ6IDEuMDQ7IG1hcmdpbi10b3A6IDAgfVxuXG4gICYtZXhjZXJwdCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgIGNvbG9yOiAjN2Q3ZDdkO1xuICAgIGZvbnQtc2l6ZTogMS4xMjVyZW07XG4gIH1cblxuICAvKiBzdHlsZWxpbnQtZGlzYWJsZSAqL1xuICBhbXAtaW1nLFxuICBhbXAtYW5pbSB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1pbi13aWR0aDogMDtcbiAgICBtYXgtd2lkdGg6IDExMiU7XG4gICAgd2lkdGg6IGNhbGMoMTAwJSArIDMycHgpO1xuICAgIGhlaWdodDogYXV0bztcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG4gIH1cbiAgLyogc3R5bGVsaW50LWVuYWJsZSAqL1xuXG4gICYtdGFncyB7XG4gICAgcGFkZGluZzogMzBweCAwIDA7XG5cbiAgICAvKiBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgICBhIHtcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4wOCk7XG4gICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYpO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgIGhlaWdodDogMzdweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAzNXB4O1xuICAgICAgbWFyZ2luOiAwIDhweCA4cHggMDtcbiAgICAgIHBhZGRpbmc6IDAgMTZweDtcbiAgICB9XG4gIH1cbn1cblxuLmFydGljbGUtYm9keSB7XG4gIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gIGxpbmUtaGVpZ2h0OiAxLjY1ZW07XG5cbiAgLyogc3R5bGVsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4gIGEgeyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSB9XG5cbiAgdWwsXG4gIG9sIHtcbiAgICBjb3VudGVyLXJlc2V0OiBwb3N0O1xuICAgIG1hcmdpbi10b3A6IDIwcHg7XG5cbiAgICBsaSB7XG4gICAgICBsZXR0ZXItc3BhY2luZzogLS4wMDNlbTtcbiAgICAgIG1hcmdpbjogNXB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDMwcHg7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC0zMHB4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICB3aWR0aDogMzBweDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bCBsaTo6YmVmb3JlIHtcbiAgICBjb250ZW50OiAnXFwyMDIyJztcbiAgICBmb250LXNpemU6IDE2LjhweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxNXB4O1xuICB9XG5cbiAgb2wgbGk6OmJlZm9yZSB7XG4gICAgY29udGVudDogY291bnRlcihwb3N0KSBcIi5cIjtcbiAgICBjb3VudGVyLWluY3JlbWVudDogcG9zdDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMnB4O1xuICB9XG5cbiAgLmtnLWVtYmVkLWNhcmQsXG4gIHByZSB7XG4gICAgbWFyZ2luLXJpZ2h0OiAtMTZweDtcbiAgICBtYXJnaW4tbGVmdDogLTE2cHg7XG4gIH1cbn1cblxuLy8gc3R5bGVsaW50LWRpc2FibGVcbi5zaGFyZSB7XG4gIG1hcmdpbjogMTVweCAwIDA7XG59XG5cbmFtcC1zb2NpYWwtc2hhcmUuY3VzdG9tLXN0eWxlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwODA4MDtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZ29vZ2xlL21hdGVyaWFsLWRlc2lnbi1pY29ucy9tYXN0ZXIvc29jaWFsLzF4X3dlYi9pY19zaGFyZV93aGl0ZV80OGRwLnBuZycpO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcbn1cblxuYW1wLXNvY2lhbC1zaGFyZS5yb3VuZGVkIHtcbiAgYm9yZGVyLXJhZGl1czogMTAlO1xuICBiYWNrZ3JvdW5kLXNpemU6IDg1JTtcbn1cblxuLy8gc3R5bGVsaW50LWVuYWJsZVxuXG4vLyAwLjggQXJ0aWNsZSBSZWxhdGVkXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLnJlbGF0ZWQge1xuICBwYWRkaW5nLXRvcDogMjBweDtcbiAgcGFkZGluZy1ib3R0b206IDIwcHg7XG4gIG1hcmdpbi10b3A6IDMwcHg7XG4gIGJhY2tncm91bmQ6ICNmYWZhZmE7XG5cbiAgJi10aXRsZSB7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjE1KTtcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuXG4gICAgc3BhbiB7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAuNTQpO1xuICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjg0KTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcbiAgICB9XG4gIH1cbn1cblxuLnN0b3J5IHtcbiAgLy8gcGFkZGluZy1ib3R0b206IDJweDtcbiAgJi1ib3JkZXIge1xuICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgI0NDMTE2RTtcbiAgICBib3R0b206IDA7XG4gICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgLjIpO1xuICAgIGZvbnQtZmFtaWx5OiAkc2VjdW5kYXJ5LWZvbnQ7XG4gICAgZm9udC1zaXplOiAzNnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbGVmdDogMDtcbiAgICBwYWRkaW5nOiAxNXB4IDEwcHggMTBweDtcbiAgICB0b3A6IDA7XG4gICAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDEuNXB4O1xuICAgIC13ZWJraXQtdGV4dC1zdHJva2UtY29sb3I6ICM4ODg7XG4gIH1cblxuICAmOm50aC1jaGlsZCgzbikgeyAuc3RvcnktYm9yZGVyIHsgYm9yZGVyLWNvbG9yOiBkYXJrZW4ob3JhbmdlLCAyJSk7IH0gfVxuICAmOm50aC1jaGlsZCgzbisyKSB7IC5zdG9yeS1ib3JkZXIgeyBib3JkZXItY29sb3I6ICMyNmE4ZWQgfSB9XG5cbiAgJi1saW5rIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4wOCk7XG4gICAgYm94LXNoYWRvdzogMCAxcHggN3B4IHJnYmEoMCwgMCwgMCwgLjA1KTtcbiAgICBtaW4taGVpZ2h0OiA1MHB4O1xuICAgIHBhZGRpbmc6IDE1cHggMTVweCAxNXB4IDU1cHg7XG4gIH1cblxuICAmLXRpdGxlIHtcbiAgICBsaW5lLWhlaWdodDogMS4xO1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIG1hcmdpbjogMDtcbiAgfVxufVxuXG4vLyAwLjkgRm9vdGVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLmZvb3RlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIC40NCk7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xuICBwYWRkaW5nLWJvdHRvbTogNDVweDtcbn1cblxuLy8gQnRuIG1lbnVcbi5oYW1idXJnZXJtZW51IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiA0OHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNHM7XG4gIHdpZHRoOiA0OHB4O1xuICBtYXJnaW4tcmlnaHQ6IC0xNXB4O1xuXG4gIHNwYW4ge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgaGVpZ2h0OiAycHg7XG4gICAgbGVmdDogMTRweDtcbiAgICBtYXJnaW4tdG9wOiAtMXB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDUwJTtcbiAgICB3aWR0aDogMjBweDtcblxuICAgICY6Zmlyc3QtY2hpbGQgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtNnB4KTsgfVxuICAgICY6bGFzdC1jaGlsZCB7IHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDZweCk7IH1cbiAgfVxufVxuIiwiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4wIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQSxBQUFBLFVBQVUsQ0FBQztFQUFFLGdCQUFnQixFQUpiLE9BQU8sR0FJeUI7O0FDUmhELDRFQUE0RTtBQUU1RTtnRkFDZ0Y7QUFFaEY7OztHQUdHOztBQUVILEFBQUEsSUFBSSxDQUFDO0VBQ0gsV0FBVyxFQUFFLElBQUk7RUFBRSxPQUFPO0VBQzFCLHdCQUF3QixFQUFFLElBQUk7RUFBRSxPQUFPLEVBQ3hDOztBQUVEO2dGQUNnRjtBQUVoRjs7R0FFRzs7QUFFSCxBQUFBLElBQUksQ0FBQztFQUNILE1BQU0sRUFBRSxDQUFDLEdBQ1Y7O0FBRUQ7OztHQUdHOztBQUVILEFBQUEsRUFBRSxDQUFDO0VBQ0QsU0FBUyxFQUFFLEdBQUc7RUFDZCxNQUFNLEVBQUUsUUFBUSxHQUNqQjs7QUFFRDtnRkFDZ0Y7QUFFaEY7OztHQUdHOztBQUVILEFBQUEsRUFBRSxDQUFDO0VBQ0QsVUFBVSxFQUFFLFdBQVc7RUFBRSxPQUFPO0VBQ2hDLE1BQU0sRUFBRSxDQUFDO0VBQUUsT0FB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 */","// 01. Variables\n// ==========================================================================\n$code-color:#c7254e;\n$header-height: 50px;\n$primary-color: #1C9963;\n$primary-font: 'Source Sans Pro', sans-serif;\n$secundary-font:  'Merriweather', serif; // font for content\n\n.u-bgColor { background-color: $primary-color }\n\n@import \"~normalize.css/normalize\";\n\n// 02. Utilities\n// ==========================================================================\n.u-flexCenter { align-items: center; display: flex; }\n.u-block { display: block }\n.u-relative { position: relative }\n.u-overflowHidden { overflow: hidden }\n.u-fontSizeSmaller { font-size: 14px }\n.u-flex1 { flex: 1 1 auto }\n.u-absolute { position: absolute }\n.u-textCenter { text-align: center }\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n.u-textColorNormal {\n  color: rgba(0, 0, 0, 0.44);\n  fill: rgba(0, 0, 0, 0.44);\n}\n\n// 03. Global\n// ==========================================================================\n\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n\n  &:active,\n  &:hover {\n    outline: 0;\n  }\n}\n\nbody {\n  font-family: $primary-font;\n  font-size: 1rem;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4em;\n  text-rendering: optimizeLegibility;\n  text-size-adjust: 100%;\n}\n\nblockquote {\n  border-left: 3px solid rgba(0, 0, 0, 0.8);\n  font-style: italic;\n  letter-spacing: -.003em;\n  margin-left: -5px;\n  margin-right: 0;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\nfigure {\n  margin: 20px 0 0;\n  padding: 0;\n}\n\nfigcaption {\n  color: rgba(0, 0, 0, .68);\n  display: block;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: $primary-font;\n  font-style: normal;\n  font-weight: 600;\n  letter-spacing: -.028em;\n  line-height: 1.1;\n  margin: 25px 0 0;\n}\n\nh1 { font-size: 2rem }\nh2 { font-size: 1.75rem }\nh3 { font-size: 1.5rem }\nh4 { font-size: 1.375rem }\nh5 { font-size: 1.25rem }\nh6 { font-size: 1.125rem }\n\nhr {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n  overflow: visible;\n  height: 0;\n\n  &::before {\n    color: rgba(0, 0, 0, .6);\n    content: '...';\n    display: inline-block;\n    font-family: $primary-font;\n    font-size: 28px;\n    font-weight: 400;\n    letter-spacing: .6em;\n    position: relative;\n    top: -30px;\n  }\n}\n\nmark {\n  background-color: transparent;\n  background-image: linear-gradient(to bottom, rgba(215, 253, 211, 1), rgba(215, 253, 211, 1));\n  color: rgba(0, 0, 0, .8);\n}\n\np {\n  margin: 20px 0 0 0;\n}\n\nol, ul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\np code {\n  background: #EFEFEF;\n  border-radius: 2px;\n  color: $code-color;\n  padding: 1px 6px;\n  text-shadow: 0 1px #fff;\n}\n\npre {\n  background: #EFEFEF;\n  border-radius: 3px;\n  padding: 10px;\n  overflow-x: auto;\n  font-size: 0.875rem;\n}\n\nsvg {\n  width: 100%;\n  height: 100%;\n}\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tables */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n\n  th,\n  td {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5;\n  }\n\n  tr:nth-child(2n) {\n    background-color: #f6f8fa;\n  }\n\n  th {\n    letter-spacing: 0.2px;\n    text-transform: uppercase;\n    font-weight: 600;\n  }\n}\n\n// stylelint-disable\niframe,\namp-iframe,\n.fluid-width-video-wrapper { margin-top: 30px }\n// stylelint-enable\n\n// 04. Header\n// ==========================================================================\n.header {\n  position: relative;\n  width: 100%;\n  height: $header-height;\n  line-height: 1;\n}\n\n// .blog-title {\n//   height: 50px;\n//   line-height: 0;\n// }\n\n.logo-link {\n  color: #fff;\n  font-size: 24px;\n  font-weight: 600;\n}\n\n// 10 Follow ME\n// ==========================================================================\n.follow {\n  a {\n    margin: 0 5px;\n    width: 22px;\n    display: inline-block;\n    vertical-align: middle;\n  }\n\n  svg {\n    fill: rgba(0, 0, 0, 0.8);\n    stroke: none;\n  }\n}\n\n.copyright {\n  font-size: 0.875rem;\n\n  a { color: rgba(0, 0, 0, .7) }\n}\n\n// 06. Post Meta\n// ==========================================================================\n.article-meta {\n  color: #999;\n  margin: 10px 0;\n  font-size: 0.875rem;\n\n  a {\n    font-weight: 600;\n    color: #222;\n  }\n}\n\n// 05. Sidebar\n// ==========================================================================\n\n.sidebar {\n  width: 280px;\n  background: #fff;\n\n  ul { margin: 18px 0 20px }\n\n  ul li a {\n    margin-bottom: 5px;\n    padding: 6px 20px;\n  }\n\n  .follow { padding: 20px; border-top: 1px solid #ddd }\n}\n\n.close-sidebar {\n  height: $header-height;\n  font-size: 25px;\n  line-height: $header-height;\n  text-align: right;\n  padding-right: 20px;\n  color: #fff;\n}\n\n// 07. Article\n// ==========================================================================\n\n.main {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.article {\n  padding: 25px 16px;\n\n  &-title { line-height: 1.04; margin-top: 0 }\n\n  &-excerpt {\n    margin-bottom: 20px;\n    margin-top: 10px;\n    color: #7d7d7d;\n    font-size: 1.125rem;\n  }\n\n  /* stylelint-disable */\n  amp-img,\n  amp-anim {\n    position: relative;\n    left: 50%;\n    display: block;\n    padding: 0;\n    min-width: 0;\n    max-width: 112%;\n    width: calc(100% + 32px);\n    height: auto;\n    transform: translateX(-50%);\n  }\n  /* stylelint-enable */\n\n  &-tags {\n    padding: 30px 0 0;\n\n    /* stylelint-disable-next-line */\n    a {\n      background: rgba(0, 0, 0, 0.08);\n      border-radius: 3px;\n      color: rgba(0, 0, 0, 0.6);\n      display: inline-block;\n      font-size: 14px;\n      font-weight: 600;\n      height: 37px;\n      line-height: 35px;\n      margin: 0 8px 8px 0;\n      padding: 0 16px;\n    }\n  }\n}\n\n.article-body {\n  font-family: $secundary-font;\n  line-height: 1.65em;\n\n  /* stylelint-disable-next-line */\n  a { text-decoration: underline }\n\n  ul,\n  ol {\n    counter-reset: post;\n    margin-top: 20px;\n\n    li {\n      letter-spacing: -.003em;\n      margin: 5px;\n      margin-left: 30px;\n      position: relative;\n\n      &::before {\n        box-sizing: border-box;\n        display: inline-block;\n        margin-left: -30px;\n        position: absolute;\n        text-align: right;\n        width: 30px;\n      }\n    }\n  }\n\n  ul li::before {\n    content: '\\2022';\n    font-size: 16.8px;\n    padding-right: 15px;\n  }\n\n  ol li::before {\n    content: counter(post) \".\";\n    counter-increment: post;\n    padding-right: 12px;\n  }\n\n  .kg-embed-card,\n  pre {\n    margin-right: -16px;\n    margin-left: -16px;\n  }\n}\n\n// stylelint-disable\n.share {\n  margin: 15px 0 0;\n}\n\namp-social-share.custom-style {\n  background-color: #008080;\n  background-image: url('https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_white_48dp.png');\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n}\n\namp-social-share.rounded {\n  border-radius: 10%;\n  background-size: 85%;\n}\n\n// stylelint-enable\n\n// 0.8 Article Related\n// ==========================================================================\n.related {\n  padding-top: 20px;\n  padding-bottom: 20px;\n  margin-top: 30px;\n  background: #fafafa;\n\n  &-title {\n    border-bottom: 1px solid rgba(0, 0, 0, .15);\n    margin-bottom: 30px;\n\n    span {\n      border-bottom: 1px solid rgba(0, 0, 0, .54);\n      color: rgba(0, 0, 0, .84);\n      display: inline-block;\n      font-size: 18px;\n      font-weight: 600;\n      padding-bottom: 20px;\n    }\n  }\n}\n\n.story {\n  // padding-bottom: 2px;\n  &-border {\n    border-left: 3px solid #CC116E;\n    bottom: 0;\n    color: rgba(0, 0, 0, .2);\n    font-family: $secundary-font;\n    font-size: 36px;\n    font-weight: 600;\n    left: 0;\n    padding: 15px 10px 10px;\n    top: 0;\n    -webkit-text-fill-color: transparent;\n    -webkit-text-stroke-width: 1.5px;\n    -webkit-text-stroke-color: #888;\n  }\n\n  &:nth-child(3n) { .story-border { border-color: darken(orange, 2%); } }\n  &:nth-child(3n+2) { .story-border { border-color: #26a8ed } }\n\n  &-link {\n    background-color: #fff;\n    border-bottom: 1px solid rgba(0, 0, 0, .08);\n    box-shadow: 0 1px 7px rgba(0, 0, 0, .05);\n    min-height: 50px;\n    padding: 15px 15px 15px 55px;\n  }\n\n  &-title {\n    line-height: 1.1;\n    font-size: 18px;\n    font-weight: 400;\n    margin: 0;\n  }\n}\n\n// 0.9 Footer\n// ==========================================================================\n.footer {\n  background-color: #fafafa;\n  color: rgba(0, 0, 0, .44);\n  font-weight: 600;\n  padding-top: 20px;\n  padding-bottom: 45px;\n}\n\n// Btn menu\n.hamburgermenu {\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n  margin-right: -15px;\n\n  span {\n    background-color: #fff;\n    display: block;\n    height: 2px;\n    left: 14px;\n    margin-top: -1px;\n    position: absolute;\n    top: 50%;\n    width: 20px;\n\n    &:first-child { transform: translate(0, -6px); }\n    &:last-child { transform: translate(0, 6px); }\n  }\n}\n","/* line 9, stdin */\n\n.u-bgColor {\n  background-color: #1C9963;\n}\n\n/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n/* line 11, node_modules/normalize.css/normalize.css */\n\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\n/* line 23, node_modules/normalize.css/normalize.css */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* line 32, node_modules/normalize.css/normalize.css */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/* line 45, node_modules/normalize.css/normalize.css */\n\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 56, node_modules/normalize.css/normalize.css */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\n/* line 68, node_modules/normalize.css/normalize.css */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/* line 77, node_modules/normalize.css/normalize.css */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/* line 87, node_modules/normalize.css/normalize.css */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* line 97, node_modules/normalize.css/normalize.css */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/* line 108, node_modules/normalize.css/normalize.css */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* line 117, node_modules/normalize.css/normalize.css */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\n/* line 125, node_modules/normalize.css/normalize.css */\n\nsub {\n  bottom: -0.25em;\n}\n\n/* line 129, node_modules/normalize.css/normalize.css */\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* line 140, node_modules/normalize.css/normalize.css */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\n/* line 152, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\n/* line 168, node_modules/normalize.css/normalize.css */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\n/* line 178, node_modules/normalize.css/normalize.css */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\n/* line 187, node_modules/normalize.css/normalize.css */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\n/* line 198, node_modules/normalize.css/normalize.css */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\n/* line 210, node_modules/normalize.css/normalize.css */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/* line 221, node_modules/normalize.css/normalize.css */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/* line 232, node_modules/normalize.css/normalize.css */\n\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/* line 245, node_modules/normalize.css/normalize.css */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/* line 253, node_modules/normalize.css/normalize.css */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n/* line 262, node_modules/normalize.css/normalize.css */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n/* line 272, node_modules/normalize.css/normalize.css */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n/* line 282, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n/* line 291, node_modules/normalize.css/normalize.css */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n/* line 300, node_modules/normalize.css/normalize.css */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/* line 312, node_modules/normalize.css/normalize.css */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* line 320, node_modules/normalize.css/normalize.css */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/* line 331, node_modules/normalize.css/normalize.css */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n/* line 339, node_modules/normalize.css/normalize.css */\n\n[hidden] {\n  display: none;\n}\n\n/* line 15, stdin */\n\n.u-flexCenter {\n  align-items: center;\n  display: flex;\n}\n\n/* line 16, stdin */\n\n.u-block {\n  display: block;\n}\n\n/* line 17, stdin */\n\n.u-relative {\n  position: relative;\n}\n\n/* line 18, stdin */\n\n.u-overflowHidden {\n  overflow: hidden;\n}\n\n/* line 19, stdin */\n\n.u-fontSizeSmaller {\n  font-size: 14px;\n}\n\n/* line 20, stdin */\n\n.u-flex1 {\n  flex: 1 1 auto;\n}\n\n/* line 21, stdin */\n\n.u-absolute {\n  position: absolute;\n}\n\n/* line 22, stdin */\n\n.u-textCenter {\n  text-align: center;\n}\n\n/* line 24, stdin */\n\n.u-container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 16px;\n  padding-right: 16px;\n}\n\n/* line 31, stdin */\n\n.u-textColorNormal {\n  color: rgba(0, 0, 0, 0.44);\n  fill: rgba(0, 0, 0, 0.44);\n}\n\n/* line 39, stdin */\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* line 43, stdin */\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* line 47, stdin */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* line 53, stdin */\n\nbody {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 1rem;\n  font-style: normal;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 1.4em;\n  text-rendering: optimizeLegibility;\n  text-size-adjust: 100%;\n}\n\n/* line 64, stdin */\n\nblockquote {\n  border-left: 3px solid rgba(0, 0, 0, 0.8);\n  font-style: italic;\n  letter-spacing: -.003em;\n  margin-left: -5px;\n  margin-right: 0;\n  padding-bottom: 2px;\n  padding-left: 20px;\n}\n\n/* line 74, stdin */\n\nfigure {\n  margin: 20px 0 0;\n  padding: 0;\n}\n\n/* line 79, stdin */\n\nfigcaption {\n  color: rgba(0, 0, 0, 0.68);\n  display: block;\n  font-feature-settings: \"liga\" on, \"lnum\" on;\n  font-size: 14px;\n  font-style: normal;\n  font-weight: 400;\n  left: 0;\n  letter-spacing: 0;\n  line-height: 1.4;\n  margin-top: 10px;\n  outline: 0;\n  position: relative;\n  text-align: center;\n  top: 0;\n  width: 100%;\n}\n\n/* line 97, stdin */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-style: normal;\n  font-weight: 600;\n  letter-spacing: -.028em;\n  line-height: 1.1;\n  margin: 25px 0 0;\n}\n\n/* line 106, stdin */\n\nh1 {\n  font-size: 2rem;\n}\n\n/* line 107, stdin */\n\nh2 {\n  font-size: 1.75rem;\n}\n\n/* line 108, stdin */\n\nh3 {\n  font-size: 1.5rem;\n}\n\n/* line 109, stdin */\n\nh4 {\n  font-size: 1.375rem;\n}\n\n/* line 110, stdin */\n\nh5 {\n  font-size: 1.25rem;\n}\n\n/* line 111, stdin */\n\nh6 {\n  font-size: 1.125rem;\n}\n\n/* line 113, stdin */\n\nhr {\n  border: 0;\n  display: block;\n  margin: 50px auto;\n  text-align: center;\n  overflow: visible;\n  height: 0;\n}\n\n/* line 121, stdin */\n\nhr::before {\n  color: rgba(0, 0, 0, 0.6);\n  content: '...';\n  display: inline-block;\n  font-family: \"Source Sans Pro\", sans-serif;\n  font-size: 28px;\n  font-weight: 400;\n  letter-spacing: .6em;\n  position: relative;\n  top: -30px;\n}\n\n/* line 134, stdin */\n\nmark {\n  background-color: transparent;\n  background-image: linear-gradient(to bottom, #d7fdd3, #d7fdd3);\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/* line 140, stdin */\n\np {\n  margin: 20px 0 0 0;\n}\n\n/* line 144, stdin */\n\nol,\nul {\n  list-style: none;\n  list-style-image: none;\n  margin: 0;\n  padding: 0;\n}\n\n/* line 151, stdin */\n\np code {\n  background: #EFEFEF;\n  border-radius: 2px;\n  color: #c7254e;\n  padding: 1px 6px;\n  text-shadow: 0 1px #fff;\n}\n\n/* line 159, stdin */\n\npre {\n  background: #EFEFEF;\n  border-radius: 3px;\n  padding: 10px;\n  overflow-x: auto;\n  font-size: 0.875rem;\n}\n\n/* line 167, stdin */\n\nsvg {\n  width: 100%;\n  height: 100%;\n}\n\n/* line 172, stdin */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tables */\n\n/* line 177, stdin */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 20px 0 0;\n  max-width: 100%;\n  overflow-x: auto;\n  vertical-align: top;\n  white-space: nowrap;\n  width: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n/* line 192, stdin */\n\ntable th,\ntable td {\n  padding: 6px 13px;\n  border: 1px solid #dfe2e5;\n}\n\n/* line 198, stdin */\n\ntable tr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\n/* line 202, stdin */\n\ntable th {\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n}\n\n/* line 210, stdin */\n\niframe,\namp-iframe,\n.fluid-width-video-wrapper {\n  margin-top: 30px;\n}\n\n/* line 217, stdin */\n\n.header {\n  position: relative;\n  width: 100%;\n  height: 50px;\n  line-height: 1;\n}\n\n/* line 229, stdin */\n\n.logo-link {\n  color: #fff;\n  font-size: 24px;\n  font-weight: 600;\n}\n\n/* line 238, stdin */\n\n.follow a {\n  margin: 0 5px;\n  width: 22px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n/* line 245, stdin */\n\n.follow svg {\n  fill: rgba(0, 0, 0, 0.8);\n  stroke: none;\n}\n\n/* line 251, stdin */\n\n.copyright {\n  font-size: 0.875rem;\n}\n\n/* line 254, stdin */\n\n.copyright a {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n/* line 259, stdin */\n\n.article-meta {\n  color: #999;\n  margin: 10px 0;\n  font-size: 0.875rem;\n}\n\n/* line 264, stdin */\n\n.article-meta a {\n  font-weight: 600;\n  color: #222;\n}\n\n/* line 273, stdin */\n\n.sidebar {\n  width: 280px;\n  background: #fff;\n}\n\n/* line 277, stdin */\n\n.sidebar ul {\n  margin: 18px 0 20px;\n}\n\n/* line 279, stdin */\n\n.sidebar ul li a {\n  margin-bottom: 5px;\n  padding: 6px 20px;\n}\n\n/* line 284, stdin */\n\n.sidebar .follow {\n  padding: 20px;\n  border-top: 1px solid #ddd;\n}\n\n/* line 287, stdin */\n\n.close-sidebar {\n  height: 50px;\n  font-size: 25px;\n  line-height: 50px;\n  text-align: right;\n  padding-right: 20px;\n  color: #fff;\n}\n\n/* line 299, stdin */\n\n.main {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n/* line 304, stdin */\n\n.article {\n  padding: 25px 16px;\n  /* stylelint-disable */\n  /* stylelint-enable */\n}\n\n/* line 307, stdin */\n\n.article-title {\n  line-height: 1.04;\n  margin-top: 0;\n}\n\n/* line 309, stdin */\n\n.article-excerpt {\n  margin-bottom: 20px;\n  margin-top: 10px;\n  color: #7d7d7d;\n  font-size: 1.125rem;\n}\n\n/* line 317, stdin */\n\n.article amp-img,\n.article amp-anim {\n  position: relative;\n  left: 50%;\n  display: block;\n  padding: 0;\n  min-width: 0;\n  max-width: 112%;\n  width: calc(100% + 32px);\n  height: auto;\n  transform: translateX(-50%);\n}\n\n/* line 331, stdin */\n\n.article-tags {\n  padding: 30px 0 0;\n  /* stylelint-disable-next-line */\n}\n\n/* line 335, stdin */\n\n.article-tags a {\n  background: rgba(0, 0, 0, 0.08);\n  border-radius: 3px;\n  color: rgba(0, 0, 0, 0.6);\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 600;\n  height: 37px;\n  line-height: 35px;\n  margin: 0 8px 8px 0;\n  padding: 0 16px;\n}\n\n/* line 350, stdin */\n\n.article-body {\n  font-family: \"Merriweather\", serif;\n  line-height: 1.65em;\n  /* stylelint-disable-next-line */\n}\n\n/* line 355, stdin */\n\n.article-body a {\n  text-decoration: underline;\n}\n\n/* line 357, stdin */\n\n.article-body ul,\n.article-body ol {\n  counter-reset: post;\n  margin-top: 20px;\n}\n\n/* line 362, stdin */\n\n.article-body ul li,\n.article-body ol li {\n  letter-spacing: -.003em;\n  margin: 5px;\n  margin-left: 30px;\n  position: relative;\n}\n\n/* line 368, stdin */\n\n.article-body ul li::before,\n.article-body ol li::before {\n  box-sizing: border-box;\n  display: inline-block;\n  margin-left: -30px;\n  position: absolute;\n  text-align: right;\n  width: 30px;\n}\n\n/* line 379, stdin */\n\n.article-body ul li::before {\n  content: '\\2022';\n  font-size: 16.8px;\n  padding-right: 15px;\n}\n\n/* line 385, stdin */\n\n.article-body ol li::before {\n  content: counter(post) \".\";\n  counter-increment: post;\n  padding-right: 12px;\n}\n\n/* line 391, stdin */\n\n.article-body .kg-embed-card,\n.article-body pre {\n  margin-right: -16px;\n  margin-left: -16px;\n}\n\n/* line 399, stdin */\n\n.share {\n  margin: 15px 0 0;\n}\n\n/* line 403, stdin */\n\namp-social-share.custom-style {\n  background-color: #008080;\n  background-image: url(\"https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_white_48dp.png\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n}\n\n/* line 411, stdin */\n\namp-social-share.rounded {\n  border-radius: 10%;\n  background-size: 85%;\n}\n\n/* line 420, stdin */\n\n.related {\n  padding-top: 20px;\n  padding-bottom: 20px;\n  margin-top: 30px;\n  background: #fafafa;\n}\n\n/* line 426, stdin */\n\n.related-title {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.15);\n  margin-bottom: 30px;\n}\n\n/* line 430, stdin */\n\n.related-title span {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.54);\n  color: rgba(0, 0, 0, 0.84);\n  display: inline-block;\n  font-size: 18px;\n  font-weight: 600;\n  padding-bottom: 20px;\n}\n\n/* line 443, stdin */\n\n.story-border {\n  border-left: 3px solid #CC116E;\n  bottom: 0;\n  color: rgba(0, 0, 0, 0.2);\n  font-family: \"Merriweather\", serif;\n  font-size: 36px;\n  font-weight: 600;\n  left: 0;\n  padding: 15px 10px 10px;\n  top: 0;\n  -webkit-text-fill-color: transparent;\n  -webkit-text-stroke-width: 1.5px;\n  -webkit-text-stroke-color: #888;\n}\n\n/* line 458, stdin */\n\n.story:nth-child(3n) .story-border {\n  border-color: #f59e00;\n}\n\n/* line 459, stdin */\n\n.story:nth-child(3n+2) .story-border {\n  border-color: #26a8ed;\n}\n\n/* line 461, stdin */\n\n.story-link {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);\n  min-height: 50px;\n  padding: 15px 15px 15px 55px;\n}\n\n/* line 469, stdin */\n\n.story-title {\n  line-height: 1.1;\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0;\n}\n\n/* line 479, stdin */\n\n.footer {\n  background-color: #fafafa;\n  color: rgba(0, 0, 0, 0.44);\n  font-weight: 600;\n  padding-top: 20px;\n  padding-bottom: 45px;\n}\n\n/* line 488, stdin */\n\n.hamburgermenu {\n  background-color: transparent;\n  border: none;\n  padding: 0;\n  height: 48px;\n  position: relative;\n  transition: transform .4s;\n  width: 48px;\n  margin-right: -15px;\n}\n\n/* line 498, stdin */\n\n.hamburgermenu span {\n  background-color: #fff;\n  display: block;\n  height: 2px;\n  left: 14px;\n  margin-top: -1px;\n  position: absolute;\n  top: 50%;\n  width: 20px;\n}\n\n/* line 508, stdin */\n\n.hamburgermenu span:first-child {\n  transform: translate(0, -6px);\n}\n\n/* line 509, stdin */\n\n.hamburgermenu span:last-child {\n  transform: translate(0, 6px);\n}\n\n","/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */
/*!**************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/amp.js ./styles/amp.scss ***!
  \**************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Smigol\projects\ghost\content\themes\mapache\src\build\util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/amp.js */54);
module.exports = __webpack_require__(/*! ./styles/amp.scss */55);


/***/ }),
/* 54 */
/*!************************!*\
  !*** ./scripts/amp.js ***!
  \************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

console.log('hola Mundo'); // eslint-disable-line


/***/ }),
/* 55 */
/*!*************************!*\
  !*** ./styles/amp.scss ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./amp.scss */ 20);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ 18)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./amp.scss */ 20, function() {
		var newContent = __webpack_require__(/*! !../../node_modules/cache-loader/dist/cjs.js!../../node_modules/css-loader??ref--4-3!../../node_modules/postcss-loader/lib??ref--4-4!../../node_modules/resolve-url-loader??ref--4-5!../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../node_modules/import-glob!./amp.scss */ 20);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);
//# sourceMappingURL=amp.js.map