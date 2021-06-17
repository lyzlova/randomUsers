import refs from "./refs.js";

export default {
  makeUserCard({
    picture,
    name,
    gender,
    phone,
    email,
    location,
    dob,
    registered,
  }) {
    const dateBirthday = new Date(dob.date).toLocaleDateString();
    const dateRegistered = new Date(registered.date).toLocaleDateString();

    return refs.user.innerHTML
      .replace(/{{hrefImg}}/gi, picture.large)
      .replace(/{{lastName}}/, name.last)
      .replace(/{{firstName}}/, name.first)
      .replace(/{{gender}}/, gender)
      .replace(/{{phone}}/gi, phone)
      .replace(/{{email}}/gi, email)
      .replace(/{{state}}/, location.state)
      .replace(/{{city}}/, location.city)
      .replace(/{{street}}/, location.street.name)
      .replace(/{{birthday}}/, dateBirthday)
      .replace(/{{registered}}/, dateRegistered);
  },

  replaceMurkup(users) {
    const usersMarkUp = users.map(this.makeUserCard).join("");

    refs.usersContainer.insertAdjacentHTML("beforeend", usersMarkUp);
  },

  makeStatistics(
    female,
    male,
    users,
    dominantGender,
    createNationalityList
  ) {
    return refs.statisticTemplate.innerHTML
      .replace(/{{users}}/, users.length)
      .replace(/{{female}}/, female.length)
      .replace(/{{male}}/, male.length)
      .replace(/{{dominantGender}}/, dominantGender)
      .replace(/{{nationality}}/, createNationalityList);
  },

  createPagePaginationMarkUp(content, cls = "") {
    return `<a href="#" class="pagination__item ${cls}" data-page="${content}">${content}</a>`;
  },
};
