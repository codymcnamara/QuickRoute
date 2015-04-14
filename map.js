var map;
var end = new google.maps.LatLng(37.7856360, -122.3971190)
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var start;
var infowindow;
var markers;

function initialize() {

  var sf = new google.maps.LatLng(37.7856360, -122.3971190);

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var mapOptions = {
    center: sf,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  directionsDisplay.setMap(map);

  var waypoints = []

  infowindow = new google.maps.InfoWindow();

  var input = (document.getElementById('pac-input'));
  var firstWaypoint = (document.getElementById('waypoint'))

  var searchBox = new google.maps.places.SearchBox((input));
  var firstWaypointSearchBox = new google.maps.places.SearchBox((firstWaypoint));


  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    var startLoc = places[0].geometry.location;
    start = new google.maps.LatLng(startLoc.k, startLoc.D)

    calcRoute(start, waypoints)

  });

  google.maps.event.addListener(firstWaypointSearchBox, 'places_changed', function() {
    var places = firstWaypointSearchBox.getPlaces();
    markers = [];

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      // infowindow for each marker
      google.maps.event.addListener(marker, 'click', function() {
        var infoContent = event.currentTarget.title + "\n" + "\n" + '<button type="button" id="add-stop">Add Stop</button>'

        infowindow.setContent(infoContent);
        infowindow.setPosition(this.position);
        infowindow.open(map);
      })

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }
  });

  $(document).on("click", '#add-stop', function(){
    if(waypoints.length < 3){
      waypoints.push({
        location: infowindow.position,
        stopover: true
      })

      if(start){
        calcRoute(start, waypoints)
      }

      deleteMarkers();
      infowindow.close();
      $("#waypoint").val("");
    } else {
      alert("You can't have more than 3 stops!")
    }
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
    firstWaypointSearchBox.setBounds(bounds);
  });
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function calcRoute(start, waypoints) {
  var request = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

  $("h2").css("visibility", "visible")
}


google.maps.event.addDomListener(window, 'load', initialize);
