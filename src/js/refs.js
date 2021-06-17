export default {
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
  allCheckbox: [...document.querySelectorAll('input[type="checkbox"]')],
  paginationList: document.querySelector(".pagination__list"),
  startStep: document.querySelector("#first-step"),
  endStep: document.querySelector("#last-step"),
  prevStep: document.querySelector("#prev-step"),
  nextStep: document.querySelector("#next-step"),
  selectPerPage: document.querySelector("#view-control"),
};
