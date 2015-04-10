var service;
var infowindow
var map;

function initialize() {

  var sf = new google.maps.LatLng(37.7856360, -122.3971190);

  var mapOptions = {
    center: sf,
    zoom: 10
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var request = {
    location: sf,
    radius: '500',
    query: 'restaurant'
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  // service.textSearch(request, callback);
}





function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
};

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}



google.maps.event.addDomListener(window, 'load', initialize);
