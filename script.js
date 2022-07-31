const debounce = (fn, debounceTime) => {
  let timerId;
  return function () {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(fn.bind(this, ...arguments), debounceTime);
  };
};

const searchRepoDB = debounce(searchRepo, 250);
const myList = document.querySelector(".my-list");
const dropdown = document.querySelector(".dropdown");
const search = document.querySelector(".search");
search.addEventListener("input", () => searchRepoDB(search.value));

async function searchRepo(q) {
  if (q) {
    try {
      let response = await fetch(
        `https://api.github.com/search/repositories?q=${q}&per_page=15`
      );
      if (response.status === 403) throw new Error("too many requests");
      let data = await response.json();
      const { items } = data;
      let matches = items.filter((ele) => {
        const regexp = new RegExp(`^${q}`, "gi");
        return ele.name.match(regexp);
      });
      output(matches);
    } catch (err) {
      console.log(err);
    }
  } else {
    dropdown.innerHTML = "";
  }
}

function output(arr) {
  if (arr.length == 0) {
    dropdown.innerHTML = "";
  }

  lastOutput = arr.slice(0, 5).length;

  if (dropdown.hasChildNodes()) {
    while (lastOutput > 0) {
      dropdown.removeChild(dropdown.firstChild);
      lastOutput--;
    }
  }

  const fragment = document.createDocumentFragment();
  arr.slice(0, 5).forEach((ele) => {
    const dropdownOutput = document.createElement("div");
    dropdownOutput.classList.add("dropdown-output");
    dropdownOutput.addEventListener("click", () => {
      addToList(ele);
      clear();
    });
    dropdownOutput.textContent = ele.name;
    fragment.appendChild(dropdownOutput);
  });
  dropdown.appendChild(fragment);
}

function addToList(arrItem) {
  const fragment = document.createDocumentFragment();
  const listItem = document.createElement("div");
  listItem.classList.add("flex-container");
  const line = `
    <ul>
      <li>Name: ${arrItem.name}</li>
      <li>Owner: ${arrItem.owner.login}</li>
      <li>Stars: ${arrItem.watchers_count}</li>
    </ul>
  <div onclick="this.closest('div.flex-container').remove()"><i class="fas fa-trash"></i></div>
`;
  listItem.innerHTML = line;
  fragment.appendChild(listItem);
  myList.appendChild(fragment);
}

function clear() {
  search.value = "";
  dropdown.innerHTML = "";
}