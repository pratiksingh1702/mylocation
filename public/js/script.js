const socket = io();

// Check if browser supports Geolocation
if (navigator.geolocation) {
   navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
     

      // Send updated location to the server
      socket.emit("userLocation", { latitude, longitude });

      console.log("Updated location sent:", latitude, longitude);
    },
    (error) => {
      console.error("Error getting location updates:", error);
    },
    {
      enableHighAccuracy: true,  // More precise location (uses GPS)
      maximumAge: 0,             // Do not use cached location
      timeout: 10000             // Timeout if location not found in 10 sec
    }
  );

  // Optional: stop watching when needed
  // navigator.geolocation.clearWatch(watchId);
} else {
  console.log("Geolocation is not supported by this browser.");
}

const map=L.map("map").setView([0, 0], 2); // Initialize map with a default view
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
   
    attribution: '© OpenStreetMap contributors'
}).addTo(map); // Add OpenStreetMap tiles

let markers={}; 


socket.on("reciveLocation", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 13); 
    // Center map on the new location
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update existing marker
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    }



  
});

socket.on("removeMarker", (data) => {
    const { id } = data;
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker from map
        delete markers[id]; // Delete marker reference
    }
});