// https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages
    const sample = [
      {
        language: 'Food',
        value: 98,
        color: '#000000'
      },
      {
        language: 'Clothing',
        value: 68,
        color: '#fbcb39'
      },
      {
        language: 'Beauty',
        value: 67,
        color: '#007bc8'
      },
      {
        language: 'Arts & Entertainment',
        value: 65,
        color: '#65cedb'
      },
      {
        language: 'Automobile',
        value: 55,
        color: '#00a2ee'
      },
      {
        language: 'Real Estate',
        value: 41,
        color: '#f9de3f'
      },
      {
        language: 'Pet Services',
        value: 34,
        color: '#ff6e52'
      },
      {
        language: 'Dry Cleaning',
        value: 30,
        color: '#5d2f8e'
      },
      {
        language: 'General Health',
        value: 21,
        color: '#008fc9'
      },
      {
        language: 'Dance Clubs',
        value: 11,
        color: '#507dca'
      }
    ];

    const margin = 80;
    const width = 1200 - 2 * margin;
    const height = 600 - 2 * margin;

    var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);
    // const svg = d3.select('svg');
    // const svgContainer = d3.select('#container');

    

    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
      .range([height, 0])
      .domain(sample.map((s) => s.language))
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
      .attr('y', (g) => xScale(g.language))
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
      .attr('class', 'value')
      .attr('y', (a) => xScale(a.language) + xScale.bandwidth() / 2)
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
      .text('Customer Influx')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Business Category')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Popularity of Businesses at various times')

    chart.append('g')
      .attr('transform', `translate(0,0)`)
      .call(d3.axisLeft(xScale))
      .attr('text-anchor', 'left')
      .selectAll("text")
      .attr("transform", `translate(20,0)`);

    // svg.append('text')
    //   .attr('class', 'source')
    //   .attr('x', width - margin / 2)
    //   .attr('y', height + margin * 1.7)
    //   .attr('text-anchor', 'start')
    //   .text('Source: Stack Overflow, 2018')

    // svgContainer.append(svg);

