TEN = {};

TEN.createLocation = function(organization) {
  console.log("Create Location");

  var form = {}
  form.id = $('#location_id').val();
  form.name = $('#location_name').val();
  form.organization = organization;

  if (!form.id || !form.name) {
    return alert("Invalid input");
  }

  $.ajax({
    type: "post",
    url: "/" + organization + "/locations",
    data: form
  }).done(function ( data ) {
    alert(JSON.stringify(data));
  });
};