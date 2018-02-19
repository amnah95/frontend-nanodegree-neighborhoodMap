
var map;
var markers = [];

function initMap() {
	//constructor creates a new map - only center and zoom are required
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 21.419528, lng: 39.739124},
		zoom: 14
	});

	//Array of locatoins
	var locations = [
		{title: 'Al-Masjid Al-Haram', location: {lat: 21.422871, lng: 39.825735}}, 
		{title: 'Ghar Hiraa', location: {lat: 21.45758, lng: 39.859276}},
		{title: 'Ghar Thowr', location: {lat: 21.377189, lng: 39.849756}}, 
		{title: 'Al-Tanaim Mosque', location: {lat: 21.467468, lng: 39.801547}}, 
		{title: 'Jabal ar-Rahmah', location: {lat: 21.354809, lng: 39.983834}} 

	];

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();


	for (var i = 0; i < locations.length; i++ ) {
		// Get places info
		var position = locations[i].location;
		var title = locations[i].title;

		var marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		animation: google.maps.Animation.DORP,
		id: i
	}); 
		// Push the marker to the markers array
		markers.push (marker);
		// extend the marker boundries 
		bounds.extend(marker.position);
		// on clikc event
		marker.addListener('click', function() {
		populateInfosindow(this, largeInfowindow);
	});
	};

	map.fitBounds(bounds);

}


function populateInfosindow (marker, infoWindow) {	
	if (infoWindow.marker != marker ) {
		infoWindow.marker = marker;
		infoWindow.setContent ('<div>' + marker.title + '</div>');
		infoWindow.open(map, marker);
		// When closing the window
		infoWindow.addListener('colseclick', function() {
		infoWindow.setMarker(null);
		})
	}
}
