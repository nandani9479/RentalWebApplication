mapboxgl.accessToken = mapToken;                      
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",       
  center: listing.geometry.coordinates,               
  zoom: 7,  
  cooperativeGestures: true                                      
});

const marker = new mapboxgl.Marker({ color: "red" }) 
  .setLngLat(listing.geometry.coordinates)            
  .setPopup(new mapboxgl.Popup({ offset: 25 })
  .setHTML(`<h6>${listing.title}</h6><p><b>${listing.location}, ${listing.country}</b></p><p>Exact location will be provided after booking!</p>`)) 
  .addTo(map);

  

// ---------------- auto zoom animated transition--------------------------------
map.zoomTo(12, {
    duration: 8000,
    offset: [0, 0],
  });
  
  map.setMaxZoom(18.75);
  // map.scrollZoom.disable();
  
  // Add the control to the map.
  map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
  );
  
  map.addControl(new mapboxgl.FullscreenControl());
  
  // ----------------zoomin - zoomout button----------------------------------------
  let zoomin = () => {
    console.log("zoom in");
    console.log(map.getZoom());
    let zoomP = map.getZoom();
    if (zoomP < 18) {
      zoomP++;
    }
    map.zoomTo(zoomP);
  };
  let zoomout = () => {
    console.log("zoom out");
    console.log(map.getZoom());
    let zoomM = map.getZoom();
    if (zoomM > 0) {
      zoomM--;
    }
    map.zoomTo(zoomM);
  };
  