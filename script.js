const container = document.querySelector('#js-container');
const form = document.querySelector('#js-form');
const searchEl = document.querySelector('#js-search');
const main = document.querySelector('#js-main');
const overlay = document.querySelector('#js-overlay');

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
  main.textContent = '';
  container.textContent = '';

  showLoading();
  const res = await fetch(url);
  const { data } = await res.json();

  setTimeout(() => {
    showData(data);
  }, 300);
};

const showData = (data) => {
  removeEl('.loader');

  if (data.length === 0) {
    showError(
      `<i class="fa-solid fa-triangle-exclamation"></i> Nothing found<i class="fa-duotone fa-exclamation"></i> Try by searching a different name?`
    );
    return;
  }

  const firstTwentyProducts = data.slice(0, 20);

  firstTwentyProducts.map((phone) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
          <img
            src=${phone.image} alt=${phone.phone_name}
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
            <button href="#" class="btn-goto-details details" data-id=${phone.slug}>View Details</button>
          </div>
 `;

    container.appendChild(div);
    main.append(container);
  });

  if (data.length > 19) {
    const btn = document.createElement('button');
    btn.classList.add('show-more');
    btn.textContent = 'show more';
    main.appendChild(btn);
  }

  const showMore = document.querySelector('.show-more');

  if (showMore) {
    showMore.addEventListener('click', () => {
      document.querySelector('.show-more').remove();
      showLoading();
      setTimeout(() => {
        showAll(data);
      }, 500);
    });
  }
};

const showAll = (data) => {
  removeEl('.loader');
  const restData = data.slice(20, data.length);

  restData.map((phone) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
          <img
            src=${phone.image} alt=${phone.phone_name}
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
            <button href="#" class="btn-goto-details details" data-id=${phone.slug}>View Details</button>
          </div>
 `;

    container.appendChild(div);
    main.append(container);
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

const fetchDataById = async (url) => {
  const res = await fetch(url);
  const { data } = await res.json();

  overlay.textContent = '';
  showProductDetails(data);
};

const showProductDetails = (data) => {
  const { mainFeatures, image, name, releaseDate, brand, others } = data;
  const { storage, displaySize, chipSet, memory, sensors } = mainFeatures;

  overlay.classList.add('show');

  const div = document.createElement('div');
  div.classList.add('modal');

  div.innerHTML = `
      <div class="phone">
        <img src="${data.image}" alt="${data.name}" />

        <div class="info">
          <h3><span>name:</span> ${data.name}</h3>
          <h4><span>brand:</span> ${data.brand}</h4>
          <p>
            <span>release date:</span> ${
              data.releaseDate ? data.releaseDate : 'N/A'
            }
          </p>
        </div>
      </div>

      <div class="specifications">
        ${
          data.mainFeatures
            ? `<div class="feature-box">
          <h3>${mainFeatures ? 'Main Feature' : ' '}</h3>

          <div class="features">
            <div class="title">${storage ? 'storage' : ' '} :</div>
            <div class="description">${storage ? storage : ''}</div>
          </div>

          <div class="features">
            <div class="title">${displaySize ? 'display size' : ' '} :</div>
            <div class="description">${displaySize ? displaySize : ''}</div>
          </div>

          <div class="features">
            <div class="title">${chipSet ? 'chipset' : ' '} :</div>
            <div class="description">${chipSet ? chipSet : ''}</div>
          </div>

          <div class="features">
            <div class="title">${memory ? 'memory' : ' '} :</div>
            <div class="description">${memory ? memory : ''}</div>
          </div>

          <div class="features">
            <div class="title">${sensors ? 'sensors' : ' '} :</div>

            <div class="description">
              ${sensors ? sensors.map((sensor) => sensor).join(', ') : ''}
            </div>
          </div>
        </div>`
            : ''
        }

        ${
          data.others
            ? `
        <div class="feature-box">
          <h3>${data.others ? 'Others' : ' '}</h3>

          <div class="features">
            <div class="title">${data.others?.WLAN ? 'WLAN' : ''} :</div>
            <div class="description">
              ${data.others?.WLAN ? data.others?.WLAN : ''}
            </div>
          </div>

          
          <div class="features">
            <div class="title">
              ${data.others?.Bluetooth ? 'bluetooth' : ' '} :
            </div>
            <div class="description">
              ${data.others?.Bluetooth ? data.others?.Bluetooth : ''}
            </div>
          </div>

          <div class="features">
            <div class="title">${data?.others?.GPS ? 'GPS' : ' '} :</div>
            <div class="description">
              ${data?.others?.GPS ? data?.others?.GPS : ''}
            </div>
          </div>

          <div class="features">
            <div class="title">${data?.others?.NFC ? 'NFC' : ' '} :</div>
            <div class="description">
              ${data?.others?.NFC ? data?.others?.NFC : ''}
            </div>
          </div>

          <div class="features">
            <div class="title">${data?.others?.Radio ? 'radio' : ' '} :</div>
            <div class="description">
              ${data?.others?.Radio ? data?.others?.Radio : ''}
            </div>
          </div>

          <div class="features">
            <div class="title">${data?.others?.USB ? 'USB' : ' '} :</div>
            <div class="description">
              ${data?.others?.USB ? data?.others?.USB : ''}
            </div>
          </div>
        </div>
        `
            : ''
        }   
        
              <button class="btn btn-phone">
                <span>Close</span> <i class="fa-solid fa-xmark cross"></i>
              </button>
      </div>
       <button class="btn btn-close btn-com ">
                <span>Close</span> <i class="fa-solid fa-xmark cross"></i>
        </button>
  
  `;

  overlay.append(div);

  const closeBtnPhn = document.querySelector('.btn-phone');
  const closeBtnCom = document.querySelector('.btn-com');
  closeBtnPhn.addEventListener('click', () => overlay.classList.remove('show'));
  closeBtnCom.addEventListener('click', () => overlay.classList.remove('show'));
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
    `https://openapi.programming-hero.com/api/phones?search=${searchTerm.toLowerCase()}`
  );
  searchEl.value = '';
};

const showDetails = (e) => {
  if (!e.target.classList.contains('details')) return;

  const id = e.target.dataset.id;

  fetchDataById(`https://openapi.programming-hero.com/api/phone/${id}`);
};

const closeModal = (e) => {
  if (e.target.classList.contains('overlay')) {
    overlay.classList.remove('show');
  }
};

form.addEventListener('submit', handleSubmit);
container.addEventListener('click', showDetails);
overlay.addEventListener('click', closeModal);
