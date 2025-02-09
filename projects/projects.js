import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

let query = '';
let selectedIndex = -1;
let searchInput = document.querySelector('.searchBar');

let newRolledData = d3.rollups(projects, (v) => v.length, (d) => d.year);
let newData = newRolledData.map(([year, count]) => {
  return { value: count, label: year }; 
});

// call on page load
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {

  // update query value
  query = event.target.value.toLowerCase();

  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    let matchesQuery = values.includes(query);

    // add to filter by year with pie chart
    let matchesYear = selectedIndex === -1 || project.year === newData[selectedIndex]?.label;
    return matchesQuery && matchesYear;
  });

  // render filtered projects
  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
  });

function renderPieChart(projectsGiven) {

// re-calculate rolled data
let newRolledData = d3.rollups(projectsGiven, (v) => v.length, (d) => d.year);

// re-calculate data
let newData = newRolledData.map(([year, count]) => {
  return { value: count, label: year }; 
});
  
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);;
  let newArcData = newSliceGenerator(newData);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let colors = d3.scaleOrdinal(d3.schemeSet2); 

  let svg = d3.select('svg'); 
  let legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('*').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  newArcData.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
  
        let filteredProjects = projects.filter(project => {
          let matchesYear = selectedIndex === -1 || project.year === newData[selectedIndex]?.label;

          // add to filter by search query
          let matchesQuery = Object.values(project).join('\n').toLowerCase().includes(query);
          return matchesYear && matchesQuery;
        });

        console.log(filteredProjects);

        projectsContainer.innerHTML = '';
        renderProjects(filteredProjects, projectsContainer, 'h2');

        svg
          .selectAll('path')
          .attr('class', (_, i) => 
          (i === selectedIndex ? 'selected' : ''));
  
        legend
          .selectAll('li')
          .attr('class', (_, i) => 
          (i === selectedIndex ? 'selected' : ''));
      });
  });

  newData.forEach((d, i) => {
    legend.append('li')
        .attr('class', 'legend-color')
        .attr('style', `--color:${colors(i)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .on('click', () => {
          selectedIndex = selectedIndex === i ? -1 : i;
    
          let filteredProjects = projects.filter(project => {
            let matchesYear = selectedIndex === -1 || project.year === newData[selectedIndex]?.label;

            // add to filter by search query
            let matchesQuery = Object.values(project).join('\n').toLowerCase().includes(query);
            return matchesYear && matchesQuery;
          });
  
          projectsContainer.innerHTML = '';
          renderProjects(filteredProjects, projectsContainer, 'h2');
    
          legend
            .selectAll('li')
            .attr('class', (_, i) => 
            (i === selectedIndex ? 'selected' : ''));

          svg
            .selectAll('path')
            .attr('class', (_, i) => 
            (i === selectedIndex ? 'selected' : ''));
        });
    });
  }