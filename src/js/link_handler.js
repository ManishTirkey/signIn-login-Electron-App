window.addEventListener("load", () => {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.Links.open(link.href);
    });
  });
});
