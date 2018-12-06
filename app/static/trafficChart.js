var renderChart = function(data){
    console.log(data);
    $("#traffic-chart").remove();
    var sample = data;
    const margin = 80;
    const width = 1200 - 2 * margin;
    const height = 600 - 2 * margin;

    var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "traffic-chart");
    // const svg = d3.select('svg');
    // const svgContainer = d3.select('#container');

    

    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
      .range([height, 0])
      .domain(sample.map((s) => s.business))
      .padding(0.4)

    const yScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, 100]);

    const yScale1 = d3.scaleLinear()
      .range([0, width ])
      .domain([0, 10]);

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisBottom()
      .scale(yScale1)



    chart.append('g')
      .call(d3.axisBottom(yScale))
      .attr('transform', `translate(0,${height})`);

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
      .attr('transform', `translate(0,${height})`);

    const barGroups = chart.selectAll()
      .data(sample)
      .enter()
      .append('g')

    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (g) => xScale(g.business))
      .attr('x', (g) => yScale(0.5))
      .attr('width', (g) => yScale(g.value))
      .attr('height', xScale.bandwidth())
      // .on('mouseenter', function (actual, i) {
      //   d3.selectAll('.value')
      //     .attr('opacity', 0)

      //   d3.select(this)
      //     .transition()
      //     .duration(300)
      //     .attr('opacity', 0.6)
      //     .attr('x', (a) => xScale(a.language) - 5)
      //     .attr('height', xScale.bandwidth() + 10)

      //   const y = yScale(actual.value)

      //   line = chart.append('line')
      //     .attr('id', 'limit')
      //     .attr('x1', 0)
      //     .attr('y1', y)
      //     .attr('x2', width)
      //     .attr('y2', y)

      //   barGroups.append('text')
      //     .attr('class', 'divergence')
      //     .attr('y', (a) => xScale(a.language) + xScale.bandwidth() / 2)
      //     .attr('x', (a) => yScale(a.value) + 30)
      //     .attr('fill', 'white')
      //     .attr('text-anchor', 'middle')
      //     .text((a, idx) => {
      //       const divergence = (a.value - actual.value).toFixed(1)

      //       let text = ''
      //       if (divergence > 0) text += '+'
      //       text += `${divergence}%`

      //       return idx !== i ? text : '';
      //     })

      // })
      // .on('mouseleave', function () {
      //   d3.selectAll('.value')
      //     .attr('opacity', 1)

      //   d3.select(this)
      //     .transition()
      //     .duration(300)
      //     .attr('opacity', 1)
      //     .attr('y', (a) => xScale(a.language))
      //     .attr('height', xScale.bandwidth())

      //   chart.selectAll('#limit').remove()
      //   chart.selectAll('.divergence').remove()
      // })

    barGroups
      .append('text')
      .attr('class', 'value1')
      .attr('y', (a) => xScale(a.business) + xScale.bandwidth() / 2)
      .attr('x', (a) => yScale(a.value) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}`)

    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Business Category')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Customer Influx')

    chart.append('g')
      .attr('transform', `translate(0,0)`)
      .call(d3.axisLeft(xScale))
      .attr('text-anchor', 'left')
      .selectAll("text")
      .attr("transform", `translate(20,0)`);
  }


  export function changeData(timeRange){
    console.log(timeRange);
    $('#dropdownMenuButton').html(timeRange);
    getData_Traffic(timeRange);
  }


  export function getData_Traffic(timeRange){
    $("#traffic-chart").remove();
    $("#loading").show();
      $.ajax({
        url: '/getTraffic',
        data: {'time': timeRange},
        dataType: 'json',
        success: function( resp ) {
          renderChart(resp.data);
          $("#loading").hide();
        },
        error: function( req, status, err ) {
          console.log( 'something went wrong', status, err );
          $("#loading").hide();
        }
      });
  }
