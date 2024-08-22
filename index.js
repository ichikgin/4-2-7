const form = document.querySelector('.search-form');
const searchList = form.querySelector('.searchList')
const repositories = document.querySelector('.lIst-repository');
const input = form.querySelector('.search-input');
let timeout;


function createElement(tagName, ...className) {
  const element = document.createElement(tagName);
  if (className) {

    className.forEach((className) => element.classList.add(className));
  } else element.classList.add(element);
  return element;
}

function listener(type, selector, callback) {
  const listenElem = document.querySelector(`.${selector}`);
  return listenElem.addEventListener(type, callback);
}



async function  getPost(name) {
  if(name) {
    let response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
    if (response.ok ){
      let post = await response.json();
      try {
        for (let i = 1; i <= 5; i++) {
          let searchResult = createElement('div', 'search', `search-${i}`);
          searchResult.textContent = post.items[i].name;
          searchList.append(searchResult);
          form.append(searchList)
          listener('click', `search-${i}`,  (event) => {
            let searchResult = createElement('li', ['repository-item']);
            let name = createElement('p', ['repository-name']);
            let owner = createElement('p', ['repository-owner']);
            let stars = createElement('p', ['repository-stars']);
            let btn = createElement('button', ['repository-btn']);
            name.textContent = `Name: ${post.items[i].name}`;
            owner.textContent = `Owner: ${post.items[i].owner.login}`;
            stars.textContent = `Stars: ${post.items[i].stargazers_count}`;
            searchResult.append(name, owner, stars, btn);
            repositories.append(searchResult);
            searchList.textContent = '';
            input.value = '';
            repositories.addEventListener('click', (event) => {
              if (event.target.className === 'repository-btn') {
                event.target.parentElement.remove()
              }
            })
          })

        }
      } catch (error) {
        input.value = '';
        alert("По вашему запросу ничего не найдено, повторите попытку")
      }

    } else alert('Ошибка при получении поискового запроса')
  }
}

listener('keyup', 'search-input',  (event) => {
  setTimeout(() => {
    clearTimeout(timeout);
    form.querySelector('.searchList').innerHTML = '';
    timeout = setTimeout(() => getPost(event.target.value), 500)
  })

})
