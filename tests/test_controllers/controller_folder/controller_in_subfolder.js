/**
 * Each controller receives an injector and a router.  Injectors can be used to
 * request services from the app injector, and router is used to register 
 * routes on the app.  By default, the route for a controller follows its file
 * structure, with "controller/index.js" mapping to "/" and everything else
 * mapping to it's file name or folder name.
 * 
 * eg: controller/test.js would map to a route with the prefix of /test/:action
 * eg: controller/folder/file_name would map to a route with prefix of /folder/file_name/:action
 * You specify routes and middle-ware directly, and other plugins can apply
 * global or specific middleware to your controller (ie: anything in the /admin requires
 * admin authentication)
 * 
 * The export returns an object with the router and optional config. 
**/
module.exports = function(router, injector) {
   // ex: set up a main responding method.
   var index = function(req, res, next) {
       res.send({"success": "Made it happen"});
   }
   
   router.all("/", index);
   
   console.log("app = ", injector.getService('app'));
   
   return {
      router: router
      // mountPath: "/"
   };
};