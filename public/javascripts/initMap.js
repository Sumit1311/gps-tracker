     
function initMap() {
	var myLatLng={"lat":18.4444509,"lng":73.7985978}	  
	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 8,
    	center: myLatLng
	});

 	marker = new google.maps.Marker({
    	position: myLatLng,
	    map: map,
    	title: 'Coordinates '+myLatLng.lat+" - "+myLatLng.lng
  	});
	updateCoordinates();
}
