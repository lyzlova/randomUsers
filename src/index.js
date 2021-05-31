import "./scss/index.scss";

const BASE_URL = "https://randomuser.me/api/";

const refs = {
  loadMore: document.querySelector("[data-load-more]"),
  usersContainer: document.querySelector("[data-users-container]"),
  user: document.querySelector("#user-template"),
  spiner: document.querySelector("[data-load-spiner]"),
  statistic: document.querySelector("#statistics"),
};

function getRandomUser(max) {
  return Math.floor(Math.random() * max);
}

refs.loadMore.addEventListener("click", onLoad);

function onLoad(e) {
  refs.spiner.classList.remove("is-hidden");
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
    replaceMurkup(users);
    getStatistics(users);
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
  const dateRegistered = new Date(registered.date);

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
    .replace(
      /{{birthday}}/,
      `${dateBirthday.getDate()}/${dateBirthday.getMonth()}/${dateBirthday.getFullYear()}`
    )
    .replace(
      /{{registered}}/,
      `${dateRegistered.getDate()}/${dateRegistered.getMonth()}/${dateRegistered.getFullYear()}`
    );
  refs.usersContainer.insertAdjacentHTML("afterbegin", replacedUser);
}

function getStatistics(users) {
  const female = users.filter((user) => user.gender === "female");
  const male = users.filter((user) => user.gender === "male");
  let dominantGender = "";

  female > male ? (dominantGender = "female") : (dominantGender = "male");

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
  return `<div>${key}: ${value}</div>`;
}

function clearCardesContainer() {
  refs.usersContainer.innerHTML = "";
}
