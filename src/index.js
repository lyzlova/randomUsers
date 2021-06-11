import "./scss/index.scss";

const BASE_URL = "https://randomuser.me/api/";
const words = ["пользователь", "пользователя", "пользователей"];
let arrResultUsers = [];
let filtredUsers = [];
let sortedUsers = [];
const filter = { searchValue: "", gender: [], age: [] };
const sortParams = { selectedOptions: "4", perPage: 5 };
let countUsers = null;
let currentPage = 1; //текущий номер страницы
let totalPages; //всего страниц
let startSliceUsers = 0;
let endSliceUsers = 5;
let isSelectPerpage = false;

const refs = {
  loadMore: document.querySelector("[data-load-more]"),
  usersContainer: document.querySelector("[data-users-container]"),
  user: document.querySelector("#user-template"),
  spiner: document.querySelector("[data-load-spiner]"),
  statisticTemplate: document.querySelector("#statistics"),
  statisticContainer: document.querySelector(".statistics"),
  filter: document.querySelector(".filter"),
  search: document.querySelector("[data-input-search]"),
  content: document.querySelector(".users-content"),
  select: document.querySelector("#sort-control"),
  allCheckbox: Array.from(document.querySelectorAll('input[type="checkbox"]')),
  paginationList: document.querySelector(".pagination__list"),
  startStep: document.querySelector("#first-step"),
  endStep: document.querySelector("#last-step"),
  prevStep: document.querySelector("#prev-step"),
  nextStep: document.querySelector("#next-step"),
  selectPerPage: document.querySelector("#view-control"),
};

function getRandomUser(max) {
  return Math.floor(Math.random() * max);
}

refs.loadMore.addEventListener("click", onLoad);

function onLoad(e) {
  refs.spiner.classList.remove("is-hidden");
  refs.search.value = "";
  sortParams.selectedOptions = "";
  sortParams.perPage = 5;
  refs.selectPerPage.selectedIndex = 0;
  refs.select.selectedIndex = 0;
  currentPage = 1;
  clearCardesContainer();
  fetchUsers();
  filterAccordion();
  onSearch();
  onSelect();
  onSelectPerPage();
  onCheckedFeature();
}

function getUsers(randomUsers) {
  const url = `${BASE_URL}?&results=${randomUsers}`;

  return fetch(url)
    .then((response) => response.json())
    .then(({ results }) => {
      return results;
    });
}

function fetchUsers() {
  getUsers(getRandomUser(101)).then((users) => {
    arrResultUsers = [...users];
    filtredUsers = [...users];
    sortedUsers = [...users];
    replaceMurkup(arrResultUsers.slice(0, 5));
    getStatistics(arrResultUsers);
    createPagination();
  });
}

function replaceMurkup(users) {
  users.map(makeUserCard);
  refs.spiner.classList.add("is-hidden");
}

function makeUserCard({
  picture,
  name,
  gender,
  phone,
  email,
  location,
  dob,
  registered,
}) {
  const dateBirthday = new Date(dob.date);
  const dateBirthdayContent = `${validDate(
    dateBirthday.getUTCDate()
  )}-${validDate(
    dateBirthday.getUTCMonth() + 1
  )}-${dateBirthday.getUTCFullYear()}`;

  const dateRegistered = new Date(registered.date);
  const dateRegisteredContent = `${validDate(
    dateRegistered.getUTCDate()
  )}-${validDate(
    dateRegistered.getUTCMonth() + 1
  )}-${dateRegistered.getUTCFullYear()}`;

  const replacedUser = refs.user.innerHTML
    .replace(/{{hrefImg}}/gi, picture.large)
    .replace(/{{lastName}}/, name.last)
    .replace(/{{firstName}}/, name.first)
    .replace(/{{gender}}/, gender)
    .replace(/{{phone}}/gi, phone)
    .replace(/{{email}}/gi, email)
    .replace(/{{state}}/, location.state)
    .replace(/{{city}}/, location.city)
    .replace(/{{street}}/, location.street.name)
    .replace(/{{birthday}}/, dateBirthdayContent)
    .replace(/{{registered}}/, dateRegisteredContent);
  refs.usersContainer.insertAdjacentHTML("beforeend", replacedUser);
}

function validDate(value) {
  return String(value).padStart(2, "0");
}

