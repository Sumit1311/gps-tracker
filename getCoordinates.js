function updateCoordinates(){
	mapIntervalObject=setTimeout(function(){
		populateCoordinatesOnMap()
		.then(function(){
			updateCoordinates();
		});
		
	},REFRESH_INTERVAL);
}

function populateCoordinatesOnMap(){
	return getCoordinatesFromServer()
	.then(function(coordinates){
		setMarker(coordinates.lattitude,coordinates.longitude)
	});
};

function setMarker(lattitude,longitude){
	var myLatLng={"lat":lattitude,"lng":longitude};
	map.setCenter(myLatLng);
	marker.setPosition(myLatLng);
};

function getCoordinatesFromServer(){
	var deferred=Q.defer();
	$.ajax({
		url:"/getCoordinates",
		type:"GET",
		success:function(result,status,xhr){
			var r=JSON.parse(result);
			deferred.resolve(r);
		},
		error:function(xhr,status,error){
			console.log("error : ",error,status)
		}
	});
	return deferred.promise;
};

/*var infoWindow = new google.maps.InfoWindow({map: map});        
			console.log(JSON.stringify(pos));
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }*/
