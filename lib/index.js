/**
 * acute-express-controllers walks the specified folder / file system for  all
 * of the application controllers.  Controllers return Routes and use the folder
 * names to determine the default route structure.  The folder-name convention
 * can be overridden by exporting a "mountPath" option from the controller.
 * 
 **/
var async = require('async'),
    path = require('path'),
    config,  // Default configuration
    acuteUtils,
    app,
    _ = require("underscore"),
    sutil = require('util'),
    q = require('q');
  
var DEFAULT_MOUNTPATH = "/";

var add = function(mountPath, router, fn) {
  console.log("loading router at ", mountPath);
  try {
    if (!mountPath) {
      mountPath = DEFAULT_MOUNTPATH;
    }
    app.app.use(mountPath, router);
    fn(null);
  } catch (e) {
    fn(e);
  }
};

/**
 * Load all of the controllers found in the specified controllers
 * directory.  Basedir is the base directory for the package that contains the controllers
 * and dirname is the directory that the controllers are contained in.
 **/
var loadFromFS = function(basedir, dirname, fn) {
  console.log("path = ", path.join(basedir, dirname));
    acuteUtils.walkFs(path.join(basedir, dirname), function(err, files) {
        if (err) {
          fn(err);
            // completeFn();
        } else {
          async.each(files, function(file, cb) {
            file = file.substr(0, file.lastIndexOf('.'));
            var controller = require(file)(app.Router());
            console.log("controller = ", controller);
            
            q.fcall(function() {
              if (_.isUndefined(controller.mountPath)) {
                var relPath = path.relative(path.join(basedir, dirname), file);
                var p = relPath.split(path.sep);
                p.pop();
                if (!_.isEmpty(p)) {
                  controller.mountPath = path.sep + p.join(path.sep);
                } else {
                  controller.mountPath = DEFAULT_MOUNTPATH;
                }
                return controller.mountPath;
              } else {
                return controller.mountPath;
              }
            }).then(function(mountPath) {
              add(mountPath, controller.router, function(err) {
                if(!err) {
                  cb();
                } else {
                  cb(err);
                }
              });
            })
          }, function(err) {
            if (err) {
              fn(err);
            } else {
              fn();
            }
          });
        }
    });
};

/**
 * Load the controllers from the configured location.
 **/
var load = function(fn) {
    loadFromFS(config.controller_basedir, config.controller_dirname, fn);
};

/**
 * @options is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */
module.exports = function setup(options, imports, register) {
    config = require('../config'),  // Default configuration
    acuteUtils = imports.utils,
    app = imports.app;
    
    // console.log("Inside of setup, router = ", app.router);
    if (options.controller_basedir) {
      config.controller_basedir = options.controller_basedir;
    }
    if (options.controller_dirname) {
      config.controller_dirname = options.controller_dirname;
    }
    
    load(function(err) {
      if (err) {
        register(err);
      } else {
        register(null, {
          controllers: {
            load: load,
            loadFromFS: loadFromFS,
            add: add,
            Router: app.Router
          }
        });
      }
    });
};