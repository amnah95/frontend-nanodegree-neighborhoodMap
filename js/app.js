// Glibal Vairables
var map;

var locations = [
	{
		title: 'Al-Masjid Al-Haram',
		wikiName: 'Great_Mosque_of_Mecca',
		location: {lat: 21.422871, lng: 39.825735},
	}, 
	{
		title: 'Ghar Hiraa',
		wikiName:'Hira',
		location: {lat: 21.45758, lng: 39.859276}
	},
	{
		title: 'Ghar Thowr',
		wikiName:'Jabal_Thawr',
		location: {lat: 21.377189, lng: 39.849756}
	}, 
	{
		title: 'Abraj Al Bait',
		wikiName: 'Abraj_Al_Baits',
		location: {lat: 21.418751, lng: 39.825556}
	}, 
	{
		title: 'Jabal ar-Rahmah',
		wikiName: 'Mount_Arafat', 
		location: {lat: 21.354809, lng: 39.983834}
	},
	{
		title: 'Makkah Haramain High Speed Railway Station',
		wikiName: 'Haramain_high-speed_rail_project',
		location: {lat: 21.417613, lng: 39.789312}
	}  
];

//Wiki info
function loadData (marker) {
	var $wikiElem = $('#wikipedia-links');
	$wikiElem.text("");
	var search = marker.title;
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=search&openSearch&format=json&formatversion=2&callback=wikiCallback';
	$.ajax({
		url: wikiURL,
		dataType: "jsonp",
		success: function (response) {
			var url = 'https://en.wikipedia.org/wiki/'+ marker.wikiName ;
			$wikiElem.append ('<li><a href= "'+url+'">'+ marker.title +'</a></li>'); 
		}
	});
}


function populateInfoswindow (marker, infoWindow) {	

	if (infoWindow.marker != marker ) {
		infoWindow.marker = marker;
		infoWindow.setContent ('<div> <h6> ' + marker.title + ' </h6> ' + 
				'<p> Find out more about this place</p><p id="wikipedia-links"></p></div>');
		infoWindow.open(map, marker);
		// When closing the window
		infoWindow.addListener('colseclick', function() {
		infoWindow.setMarker(null);
		})
	}

	loadData (marker);
}

function toggleBounce (marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	marker.setAnimation(null);
}



function viewModel () {

	var self = this;

	this.markers = [];
    this.searchText = ko.observable("");

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

	this.initMap = function() {
		//constructor creates a new map - only center and zoom are required
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 21.419528, lng: 39.739124},
			zoom: 14
		});

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
			this.markers.push (marker);
			// extend the marker boundries 
			bounds.extend(marker.position);
			// on click events
			marker.addListener('click', function() {
			toggleBounce(this);
			populateInfoswindow(this, largeInfowindow);
		});
		};

		map.fitBounds(bounds);
	}

	this.initMap();

	this.event = function() {
        toggleBounce(this);
        populateInfoswindow(this, largeInfowindow);
    };

	this.filteredList = ko.computed(function() {
        var newList = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchText()
                    .toLowerCase())) {
                newList.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return newList;
    }, this);
}


function runApp () {
	ko.applyBindings(new viewModel());
}  