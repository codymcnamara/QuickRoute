var map;
var end = new google.maps.LatLng(37.7856360, -122.3971190)
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var start;
var infowindow;
var markers;

function initialize() {

  var clickTime = new google.maps.LatLng(37.7856360, -122.3971190);

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var mapOptions = {
    center: clickTime,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  directionsDisplay.setMap(map);

  // there doesn't seem to be a way to get rid of just the last marker
  // rendered from directions so i think you have to use "suppressMarkers()"
  // on all of them and then render them individually with you're own custom
  // markers
  var clicktimeImage = {
    url: "clicktimelogo.gif",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(13, 18),
    scaledSize: new google.maps.Size(25, 25)
  }

  var clicktimeMarker = new google.maps.Marker({
    map: map,
    icon: clicktimeImage,
    title: "ClickTime",
    position: new google.maps.LatLng(37.7856360, -122.3971190)
  })
  markers = [];
  markers.push(clicktimeMarker);

  var waypoints = []

  infowindow = new google.maps.InfoWindow();

  var startInput = (document.getElementById('pac-input'));
  var waypointInput = (document.getElementById('waypoint'))

  var searchBox = new google.maps.places.SearchBox((startInput));
  var waypointSearchBox = new google.maps.places.SearchBox((waypointInput));


  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    var startLoc = places[0].geometry.location;
    start = new google.maps.LatLng(startLoc.k, startLoc.D)

    calcRoute(start, waypoints)

  });

  google.maps.event.addListener(waypointSearchBox, 'places_changed', function() {
    var places = waypointSearchBox.getPlaces();
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

  $("#transport-dropdown").change( function(){
    if(start){
      calcRoute(start, waypoints)
    }
  })

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
    waypointSearchBox.setBounds(bounds);
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
