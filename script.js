const container = document.querySelector('#js-container');
const form = document.querySelector('#js-form');
const searchEl = document.querySelector('#js-search');
const main = document.querySelector('#js-main');

const showLoading = () => {
  const div = document.createElement('div');
  div.classList.add('loader');
  main.appendChild(div);
};

const showError = (msg) => {
  container.textContent = '';

  const p = document.createElement('p');
  p.innerHTML = msg;
  p.classList.add('error');

  main.appendChild(p);
};

const removeEl = (element) => {
  const loader = document.querySelector(element);
  if (loader) {
    loader.remove();
  }
};

const fetchData = async (url) => {
  container.textContent = '';

  showLoading();
  const res = await fetch(url);
  const data = await res.json();

  setTimeout(() => {
    showData(data);
  }, 300);
};

const showData = (phoneList) => {
  const { data } = phoneList;

  removeEl('.loader');

  if (data.length === 0) {
    showError(
      `<i class="fa-solid fa-triangle-exclamation"></i> Nothing found<i class="fa-duotone fa-exclamation"></i> Try by searching a different name?`
    );
    return;
  }

  data.map((phone) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
          <img
            src=${phone.image}
            class="img"
          />
          <div class="card-body">
            <h3 class="title">
              <small class="small-text">name:</small> ${phone.phone_name}
            </h3>
            <h3 class="brand">
              <small class="small-text">brand:</small> ${phone.brand}
            </h3>
          </div>
          <div class="card-footer">
            <a href="https://openapi.programming-hero.com/api/phone/${phone.slug}" class="btn-goto-details">View Details</a>
          </div>
 `;

    container.appendChild(div);
  });
};

const removePreviousErrors = () => {
  const errors = Array.from(document.querySelectorAll('.error'));
  if (errors) {
    for (let error of errors) {
      error.remove();
    }
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const searchTerm = searchEl.value;
  removePreviousErrors();

  if (searchTerm.trim() === '') {
    showError(
      `Please provide some value <i class="fa-duotone fa-exclamation"></i>`
    );

    return;
  }

  fetchData(
    `https://openapi.programming-hero.com/api/phones?search=${searchTerm}`
  );
  searchEl.value = '';
};

form.addEventListener('submit', handleSubmit);
