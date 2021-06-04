import "./scss/index.scss";

const BASE_URL = "https://randomuser.me/api/";
const words = ["пользователь", "пользователя", "пользователей"];
let arrResultUsers = [];
let filtredUsers = [];
let searchValue = "";
let selectedOptions = "";
let selectedDefault = true;

const refs = {
  loadMore: document.querySelector("[data-load-more]"),
  usersContainer: document.querySelector("[data-users-container]"),
  user: document.querySelector("#user-template"),
  spiner: document.querySelector("[data-load-spiner]"),
  statistic: document.querySelector("#statistics"),
  usersFilter: document.querySelector(".users__filters"),
  search: document.querySelector("[data-input-search]"),
  sort: document.querySelector(".sort"),
  select: document.querySelector("#sort-control"),
};

function getRandomUser(max) {
  return Math.floor(Math.random() * max);
}

refs.loadMore.addEventListener("click", onLoad);

function onLoad(e) {
  refs.spiner.classList.remove("is-hidden");
  refs.search.value = "";
  clearCardesContainer();
  fetchUsers();
}

function getUsers(randomUsers) {
  const url = `${BASE_URL}?results=${randomUsers}`;

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
    replaceMurkup(arrResultUsers);
    getStatistics(arrResultUsers);
    onSearch();
    onSelect();
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
    .replaceAll(/{{hrefImg}}/gi, picture.large)
    .replace(/{{lastName}}/, name.last)
    .replace(/{{firstName}}/, name.first)
    .replace(/{{gender}}/, gender)
    .replaceAll(/{{phone}}/gi, phone)
    .replaceAll(/{{email}}/gi, email)
    .replace(/{{state}}/, location.state)
    .replace(/{{city}}/, location.city)
    .replace(/{{street}}/, location.street.name)
    .replace(/{{birthday}}/, dateBirthdayContent)
    .replace(/{{registered}}/, dateRegisteredContent);
  refs.usersContainer.insertAdjacentHTML("afterbegin", replacedUser);
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

  const replacesStatistics = refs.statistic.innerHTML
    .replace(/{{users}}/, users.length)
    .replace(/{{female}}/, female.length)
    .replace(/{{male}}/, male.length)
    .replace(/{{dominantGender}}/, dominantGender)
    .replace(/{{nationality}}/, createNationalityList(stats));
  refs.usersContainer.insertAdjacentHTML("beforeend", replacesStatistics);
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

function redrawing() {
  clearCardesContainer();
  replaceMurkup(filtredUsers);
  getStatistics(filtredUsers);
}

// Stage 2

// filters

function onSearch() {
  refs.usersFilter.classList.remove("is-hidden");

  refs.search.addEventListener("input", (e) => {
    searchValue = e.target.value.trim().toLowerCase();

    filtersBySearch(searchValue);
  });

  refs.search.addEventListener("keypress", (e) => {
    e.keyCode == 13 && e.preventDefault();
  });
}

function filtersBySearch(val) {
  filtredUsers = arrResultUsers.filter((item) => {
    const includesElemenet =
      item.email.toLowerCase().includes(val) ||
      item.phone.toLowerCase().includes(val) ||
      item.name.first.toLowerCase().includes(val) ||
      item.name.last.toLowerCase().includes(val);

    return includesElemenet;
  });

  selectedDefault && redrawing();
}

// sort

function onSelect() {
  refs.sort.classList.remove("is-hidden");

  refs.select.addEventListener("change", function (e) {
    filtersBySearch(searchValue);
    selectedOptions = this.value;
    rewdrowSelectResult();
  });
}

function rewdrowSelectResult() {
  if (selectedDefault) {
    filtredUsers = filtredUsers.sort(sortByOption(selectedOptions));
  }

  redrawing();
}

function sortByOption(val) {
  switch (val) {
    case "1":
      return (a, b) => b.name.last.localeCompare(a.name.last);
    case "2":
      return (a, b) => a.name.last.localeCompare(b.name.last);
    case "3":
      return (a, b) => a.gender.localeCompare(b.gender);
    case "4":
      return (a, b) => b.gender.localeCompare(a.gender);
    case "5":
      return (a, b) =>
        a.gender.localeCompare(b.gender) ||
        b.name.last.localeCompare(a.name.last);
    case "6":
      return (a, b) =>
        a.gender.localeCompare(b.gender) ||
        a.name.last.localeCompare(b.name.last);
    case "7":
      return (a, b) =>
        b.gender.localeCompare(a.gender) ||
        b.name.last.localeCompare(a.name.last);
    case "8":
      return (a, b) =>
        b.gender.localeCompare(a.gender) ||
        a.name.last.localeCompare(b.name.last);
    default:
      !selectedDefault;
      filtersBySearch(searchValue);
  }
}