function getStatistics(users) {
  const female = users.filter((user) => user.gender === "female");
  const male = users.filter((user) => user.gender === "male");
  const dominantGender =
    female > male ? "женщин" : female < male ? "мужчин" : "равное количество";

  const stats = users
    .flatMap((user) => user.nat)
    .reduce(
      (acc, nationality) => ({
        ...acc,
        [nationality]: acc[nationality] ? acc[nationality] + 1 : 1,
      }),
      {}
    );

  const replacesStatistics = refs.statisticTemplate.innerHTML
    .replace(/{{users}}/, users.length)
    .replace(/{{female}}/, female.length)
    .replace(/{{male}}/, male.length)
    .replace(/{{dominantGender}}/, dominantGender)
    .replace(/{{nationality}}/, createNationalityList(stats));

  refs.statisticContainer.innerHTML = replacesStatistics;
}

function createNationalityList(stats) {
  return Object.entries(stats).map(makeNationalityMarkUp).join("");
}

function makeNationalityMarkUp([key, value]) {
  const declensionUser = declensionAmount(value, words);

  return `<div>${key}: ${value} ${declensionUser}</div>`;
}

function declensionAmount(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

function clearCardesContainer() {
  refs.usersContainer.innerHTML = "";
}

function redrawPage() {
  clearCardesContainer();
  replaceMurkup(filtredUsers);
  getStatistics(filtredUsers);
}

// Stage 2
// поиск на странице

function onSearch() {
  refs.filter.classList.remove("is-hidden");

  refs.search.addEventListener("input", (e) => {
    filter.searchValue = e.target.value.trim().toLowerCase();

    filterProducts();
    redrawPage();
    updatePagination();
  });

  refs.search.addEventListener("keypress", (e) => {
    e.keyCode == 13 && e.preventDefault();
  });
}

// sort

function onSelect() {
  refs.content.classList.remove("is-hidden");

  refs.select.addEventListener("change", function (e) {
    sortParams.selectedOptions = this.value;

    filterProducts();
    redrawPage();
  });
}

// фильтр по checked

function onCheckedFeature() {
  refs.allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("click", (e) => {
      let arr = e.target.name;
      let value = e.target.value;

      !filter[arr].includes(value)
        ? filter[arr].push(value)
        : (filter[arr] = filter[arr].filter((item) => item !== value));

      filterProducts();
      clearCardesContainer();
      replaceMurkup(filtredUsers);
      getStatistics(filtredUsers);
      updatePagination();
    });
  });
}

// фильтрация

function filterProducts() {
  filtredUsers = arrResultUsers
    .filter((item) => filtersBySearch(item, filter.searchValue))
    .filter((item) => applyCheckedFields(item.gender, filter.gender))
    .filter((item) => applyCheckedAgeFields(item.dob.age, filter.age))
    .sort(sortByOption(sortParams.selectedOptions));

  sortedUsers = [...filtredUsers];
  filtredUsers = filtredUsers.slice(startSliceUsers, endSliceUsers);
}

const optionsSort = {
  0: () => filtersBySearch(sortParams.selectedOptions),
  1: (a, b) => a.name.last.localeCompare(b.name.last),
  2: (a, b) => b.name.last.localeCompare(a.name.last),
  3: (a, b) => b.gender.localeCompare(a.gender),
  4: (a, b) => a.gender.localeCompare(b.gender),
  5: (a, b) =>
    b.gender.localeCompare(a.gender) || a.name.last.localeCompare(b.name.last),
  6: (a, b) =>
    b.gender.localeCompare(a.gender) || b.name.last.localeCompare(a.name.last),
  7: (a, b) =>
    a.gender.localeCompare(b.gender) || a.name.last.localeCompare(b.name.last),
  8: (a, b) =>
    a.gender.localeCompare(b.gender) || b.name.last.localeCompare(a.name.last),
};

function sortByOption(val) {
  if (sortParams.selectedOptions === "0") {
    true;
  } else {
    return optionsSort[val];
  }
}

// Stage 3

function applyCheckedFields(arrParam, filterParam) {
  return filterParam.length === 0 ? true : filterParam.includes(arrParam);
}

function filtersBySearch(item, filterParam) {
  return filterParam === "" ? true : findIncludesElement(item, filterParam);
}

function findIncludesElement(item, val) {
  const includesElemenet =
    item.email.toLowerCase().includes(val) ||
    item.phone.toLowerCase().includes(val) ||
    item.name.first.toLowerCase().includes(val) ||
    item.name.last.toLowerCase().includes(val);
  return includesElemenet;
}

