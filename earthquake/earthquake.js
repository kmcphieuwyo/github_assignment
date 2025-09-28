var map = L.map('earthquakemap').setView([38, -95], 4);
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap =  L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);


function getColor(mag) {
  return mag >= 5 ? '#d73027' :
         mag >= 4 ? '#fc8d59' :
         mag >= 3 ? '#fee08b' :
         mag >= 2 ? '#d9ef8b' :
         mag >= 1 ? '#91cf60' :
                    '#1a9850';
}

function getRadius(mag) {
  return mag === 0 ? 2 : mag * 4;
}

var earthquakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
$.getJSON(earthquakesUrl, function(data) {
     L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          color: '#000',
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        const { mag, place, time } = feature.properties;
        layer.bindPopup(`
          <strong>Magnitude:</strong> ${mag}<br/>
          <strong>Location:</strong> ${place}<br/>
          <strong>Time:</strong> ${new Date(time).toLocaleString()}
        `);
      }
    }).addTo(map);
  })
 

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'legend');
  var magnitudes = [0, 1, 2, 3, 4, 5];

  div.innerHTML += '<strong>Magnitude</strong><br>';

  for (var i = 0; i < magnitudes.length; i++) {
    var from = magnitudes[i];
    var to = magnitudes[i + 1];

    div.innerHTML +=
      '<span style="display: inline-block; width: 12px; height: 12px; margin-right: 6px; background:' +
      getColor(from) +
      '; border: 1px solid #999; border-radius: 50%;"></span>' +
      from + (to ? '&ndash;' + to + '<br>' : '+');
  }

  div.innerHTML += '</div>';
  return div;
};

legend.addTo(map);


