let myId = null;
const markers = {};
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const socket = io();

socket.on("connect", () => {
  myId = socket.id;
});

// Draw all existing users on first connect
socket.on("allUsers", (users) => {
  for (const id in users) {
    const { latitude, longitude } = users[id];
    if (!markers[id]) {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  }
});

socket.on("reciveLocation", ({ id, latitude, longitude }) => {
  if (id === myId) {
    map.setView([latitude, longitude]);
  }

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("removeMarker", ({ id }) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// Start location tracking
window.onload=function(){if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("userLocation", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting location updates:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}}
