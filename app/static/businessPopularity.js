  var renderChart_BusinessPopularity = function(data){
    var sampleTemp = [];

    for(var i=0; i < data.length; i++){
        sampleTemp.push({'rating': data[i]['rating'], 'value': parseInt(data[i]['count'])});
    }
    var sample = sampleTemp;
    console.log(sample);

    const svg = d3.select('#svg2');
    const svgContainer = d3.select('#container2');
    
    const margin = 80;
    const width = 1200 - 2 * margin;
    const height = 600 - 2 * margin;

    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(sample.map((s) => s.rating))
      .padding(0.4)
    
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 70000]);

    var colors = [ "#078B7E", "#238F70", "#409463", "#787422", "#5C9955", "#B1921A", "#CEA116", "#DCA914", "#078B7E", "#787422"]
    var z = d3.scaleOrdinal()
        .range(colors);

    var tooltip = svg.append("g")
      .attr("class", "d3-tooltip")
      .style("display", "none");
        
    tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");// load the csv and create the chart

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisLeft()
      .scale(yScale)

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart.append('g')
      .call(d3.axisLeft(yScale));

    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )

    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      )

    const barGroups = chart.selectAll()
      .data(sample)
      .enter()
      .append('g')

    barGroups
      .append('rect')
      .attr('class', 'bar1')
      .attr('x', (g) => xScale(g.rating))
      .attr('y', (g) => yScale(g.value))
      .attr('height', (g) => height - yScale(g.value))
      .attr('width', xScale.bandwidth())
      .attr("fill", function(d,i) { return z(i%10); })
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value2')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a.rating) - 5)
          .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.value)

        var line = chart.append('line')
          .attr('id', 'limit2')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)

        barGroups.append('text')
          .attr('class', 'divergence2')
          .attr('x', (a) => xScale(a.rating) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.value) + 20)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            const divergence = (a.value - actual.value).toFixed(1)
            
            let text = ''
            if (divergence > 0) text += '+'
            text += `${divergence}%`

            return idx !== i ? text : '';
          })

      })
      .on('mouseleave', function () {
        d3.selectAll('.value2')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a.rating))
          .attr('width', xScale.bandwidth())

        chart.selectAll('#limit2').remove()
        chart.selectAll('.divergence2').remove()
      })

    barGroups 
      .append('text')
      .attr('class', 'value2')
      .attr('x', (a) => xScale(a.rating) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.value) + 20)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}`)
    
    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 3)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('# Businesses')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Businesses')   
}


export function getData_BusinesssPopularity(){
    $.ajax({
    url: '/getBusinessPopData',
    dataType: 'json',
    success: function( resp ) {
      renderChart_BusinessPopularity(resp.data);
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong', status, err );
    }
  });
}
