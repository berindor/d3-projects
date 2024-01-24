import './TreemapDiagram.scss';
import React from 'react';
import * as d3 from 'd3';

class TreemapDiagramPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapType: 'VideoGame'
    };
    this.loadData = this.loadData.bind(this);
    this.drawPage = this.drawPage.bind(this);
  }

  async componentDidMount() {
    const { title, description, dataset } = await this.loadData();
    this.drawPage(title, description, dataset);
  }

  async loadData() {
    const data = {
      Kickstarter: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
        title: 'Kickstarter Pledges',
        description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
      },
      Movies: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
        title: 'Movie Sales',
        description: 'Top 100 Highest Grossing Movies Grouped By Genre'
      },
      VideoGame: {
        link: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
        title: 'Video Game Sales',
        description: 'Top 100 Most Sold Video Games Grouped by Platform'
      }
    };
    let { link, title, description } = data[this.state.mapType];
    const dataset = await fetch(link).then(response => response.json());
    this.setState({ link, title, description, dataset });
    return { title, description, dataset };
  }

  drawPage(title, description, dataset) {
    this.drawHeader(title, description);
    this.drawTreemap(dataset);
    this.drawLegend(dataset);
  }

  drawNavBar() {
    return (
      <div id="nav-bar">
        Chose dataset:
        <ul>
          <li>
            <button
              onClick={() => {
                this.setState({ mapType: 'VideoGame' });
                this.componentDidMount();
              }}
            >
              Video Game Data Set
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                this.setState({ mapType: 'Movies' });
                this.componentDidMount();
              }}
            >
              Movies Data Set
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                this.setState({ mapType: 'Kickstarter' });
                this.componentDidMount();
              }}
            >
              Kickstarter Data Set
            </button>
          </li>
        </ul>
      </div>
    );
  }

  drawHeader(title, description) {
    d3.selectAll('#header').remove();
    d3.select('.TreemapDiagramPage').append('div').attr('id', 'header');
    d3.select('#header').append('h1').text(title);
    d3.select('#header').append('div').text(description).attr('id', 'description');
    // Ez itt lent a navbar próbálkozás. Nem sikerült a handleClick függvényt működővé varázsolni. A drawNavBar függvény működik.
    /*
    d3.select('#header').append('div').html('Chose dataset: ').attr('id', 'nav-bar');
    d3.select('#nav-bar').append('ul');
    const navBarList = [
      ['Video Game Data Set', 'VideoGame'],
      ['Movies Data Set', 'Movies'],
      ['Kickstarter Data Set', 'Kickstarter']
    ];
    function handleClick(mapType) {
      return function () {
        this.setState({ mapType });
        this.componentDidMount();
      };
    }
    d3.select('ul')
      .selectAll('li')
      .data(navBarList)
      .enter()
      .append('li')
      .append('button')
      .html(d => d[0])
      .attr('onClick', d => handleClick(d[1]));
      */
  }

  createColors(numberOfColors) {
    //for at most 24 colors
    let arr = [];
    function findColor(number) {
      if (number < 12) {
        return 'hsl(' + 30 * number + ', 100%, 50%)';
      } else {
        return 'hsl(' + (30 * number - 360) + ', 100%, 70%)';
      }
    }
    for (let n = 0; n < numberOfColors; n++) {
      arr.push(findColor(n));
    }
    return arr;
  }

  drawTreemap(dataset) {
    console.log(dataset);
  }

  drawLegend(dataset) {
    const legendWidth = 500;
    const legendHeight = 400;
    const itemSize = 30;
    d3.selectAll('#legend').remove();
    d3.select('.TreemapDiagramPage').append('svg').attr('id', 'legend').attr('width', legendWidth).attr('height', legendHeight);
    const colors = this.createColors(dataset.children.length);
    const legendData = colors.map((elem, index) => [elem, dataset.children[index].name]);
    function findPlace(itemIndex) {
      const x = ((itemIndex % 3) * legendWidth) / 3;
      const y = (((itemIndex - (itemIndex % 3)) / 3) * legendHeight) / 6;
      return [x, y];
    }
    const legendItems = d3
      .select('#legend')
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => 'translate(' + findPlace(i)[0] + ', ' + findPlace(i)[1] + ')');
    legendItems
      .append('rect')
      .attr('class', 'legend-item')
      .attr('width', itemSize)
      .attr('height', itemSize)
      .attr('fill', d => d[0]);
    legendItems
      .append('text')
      .text(d => d[1])
      .attr('transform', 'translate(' + Number(itemSize + 5) + ', ' + Number(itemSize / 2 + 5) + ')');
  }

  render() {
    return <div className="TreemapDiagramPage">{this.drawNavBar()}</div>;
  }
}

export default TreemapDiagramPage;
