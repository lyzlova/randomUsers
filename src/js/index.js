import "../scss/index.scss";
import refs from "./refs.js";
import env from "./env.js";
import createMarkup from "./createMarkUp.js";
import changeStyle from "./changeStyle.js";
import wordsUsers from "./wordsUsers.json";

let arrResultUsers = [];
let filtredUsers = [];
const filter = { search: "", gender: [], age: [], sort: "0", perPage: "5" };
let currentPage = 1;
let totalPages;
let startSliceUsers = 0;
let endSliceUsers = 5;
let filtredUsersLength = 0;

refs.loadMore.addEventListener("click", onLoad);
refs.form.addEventListener("input", onСompileFormData);

function getRandomUser(max) {
  return Math.floor(Math.random() * max + 1);
}

function onLoad(e) {
  changeStyle.removeStyle(refs.spiner, "is-hidden");
  changeStyle.removeStyle(refs.content, "is-hidden");
  changeStyle.removeStyle(refs.filter, "is-hidden");
  changeStyle.removeStyle(refs.btnOpenContent, "is-hidden");
  refs.search.value = "";
  refs.usersContainer.innerHTML = "";
  filter.sort = "";
  filter.perPage = 5;
  filter.gender = [];
  filter.age = [];
  endSliceUsers = 5;
  refs.selectPerPage.selectedIndex = 0;
  refs.select.selectedIndex = 0;
  currentPage = 1;
  disableChecked();
  fetchUsers();
  filterAccordion();
}

function disableChecked() {
  refs.allCheckbox.forEach((item) => {
    item.checked = false;
  });
}

function getUsers(randomUsers) {
  const url = `${env.BASE_URL}?&results=${randomUsers}`;

  return fetch(url)
    .then((response) => response.json())
    .then(({ results }) => {
      return results;
    });
}

function fetchUsers() {
  getUsers(getRandomUser(100)).then((users) => {
    changeStyle.addStyle(refs.spiner, "is-hidden");
    arrResultUsers = [...users];

    filterProducts();
    createMarkup.replaceMurkup(filtredUsers);
    getStatistics(arrResultUsers);
    createPagination();
  });
}

function getStatistics(users) {
  const female = users.filter((user) => user.gender === "female");
  const male = users.filter((user) => user.gender === "male");
  let dominantGender = "";

  if (female > male) {
    dominantGender = "женщин";
  } else if (female < male) {
    dominantGender = "мужчин";
  } else {
    dominantGender = "равное количество";
  }

  const stats = users
    .flatMap((user) => user.nat)
    .reduce(
      (acc, nationality) => ({
        ...acc,
        [nationality]: acc[nationality] ? acc[nationality] + 1 : 1,
      }),
      {}
    );

  refs.statisticContainer.innerHTML = createMarkup.makeStatistics(
    female,
    male,
    users,
    dominantGender,
    createNationalityList(stats)
  );
}

function createNationalityList(stats) {
  return Object.entries(stats).map(makeNationalityMarkUp).join("");
}

function makeNationalityMarkUp([key, value]) {
  const declensionUser = declensionAmount(value, wordsUsers.words);

  return `<div>${key}: ${value} ${declensionUser}</div>`;
}

function declensionAmount(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

function redrawPage() {
  refs.usersContainer.innerHTML = "";
  createMarkup.replaceMurkup(filtredUsers);
}

function onSelectData() {
  if (refs.selects) {
    refs.selects.forEach((elem) => {
      elem.addEventListener("change", () => {
        getFormData();
        cutUsers();
        filterProducts();
        redrawPage();
        createPagination();
      });
    });
  }
}

onSelectData();

// Stage 2

function getFormData() {
  const formData = new FormData(refs.form);
  const values = Object.fromEntries(formData.entries());

  formData.forEach((value, key) => {
    if (Array.isArray(filter[key])) {
      filter[key] = formData.getAll([key]);
    } else {
      filter[key] = values[key].trim().toLowerCase();
    }
  });

  for (let key in filter) {
    if (!values.hasOwnProperty(key)) {
      filter[key] = [];
    }
  }
}

function onСompileFormData(e) {
  getFormData();
  filterProducts();
  redrawPage();
  cutUsers();
  createPagination();

  refs.search.addEventListener("keypress", (e) => {
    e.keyCode === 13 && e.preventDefault();
  });
}

// фильтрация

function filterProducts() {
  filtredUsers = arrResultUsers
    .filter((item) => filtersBySearch(item, filter.search))
    .filter((item) => applyCheckedFields(item.gender, filter.gender))
    .filter((item) => applyCheckedAgeFields(item.dob.age, filter.age))
    .sort(sortByOption(filter.sort));

  getStatistics(filtredUsers);
  filtredUsersLength = filtredUsers.length;
  filtredUsers = filtredUsers.slice(startSliceUsers, endSliceUsers);
}

const optionsSort = {
  0: () => filtersBySearch(filter.sort),
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
  if (filter.sort === "0") {
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

// pagination

function createPagination() {
  totalPages = Math.ceil(filtredUsersLength / filter.perPage);
  refs.paginationList.innerHTML = "";

  addPaginationButtons();
  onStepPagination();
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

function onStepPagination() {
  const paginationList = document.querySelector(".pagination__list");

  paginationList.addEventListener("click", function (e) {
    if (e.target.nodeName === "A") {
      currentPage = +e.target.textContent;
    }

    cutUsers();
    filterProducts();
    redrawPage();
    addPaginationButtons();
  });

  refs.nextStep.addEventListener("click", (e) => {
    currentPage += 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.prevStep.addEventListener("click", (e) => {
    currentPage -= 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.startStep.addEventListener("click", (e) => {
    currentPage = 1;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });

  refs.endStep.addEventListener("click", (e) => {
    currentPage = totalPages;

    addPaginationButtons();
    cutUsers();
    filterProducts();
    redrawPage();
  });
}

function addPaginationButtons() {
  refs.paginationList.innerHTML = "";
  changeStyle.changeStylePagination(currentPage, totalPages);

  let pages = pageNumber(totalPages, 5, currentPage);

  pages.forEach((pageNumber) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createMarkup.createPagePaginationMarkUp(
      pageNumber,
      isCurrentPage ? "active" : "",
      false
    );
    refs.paginationList.insertAdjacentHTML("beforeend", button);
  });
}

function cutUsers() {
  startSliceUsers = (currentPage - 1) * filter.perPage;
  endSliceUsers = startSliceUsers + filter.perPage;
}

function filterAccordion() {
  if (refs.dropdownFilter) {
    refs.dropdownFilter.forEach((elem) => {
      elem.addEventListener("click", changeStyle.changePath);
    });
  }
}
