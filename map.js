var map;
var end = new google.maps.LatLng(37.7856360, -122.3971190)
var start;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var markers;
var startMarker;

function initialize() {

  var clickTime = new google.maps.LatLng(37.7856360, -122.3971190);

  var mapOptions = {
    center: clickTime,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  directionsDisplay.setMap(map);

  var infowindow = new google.maps.InfoWindow();

  createInitialMarker();

  var waypoints = [];

  var startInput = (document.getElementById('pac-input'));
  var waypointInput = (document.getElementById('waypoint'));

  var startSearchBox = new google.maps.places.SearchBox((startInput));
  var waypointSearchBox = new google.maps.places.SearchBox((waypointInput));

  // render directions when user picks starting point
  google.maps.event.addListener(startSearchBox, 'places_changed', function() {
    var places = startSearchBox.getPlaces();

    var startLoc = places[0].geometry.location;
    start = new google.maps.LatLng(startLoc.k, startLoc.D)

    calcRoute(start, waypoints)
    deleteMarkers();
  });

  // render markers for places search query
  google.maps.event.addListener(waypointSearchBox, 'places_changed', function() {
    var places = waypointSearchBox.getPlaces();

    if(markers[0] === startMarker){
      deleteMarkers();
    }

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
        anchor: new google.maps.Point(13, 18),
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

  // render new directions if user changes transportation method
  $("#transport-dropdown").change( function(){
    if(start){
      calcRoute(start, waypoints)
    }
  })

  // render new directions when user adds new stop
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
    startSearchBox.setBounds(bounds);
    waypointSearchBox.setBounds(bounds);
  });
}

function createInitialMarker() {
  startMarker = new google.maps.Marker({
    map: map,
    title: "ClickTime Office",
    position: new google.maps.LatLng(37.7856360, -122.3971190)
  })
  markers = [];
  markers.push(startMarker);
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

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function calcRoute(start, waypoints) {
  var travelMethod = $("#transport-dropdown option:selected").val()

  var request = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: eval("google.maps.TravelMode." + travelMethod)
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

  $("h2").css("visibility", "visible")
}

google.maps.event.addDomListener(window, 'load', initialize);
