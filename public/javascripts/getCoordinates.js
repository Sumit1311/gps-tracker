function updateCoordinates(){
	mapIntervalObject=setTimeout(function(){
		populateCoordinatesOnMap()
		.then(function(){
			updateCoordinates();
		})
		.catch(function(error){
			console.log("Error : ",error);
		})
		
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
			deferred.resolve(result);
		},
		error:function(xhr,status,error){
			deferred.reject(error);
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
