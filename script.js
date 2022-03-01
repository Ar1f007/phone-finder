const container = document.querySelector('#js-container');
const form = document.querySelector('#js-form');
const searchEl = document.querySelector('#js-search');
const main = document.querySelector('#js-main');
const overlay = document.querySelector('#js-overlay');

searchEl.focus();
/**
 * LOADING SPINNER
 */
const showLoading = () => {
  const div = document.createElement('div');
  div.classList.add('loader');
  main.appendChild(div);
};

/**
 * RESPONSIBLE FOR SHOWING ERROR
 */
const showError = (msg) => {
  container.textContent = '';

  const p = document.createElement('p');
  p.innerHTML = msg;
  p.classList.add('error');

  main.appendChild(p);
};

/**
 * REMOVE AN ELEMENT FROM THE DOM
 */
const removeEl = (element) => {
  const loader = document.querySelector(element);
  if (loader) {
    loader.remove();
  }
};

/**
 * FETCHES ALL THE DATA INITIALLY,
 * PASS IT TO showData()
 */
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

/**
 * DISPLAYS DATA(up to 20) TO THE DOM IF DATA EXISTS
 */
const showData = (data) => {
  removeEl('.loader');

  if (data.length === 0) {
    showError(
      `<i class="fa-solid fa-triangle-exclamation"></i> Nothing found<i class="fa-duotone fa-exclamation"></i> Try by searching a different name?`
    );
    return;
  }

  data.slice(0, 20).map((phone) => {
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

  // checks if there is more than 20 items, if it is then creates "show more" button
  if (data.length > 19) {
    const btn = document.createElement('button');
    btn.classList.add('show-more');
    btn.textContent = 'show more';
    main.appendChild(btn);
  }

  const showMore = document.querySelector('.show-more');

  // listening to the events for showing more items
  if (showMore) {
    showMore.addEventListener('click', () => {
      document.querySelector('.show-more').remove();

      showLoading();

      setTimeout(() => {
        showRestsData(data);
      }, 500);
    });
  }
};

/**
 * RESPONSIBLE FOR SHOWING ALL THE REMAINING ITEMS TO THE PAGE
 */
const showRestsData = (data) => {
  //remove loading
  removeEl('.loader');

  // display data
  data.slice(20, data.length).map((phone) => {
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

    // append the card to the container
    container.appendChild(div);
    // append the container to the main div
    main.append(container);
  });
};

/**
 * RESPONSIBLE FOR REMOVING ANY PREVIOUS ERROR FROM THE PAGE
 */
const removePreviousErrors = () => {
  const errors = Array.from(document.querySelectorAll('.error'));
  if (errors) {
    for (let error of errors) {
      error.remove();
    }
  }
};

/**
 * FETCHES DATA FOR A PARTICULAR ITEM BY ID/SLUG
 */
const fetchDataById = async (url) => {
  const res = await fetch(url);
  const { data } = await res.json();

  overlay.textContent = '';
  showProductDetails(data);
};

/**
 * GETS DATA IN DETAILS FOR A PARTICULAR PRODUCT
 */
const showDetails = (e) => {
  if (!e.target.classList.contains('details')) return;

  const id = e.target.dataset.id;

  fetchDataById(`https://openapi.programming-hero.com/api/phone/${id}`);
};

/**
 * DISPLAY SPECIFICATIONS OF A PRODUCT IN A MODAL
 */
const showProductDetails = (data) => {
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
          <h3>${data.mainFeatures ? 'Main Feature' : ' '}</h3>

          <div class="features">
            <div class="title">${
              data.mainFeatures.storage ? 'storage' : ' '
            } :</div>
            <div class="description">${
              data.mainFeatures.storage ? data.mainFeatures.storage : ''
            }</div>
          </div>

          <div class="features">
            <div class="title">${
              data.mainFeatures.displaySize ? 'display size' : ' '
            } :</div>
            <div class="description">${
              data.mainFeatures.displaySize ? data.mainFeatures.displaySize : ''
            }</div>
          </div>

          <div class="features">
            <div class="title">${
              data.mainFeatures.chipSet ? 'chipset' : ' '
            } :</div>
            <div class="description">${
              data.mainFeatures.chipSet ? data.mainFeatures.chipSet : ''
            }</div>
          </div>

          <div class="features">
            <div class="title">${
              data.mainFeatures.memory ? 'memory' : ' '
            } :</div>
            <div class="description">${
              data.mainFeatures.memory ? data.mainFeatures.memory : ''
            }</div>
          </div>

          <div class="features">
            <div class="title">${
              data.mainFeatures.sensors ? 'sensors' : ' '
            } :</div>

            <div class="description">
              ${
                data.mainFeatures.sensors
                  ? data.mainFeatures.sensors.map((sensor) => sensor).join(', ')
                  : ''
              }
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

/**
 * CLOSES THE MODAL ON CLICKING OVERLAY AREA
 */
const closeModal = (e) => {
  if (e.target.classList.contains('overlay')) {
    overlay.classList.remove('show');
  }
};

/**
 * DISPLAYS/HIDES ICON FOR NAVIGATING TO THE TOP
 * ACCORDING TO SCROLL-Y POSITION
 */
const showNavigateToTopIcon = () => {
  if (window.scrollY > 200) {
    document.querySelector('.navigate-to-top').style.visibility = 'visible';
  } else {
    document.querySelector('.navigate-to-top').style.visibility = 'hidden';
  }
};
/**
 * CALLS FOR FETCHING DATA ON SUBMIT
 * CHECKS FOR VALID INPUT
 */
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

// EVENT LISTENERS
form.addEventListener('submit', handleSubmit);
container.addEventListener('click', showDetails);
overlay.addEventListener('click', closeModal);
window.addEventListener('scroll', showNavigateToTopIcon);
