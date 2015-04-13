var map;
var end = new google.maps.LatLng(37.7856360, -122.3971190)
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var start;

function initialize() {

  var sf = new google.maps.LatLng(37.7856360, -122.3971190);

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var mapOptions = {
    center: sf,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  directionsDisplay.setMap(map);

  var waypoints = []

  var input = (document.getElementById('pac-input'));
  var firstWaypoint = (document.getElementById('first-waypoint'))

  var searchBox = new google.maps.places.SearchBox((input));
  var firstWaypointSearchBox = new google.maps.places.SearchBox((firstWaypoint));


  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    var startLoc = places[0].geometry.location;
    start = new google.maps.LatLng(places[0].geometry.location.k, places[0].geometry.location.D)

    // change the bounds so that it incorpartes space between start and end point

  });

  google.maps.event.addListener(firstWaypointSearchBox, 'places_changed', function() {
    var places = firstWaypointSearchBox.getPlaces();

    waypoints.push({
      location: new google.maps.LatLng(places[0].geometry.location.k, places[0].geometry.location.D),
      stopover: true
    })

  });

  var searchButton = document.getElementById('search-submit');

  searchButton.addEventListener("click", function(){
    // if(start){
      calcRoute(start, waypoints)
    // }
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}



function calcRoute(start, waypoints) {
  var request = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}


google.maps.event.addDomListener(window, 'load', initialize);
