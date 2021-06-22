import refs from "./refs.js";

const changeStyle = {
  changePath(e) {
    this.querySelector("[data-filter-path]").classList.toggle("is-open");
    this.nextElementSibling.classList.toggle("visually-hidden");
  },

  addStyle(elem, style) {
    elem.classList.add(style);
  },

  removeStyle(elem, style) {
    elem.classList.remove(style);
  },

  changeStylePagination(currentPage, totalPages) {
    const currentActiveLink = document.querySelector(
      ".pagination__item.active"
    );

    currentActiveLink && currentActiveLink.classList.remove("active");

    if (currentPage > 1) {
      this.removeStyle(refs.startStep, "pagination-state--disabled");
      this.removeStyle(refs.prevStep, "pagination-state--disabled");
    } else {
      this.addStyle(refs.startStep, "pagination-state--disabled");
      this.addStyle(refs.prevStep, "pagination-state--disabled");
    }

    if (+currentPage === totalPages) {
      this.addStyle(refs.nextStep, "pagination-state--disabled");
      this.addStyle(refs.endStep, "pagination-state--disabled");
    } else {
      this.removeStyle(refs.nextStep, "pagination-state--disabled");
      this.removeStyle(refs.endStep, "pagination-state--disabled");
    }
  },
};

window.addEventListener("keydown", function (e) {
  if (e.code === "Escape") {
    changeStyle.addStyle(document.body, "modal-open");
    changeStyle.addStyle(refs.backdrop, "is-hidden");
    changeStyle.addStyle(refs.filter, "mobile-is-hidden");
    changeStyle.addStyle(refs.backdrop, "is-hidden");
  }
});

window.addEventListener("click", function (e) {
  if (e.target === refs.btnOpenContent) {
    changeStyle.removeStyle(refs.filter, "mobile-is-hidden");
    changeStyle.removeStyle(refs.backdrop, "is-hidden");
  }

  if (e.target.parentNode === refs.btnCloseFilter) {
    changeStyle.addStyle(refs.filter, "mobile-is-hidden");
    changeStyle.addStyle(refs.backdrop, "is-hidden");
  }

  if (e.target === refs.backdrop) {
    changeStyle.addStyle(refs.filter, "mobile-is-hidden");
    changeStyle.addStyle(refs.backdrop, "is-hidden");
  }
});

export default changeStyle;
