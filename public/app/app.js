var Content = Backbone.LayoutView.extend({
  template: "#content"
});

// Create a new Layout with a sub view for content.
var main = new Backbone.Layout({
  template: "#main",

  // This will place the contents of the Content View into the main
  // Layout's <p></p>.
  views: {
    "p": new Content()
  }
});

// Attach the Layout to the main container.
main.$el.appendTo(".main");

// Render the Layout
main.render();