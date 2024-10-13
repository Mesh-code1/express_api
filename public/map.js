function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 }, // Default center coordinates
        zoom: 8,
    });
    const geocoder = new google.maps.Geocoder();
    
    // Set up an event listener for the "Find Centers" button
    document.getElementById('findCenters').addEventListener('click', () => {
        geocodeAddress(geocoder, map);
    });
}

// Geocode the entered address and place a marker on the map
function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById('address').value;
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            });
        } else {
            alert('Geocode was not successful: ' + status);
        }
    });
}