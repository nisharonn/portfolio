console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$('nav a');

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add('current');

const ARE_WE_HOME = document.documentElement.classList.contains('home');


let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/nisharonn/', title: 'Github' }
];

let nav = document.createElement('nav');
document.body.prepend(nav)

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a)

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host != location.host) {
        a.target = '_blank';
    }

}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
            <option value='light dark'> Automatic (${matchMedia("(prefers-color-scheme: dark)").matches ? 'Dark' : 'Light'}) </option>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
      </label>
    `
);

let select = document.querySelector('select'); 

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;

    
}

let form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
    event.preventDefault();

    let data = new FormData(form);
    let url = form.action + '?';

    for (let [name, value] of data) {

        name = encodeURIComponent(name);
        value = encodeURIComponent(value);

        url += `${name}=${value}&`;
        console.log(name, value);
    }

    location.href = url;
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        console.log(response)

        const data = await response.json();
        return data; 


    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement || !(containerElement instanceof HTMLElement)) {
        console.error("Invalid container element provided.");
        return;
    }

    const currentPage = window.location.pathname;

    let imageBasePath = './images/'; 

    if (currentPage.includes('projects')) {
        imageBasePath = '../images/';
    }


    //validate headingLevel parameter
    const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadingLevels.includes(headingLevel)) {
        console.warn(`Invalid heading level "${headingLevel}". Defaulting to "h2".`);
        headingLevel = 'h2';
    }

    const projectTitleElement = document.querySelector('.projects-title');if (projectTitleElement) {
    const projectCountText = projects.length === 1 ? '1 Project' : `${projects.length} Projects`;
    projectTitleElement.textContent = projectCountText;
}


    if (projects.length === 0) {
        containerElement.innerHTML = "<p>No projects available.</p>";
        return;
    }

    projects.forEach(project => {
        const article = document.createElement('article');
        article.classList.add('project');

        const title = project.title || "Untitled Project";
        const image = project.image ? imageBasePath + project.image : imageBasePath + 'placeholder.jpg'; 
        const description = project.description || "No description available.";
        const year = project.year || "Year unknown";
        const url = project.url; 

        const titleHTML = url
        ? `<a href="${url}" class="project-link" target="_blank" rel="noopener noreferrer">${title}</a>`
        : title;

        article.innerHTML = `
            <${headingLevel} class="project-title">${titleHTML}</${headingLevel}>
            <img src="${image}" alt="${title}">
            <div class="project-details">
                <p class="project-description">${description}</p>
                <p class="project-year">${year}</p>
            </div>
        `;

        containerElement.appendChild(article);

    });
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);

}