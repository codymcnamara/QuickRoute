var service;
var infowindow
var map;
var marker;
var end = new google.maps.LatLng(37.7856360, -122.3971190)
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {

  var sf = new google.maps.LatLng(37.7856360, -122.3971190);

  directionsDisplay = new google.maps.DirectionsRenderer();


  var mapOptions = {
    center: sf,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  directionsDisplay.setMap(map);

  var input = (document.getElementById('pac-input'));

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    var start = new google.maps.LatLng(places[0].geometry.location.k, places[0].geometry.location.D)

    calcRoute(start);

  });
}



function calcRoute(start) {
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}


google.maps.event.addDomListener(window, 'load', initialize);
