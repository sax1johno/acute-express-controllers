var architect = require('architect'),
    path = require('path'),
    app,
    sutil = require('util'),
    async = require('async');
    
describe('utils', function() {
    before(function(done) {
        var configPath = path.join(__dirname, "testconfig.js");
        var config = architect.loadConfig(configPath);

        architect.createApp(config, function (err, arch) {
            if (err) {
                console.log("error was encountered", err);
                done(err);
            } else {
                // console.log(sutil.inspect(arch));
                app = arch;
                done();
            }
        });
    });
    describe("#add", function() {
        it("should add a controller to the controllers", function(done) {
            var serviceObject = app.getService("controllers");
            
            // Controllers are just files that export a router or app object.
            var router = serviceObject.Router();
            console.log("router = ", router);
            router.get("/", function(req, res, next) {
                console.log("This is the inside of the request");
                res.send({"success": ""});
            });
            // app.services.controllers.add(router, function(err, file) {
            serviceObject.add("/", router, function(err, file) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log("final file = ", file);
                    done();
                }
                // console.log(file);
                // done();
            });
        });
    });
    describe("#load", function() {
        it("should add a controller to the controllers", function(done) {
            var serviceObject = app.getService("controllers");
            serviceObject.load(app, function(err) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });
        });
    });
});
