mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color:'red'})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h1>${place}</h1><p>Exact location will be provided after booking</p>`))           // listings.geometry.coordinates
    .addTo(map);

// console.log(coordinates);