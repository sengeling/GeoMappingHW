// Creating map object
const map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(map);

// Link to earthquake json (7-day all earthquakes)
const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function that will determine the color of the marker based on the magnitude of the earthquake
function getValue(mag) {
    return mag > 8 ?   "#581845":
           mag > 6.9 ? "#900C3F":
           mag > 6 ?   "#C70039":
           mag > 5.4 ? "#FF5733":
           mag > 2.5 ? "#FFC300":
                       "#DAF7A6";
};

// function that will define the style of the markers
function style(feature) {
    return {
        radius: feature.properties.mag * 4,
        fillColor: getValue(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    }
}

(async function(){

    // Grabbing our GeoJSON data.
    const data = await d3.json(link);

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        
        // changing markers to circles and passing in style
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        
        // calling tooltip on each feature
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><p> Magnitude:" + feature.properties.mag + "</p><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(map);


    // create the legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        const div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2.4, 5.4, 6, 6.9, 8],
        labels = [];

    // loop through the magnitudes and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

        return div;
    };

legend.addTo(map);
})()

