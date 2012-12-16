// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    components: "../../components",

    // Libraries
    jquery: "../../jquery/jquery.min",
    lodash: "../../lodash/lodash.min",
    backbone: "../../backbone/backbone-min",
    handlebars: "../../handlebars/handlebars-1.0.0-rc.1",
    layoutmanager: "../../layoutmanager/backbone.layoutmanager"
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
    layoutmanager: ["backbone"]
  }

});
