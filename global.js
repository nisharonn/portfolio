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
    { url: 'https://github.com/nisharonn/', title: 'Github' }
];

let nav = document.createElement('nav');
document.body.prepend(nav)

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url + 'index.html': url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a)

    console.log(url)

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