const ranges = {
  "0-35": { min: 0, max: 35 },
  "35-40": { min: 35, max: 40 },
  "40-45": { min: 40, max: 45 },
  "45+": { min: 45, max: Infinity },
};

function applyCheckedAgeFields(age, rangeParam) {
  let range = Object.keys(ranges).find(
    (range) => ranges[range].min <= age && ranges[range].max >= age
  );

  return rangeParam.length === 0 ? true : rangeParam.includes(range);
}

function onSelectPerPage() {
  refs.selectPerPage.addEventListener("change", function (e) {
    !isSelectPerpage;
    if (this.value === "100") {
      sortParams.perPage = sortedUsers.length;
    } else {
      sortParams.perPage = +this.value;
    }

    totalPages = Math.ceil(sortedUsers.length / sortParams.perPage);

    cutUsers();
    filterProducts();
    redrawPage();
    updatePagination();
  });
}

// pagination

function createPagination() {
  totalPages = Math.ceil(filtredUsers.length / sortParams.perPage); //кол-во страниц
  refs.paginationList.innerHTML = "";
  addPaginationButtons();
  onStepPagination();
}

function updatePagination() {
  totalPages = Math.ceil(sortedUsers.length / sortParams.perPage); //кол-во страниц

  refs.paginationList.innerHTML = "";
  addPaginationButtons();
  onStepPagination();
}

function createPagePaginationMarkUp(content, cls = "") {
  return `<a href="#" class="pagination__item ${cls}" data-page="${content}">${content}</a>`;
}

function pageNumber(totalPages, maxPageVisible, currentPage) {
  let half = Math.round(maxPageVisible / 2);
  let to = maxPageVisible;
  let total = totalPages;
  let maxPages = maxPageVisible;

  if (totalPages < 5) {
    maxPages = totalPages;
    half = 2;
  }

  if (currentPage + half >= total) {
    to = total;
  } else if (currentPage > half) {
    to = currentPage + half;
  } else if (currentPage + half < total) {
    to = maxPages;
  }
  let from = to - maxPages;

  return Array.from({ length: maxPages }, (_, i) => i + 1 + from);
}

function changeStylePagination() {
  const currentActiveLink = document.querySelector(".pagination__item.active");

  currentActiveLink && currentActiveLink.classList.remove("active");

  if (currentPage > 1) {
    refs.startStep.classList.remove("pagination-state--disabled");
    refs.prevStep.classList.remove("pagination-state--disabled");
  } else {
    refs.startStep.classList.add("pagination-state--disabled");
    refs.prevStep.classList.add("pagination-state--disabled");
  }

  if (+currentPage === totalPages) {
    refs.nextStep.classList.add("pagination-state--disabled");
    refs.endStep.classList.add("pagination-state--disabled");
  } else {
    refs.nextStep.classList.remove("pagination-state--disabled");
    refs.endStep.classList.remove("pagination-state--disabled");
  }
}

function onStepPagination() {
  const paginationList = document.querySelector(".pagination__list");

  paginationList.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.nodeName === "A") {
      currentPage = +e.target.textContent;
    }

    cutUsers();
    filterProducts();
    redrawPage();
    addPaginationButtons();
  });

  refs.nextStep.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage += 1;
    addPaginationButtons();

    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.prevStep.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage -= 1;
    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.startStep.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = 1;
    addPaginationButtons();

    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.endStep.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = totalPages;
    addPaginationButtons();

    cutUsers();
    filterProducts();
    redrawPage();
  });
}

function addPaginationButtons() {
  refs.paginationList.innerHTML = "";
  changeStylePagination();

  let pages = pageNumber(totalPages, 5, currentPage);

  pages.forEach((pageNumber) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createPagePaginationMarkUp(
      pageNumber,
      isCurrentPage ? "active" : "",
      false
    );
    refs.paginationList.insertAdjacentHTML("beforeend", button);
  });
}

function cutUsers() {
  startSliceUsers = (currentPage - 1) * sortParams.perPage;
  endSliceUsers = startSliceUsers + sortParams.perPage;
}

function filterAccordion() {
  const dropdownFilter = document.querySelectorAll("[data-select]");

  if (dropdownFilter) {
    dropdownFilter.forEach((elem) => {
      elem.addEventListener("click", changePath);
    });
  }

  function changePath(e) {
    this.querySelector("[data-filter-path]").classList.toggle("is-open");
    this.nextElementSibling.classList.toggle("visually-hidden");
  }
}
