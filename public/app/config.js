// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    components: "../../components",

    // Libraries
    jquery: "../../components/jquery/jquery.min.js",
    lodash: "../../components/lodash/lodash.min.js",
    backbone: "../../components/backbone/backbone-min.js",
    handlebars: "../../components/handlebars-1.0.0-rc.1.js"
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    // Handlebars has no dependencies.
    handlebars: {
      exports: "Handlebars"
    },

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"]
  }

});
