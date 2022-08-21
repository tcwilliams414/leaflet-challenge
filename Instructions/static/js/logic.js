
// Add tile layer
var overlayMap = L.tileLayer(
     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
     {
       attribution:
         "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }
  );
  
  // Create initial map
  var myMap = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  
//   Add tile layer to the map
   overlayMap.addTo(myMap);
  

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data) {
  
    function styleTemplate(feature) {
      return {
        opacity: 1,
        fillColor: getColor(feature.properties.mag),
        radius: getRadius(feature.properties.mag),
        weight: 1,
        fillOpacity: 1
      };
    }
//   Create colors for magnitudes
   function getColor(magnitude) {
         switch(true) {
          case magnitude >= 7:
              return "skyblue";

         case magnitude >= 6:
            return "orange";

        case magnitude > 5:
            return "limegreen";

         case magnitude > 4:
            return "pink";

         case magnitude > 3:
             return "purple";

         default:
             return "yellow";
      }
     }
  

    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      if (magnitude === 5) {
        return 2;
      }
      return magnitude * 5;
    }
  
  
// Create GeoJSON layer 
    L.geoJson(data, {
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
// Include details such as magnitude and location on pop-up; add to myMap
      style: styleTemplate,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: "  + feature.properties.mag + " " + "Location: "+ feature.properties.place
        );
      }
    }).addTo(myMap);
  
//   Create Map Legend
     var legend = L.control({
      position: "bottomright"
     });
  
     legend.onAdd = function() {
       var div = L.DomUtil.create("div", "legend");
        var magnitudes = [3, 4, 5, 6, 7];
        var colors = [
        "skyblue",
        "orange",
        "limegreen",
        "pink",
        "purple",
        "yellow"
      ];
//   Create labels for legend
      for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(myMap)

 });


