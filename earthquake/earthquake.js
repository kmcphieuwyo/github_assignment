var map = L.map('earthquakemap').setView([38, -95], 4);
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap =  L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);


var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
$.getJSON(earthquakeUrl, function(data) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      var mag = feature.properties.mag;
      var color =
        mag >= 5 ? '#d73027' :
        mag >= 4 ? '#fc8d59' :
        mag >= 3 ? '#fee08b' :
        mag >= 2 ? '#d9ef8b' :
        mag >= 1 ? '#91cf60' :
                   '#1a9850';
      var radius = mag === 0 ? 2 : mag * 4;
      return L.circleMarker(latlng, {
        radius: radius,
        fillColor: color,
        color: '#000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      var props = feature.properties;
      var popupContent =
        '<strong>Magnitude:</strong> ' + props.mag + '<br>' +
        '<strong>Location:</strong> ' + props.place + '<br>' +
        '<strong>Time:</strong> ' + new Date(props.time).toLocaleString();
      layer.bindPopup(popupContent);
    }
  }).addTo(map);

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    var magnitudes = [0, 1, 2, 3, 4, 5];
    div.innerHTML += '<strong>Magnitude</strong><br>';
    for (var i = 0; i < magnitudes.length; i++) {
      var from = magnitudes[i];
      var to = magnitudes[i + 1];
      var color =
        from >= 5 ? '#d73027' :
        from >= 4 ? '#fc8d59' :
        from >= 3 ? '#fee08b' :
        from >= 2 ? '#d9ef8b' :
        from >= 1 ? '#91cf60' :
                    '#1a9850';
      div.innerHTML +=
        '<span style="display: inline-block; width: 12px; height: 12px; margin-right: 6px; background:' +
        color +
        '; border: 1px solid #999; border-radius: 50%;"></span>' +
        from + (to ? '&ndash;' + to + '<br>' : '+');
    }
    div.innerHTML += '</div>';
    return div;
  };
  legend.addTo(map);
});