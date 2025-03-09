const navlinks = document.querySelectorAll("header nav a");
const logolink = document.querySelector(".logo");
const sections = document.querySelectorAll("section");

const activePage = () => {
  const barsBox = document.querySelector(".bars-box");
  const header = document.querySelector("header");

  header.classList.remove("active");
  setTimeout(() => {
    header.classList.add("active");
  }, 1100);

  navlinks.forEach((link) => {
    link.classList.remove("active");
  });

  barsBox.classList.remove("active");
  setTimeout(() => {
    barsBox.classList.add("active");
  }, 1100);

  sections.forEach((section) => {
    section.classList.remove("active");
  });
};

navlinks.forEach((link, idx) => {
  link.addEventListener("click", () => {
    if (!link.classList.contains("active")) {
      activePage();

      link.classList.add("active");

      setTimeout(() => {
        sections[idx].classList.add("active");
      }, 1100);
    }
  });
});

logolink.addEventListener("click", () => {
  if (!navlinks[0].classList.contains("active")) {
    activePage();

    navlinks[0].classList.add("active");

    setTimeout(() => {
      sections[0].classList.add("active");
    }, 1100);
  }
});

const resumeBtns = document.querySelectorAll(".resume-btn");

resumeBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const resumeDetails = document.querySelectorAll(".resume-detail");

    resumeBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");

    resumeDetails.forEach((detail) => {
      detail.classList.remove("active");
    });
    resumeDetails[idx].classList.add("active");
  });
});

logolink.addEventListener("click", () => {
  if (!navlinks[0].classList.contains("active")) {
    activePage();

    navlinks[0].classList.add("active");

    setTimeout(() => {
      sections[0].classList.add("active");
    }, 1100);
  }
});

const arrowright = document.querySelector(
  "portfolio-box . navigation .arrow-right"
);
const arrowleft = document.querySelector(
  "portfolio-box . navigation .arrow-left"
);
