// Api related js
// var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=makkah&format=json&callback=wikiCallback';

// $.ajax ({
// 	url: wikiURL,
// 	dataType: "jsonp",
// 	sucess: function(response) {
// 		var
// 	}
// })


// Map related JS
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
		{title: 'Al-Masjid Al-Haram', wikiName: 'Great_Mosque_of_Mecca', location: {lat: 21.422871, lng: 39.825735}}, 
		{title: 'Ghar Hiraa', wikiName:'Hira', location: {lat: 21.45758, lng: 39.859276}},
		{title: 'Ghar Thowr', wikiName:'Jabal_Thawr', location: {lat: 21.377189, lng: 39.849756}}, 
		{title: 'Yalamlam Mosque', wikiName: 'Yalamlam', location: {lat: 20.840585, lng: 40.138874}}, 
		{title: 'Jabal ar-Rahmah', wikiName: 'Mount_Arafat', location: {lat: 21.354809, lng: 39.983834}} 

	];

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();


	for (var i = 0; i < locations.length; i++ ) {
		// Get places info
		var position = locations[i].location;
		var title = locations[i].title;
		var wikiName = locations[i].wikiName;

		var marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		wikiName: wikiName,
		animation: google.maps.Animation.DORP,
		id: i
	}); 
		// Push the marker to the markers array
		markers.push (marker);
		// extend the marker boundries 
		bounds.extend(marker.position);
		// on click events
		marker.addListener('click', function() {
		toggleBounce(this);
		// loadData();
		populateInfosindow(this, largeInfowindow);
		loadData (this);
	});
	};

	map.fitBounds(bounds);
}

function populateInfosindow (marker, infoWindow) {	
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setAnimation(null);
	}
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

function toggleBounce (marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setAnimation(null);
	}
}

//NYT
function loadData (marker) {
	var $wikiElem = $('#wikipedia-links');

	$wikiElem.text("");

	var search = marker.title;
	console.log (marker.wikiName);

	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+  +'&format=json&formatversion=2&callback=wikiCallback';
	
	$.ajax({
		url: wikiURL,
		dataType: "jsonp",
		success: function (response) {
			var url = 'https://en.wikipedia.org/wiki/'+ marker.wikiName ;
			$wikiElem.append ('<li><a href= "'+url+'">'+ marker.title +'</a></li>'); 
		}
	})
}
