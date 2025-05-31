
const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  console.log(Cord);
   let marker;
      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker(Cord).addTo(map)
      map.setView(Cord, 9);
      const circle = L.circle(Cord, {
        color: 'blue',           
        fillColor: '#30f3ff',    
        fillOpacity: 0.3,       
        radius: 3000           
      }).addTo(map);