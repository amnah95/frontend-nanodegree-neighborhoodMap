
// Gloabal Vars
var map;
var markers = [];

//Array of locatoins
var locations = [
	{
		title: 'Al-Masjid Al-Haram',
		wikiName: 'Great_Mosque_of_Mecca',
		position: {lat: 21.422871, lng: 39.825735},
	}, 
	{
		title: 'Ghar Hiraa',
		wikiName:'Hira',
		position: {lat: 21.45758, lng: 39.859276}
	},
	{
		title: 'Ghar Thowr',
		wikiName:'Jabal_Thawr',
		position: {lat: 21.377189, lng: 39.849756}
	}, 
	{
		title: 'Abraj Al Bait',
		wikiName: 'Abraj_Al_Baits',
		position: {lat: 21.418751, lng: 39.825556}
	}, 
	{
		title: 'Jabal ar-Rahmah',
		wikiName: 'Mount_Arafat', 
		position: {lat: 21.354809, lng: 39.983834}
	},
	{
		title: 'Makkah Haramain High Speed Railway Station',
		wikiName: 'Haramain_high-speed_rail_project',
		position: {lat: 21.417613, lng: 39.789312}
	}  
];


function intiMap () {

	//constructor creates a new map - only center and zoom are required
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 21.422871, lng: 39.825735},
		zoom: 12
	});

	var largeInfowindow = new google.maps.InfoWindow();

	for (var i = 0; i < locations.length; i++ ) {
		// Get places info
		var title = locations[i].title;
		var wikiName = locations[i].wikiName;
		var position = locations[i].position;
		// create place mark
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DORP,
			id: i
		}); 
		marker.setMap(map);
		markers.push(marker);
		//add click events
		marker.addListener('click', populateAndBounceMarker(marker));

		// extend the marker boundries
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(marker.position);
	};
	map.fitBounds(bounds);

	function createInfoWindow (marker, infoWindow) {	

		if (infoWindow.marker != marker ) {
			infoWindow.marker = marker;
			infoWindow.setContent ('<div> <h6> ' + marker.title + ' </h6> ' + 
				'<p> Find out more about this place</p><p id="wikipedia-links"></p></div>');
			loadData(marker);
			infoWindow.open(map, marker);
			// When closing the window
			infoWindow.addListener('colseclick', function() {
			infoWindow.setMarker(null);
			});
		};
	}


	//Wiki Link
	function loadData(marker) {
		var $wikiElem = $('#wikipedia-links');
		$wikiElem.text("");
		var search = marker.title;
		console.log (marker.wikiName);

		var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search&format=json&formatversion=2&callback=wikiCallback';
		
		$.ajax({
			url: wikiURL,
			dataType: "jsonp",
			success: function (response) {
				var url = 'https://en.wikipedia.org/wiki/'+ marker.wikiName ;
				$wikiElem.append ('<li><a href= "'+url+'">'+ marker.title +'</a></li>'); 
			}
		})
	}

	function populateAndBounceMarker (marker) {
		createInfoWindow(marker, largeInfowindow);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setAnimation(null);
	}

}



function viewModel() {

	var self = this;

	this.searchText = ko.observable("");

	intiMap();



	this.filter = ko.computed(function() {
        var filteredList = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchText()
                    .toLowerCase())) {
                filteredList.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return filteredList;
    }, this);
}


function runApp () {
	ko.applyBindings(new viewModel());
}   
