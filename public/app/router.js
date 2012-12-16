define([
  // Application.
  "app"
],

function(app) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "console": "console"
    },

    index: function() {
      var layout = app.useLayout("./app/templates/layouts/index");
    },

    console: function() {
      var layout = app.useLayout("./app/templates/layouts/console");
    }
  });

  return Router;

});
