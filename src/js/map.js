(function() {

    //Logical OR
    const lat = document.querySelector('#lat').value || 25.8727564;
    const lng = document.querySelector('#lng').value || -80.2939832;
    
    const map = L.map('map').setView([lat, lng ], 20);
    let marker;

    //Use provider and geocoder

    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Pin
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(map);

    //Detect the movement of the pin

    marker.on('moveend', function(event){
        marker = event.target;
        const position = marker.getLatLng();

        //Center the map on pin drop
        map.panTo(new L.LatLng(position.lat, position.lng));

        //Get street info on pin drop
        geocodeService.reverse().latlng(position, 13).run(function(error,result){
            
            //Show obtained full street address when clicking on the pin 
            marker.bindPopup(result.address.LongLabel);

            //Fill the inputs
            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';

        });


    });


})()