// Assurez-vous que le DOM est complètement chargé avant de tenter de manipuler des éléments
document.addEventListener('DOMContentLoaded', function() {
  console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");

  if (typeof donneesGraphique !== 'undefined') {
    
    // Définir les dimensions et les marges du graphique
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Ajouter l'élément SVG au corps de la page
    var svg = d3.select("#graph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parsez les dates en un format utilisable par D3
    var parseDate = d3.timeParse("%Y-%m-%d");
    donneesGraphique.forEach(function(d) {
      d.date = parseDate(d.date);
      d.valeur = +d.valeur;
    });

    // Tri les données par date
    donneesGraphique.sort(function(a, b) {
      return a.date - b.date;
    });

    // Ajouter l'échelle de X
    var x = d3.scaleTime()
      .domain(d3.extent(donneesGraphique, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Ajouter l'échelle de Y
    var y = d3.scaleLinear()
      .domain([0, d3.max(donneesGraphique, function(d) { return +d.valeur; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Ajouter la ligne
    var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.valeur); });
    svg.append("path")
      .datum(donneesGraphique)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Ajouter les points
    svg.selectAll("dot")
      .data(donneesGraphique)
    .enter().append("circle")
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.valeur); })
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);
  }
});
