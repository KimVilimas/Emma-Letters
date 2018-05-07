const w = 1280,
    h = 800;

const projection = d3.geo.azimuthal()
    .mode("equidistant")
    .origin([-98, 38])
    .scale(3000)
    .translate([0, 660]);

const path = d3.geo.path()
    .projection(projection);

// const arc = d3.geo.greatArc()
//     .source(function (d) { return locationByAirport[d.source]; })
//     .target(function (d) { return locationByAirport[d.target]; });
    
const svg = d3.select("#map").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h);

const states = svg.append("svg:g")
    .attr("id", "states");

const circles = svg.append("svg:g")
    .attr("id", "circles");

const jcircles = svg.append("svg:g")
    .attr("id", "jcircles");

const positions = [],
    jpositions = []

d3.json("us-states.json", function (collection) {
    states.selectAll("path")
        .data(collection.features)
        .enter().append("svg:path")
        .attr("d", path);
});
let groups = {};
d3.csv("Joseph.csv", function (josephplaces) {
    // Get projections locations
    josephplaces = josephplaces.filter(function (place) {
        const location = [+place.Long, +place.Lat];
        jpositions.push(projection(location));
        return true;
    });

    groups = jcircles.selectAll("circle")
        .data(josephplaces)
        .enter()
        .append("svg:g")
        .attr("class", "josephgroups")
        .attr("transform", function (d, i) {
            d.x = jpositions[i][0];
            d.y = jpositions[i][1];
            return "translate(" + d.x + "," + d.y + ")";
        })

    groups.append("svg:circle")
        .attr("r", function (d, i) { return 13; })
        .attr("cx", "0")
        .attr("cy", "0")

    groups.append("svg:text")
        .attr("dy", "4")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(function (d, i) { return i + 1 })
});

d3.csv("Emma.csv", function (emmaplaces) {
    emmaplaces = emmaplaces.filter(function (airport) {
        const location = [+airport.Long, +airport.Lat];
        positions.push(projection(location));
        return true;
    });

    circles.selectAll("circle")
        .data(emmaplaces)
        .enter().append("svg:circle")
        .attr("cx", function (d, i) { return positions[i][0]; })
        .attr("cy", function (d, i) { return positions[i][1]; })
        .attr("r", function (d, i) { return 18; })
        .attr("data-type", "emma")
        .on("click", handleClick)
        // .append("svg:path")
        // .attr("class", "arc")
        // .attr("d", function(d) { return path(arc(d)); });
});
function handleClick(data, index) {
    groups.attr("class", "josephgroups").filter(function (josephdata, index) {
        return data.City === josephdata["Emma Hub"]
    }).attr("class", "josephgroups visible");
    event.stopPropagation();
}
document.body.addEventListener('click', function (item) {
    if (item.srcElement && item.srcElement.dataset && item.srcElement.type && item.srcElement.dataset.type === "emma") {
        // do nothing
    } else {
        groups.attr("class", "josephgroups");
    }
})