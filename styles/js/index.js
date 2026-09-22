// On récupère la navbar via son ID
  const navbar = document.querySelector(".navbar");
  const navbarText = document.querySelector(".nav-text");

  // On écoute le défilement de la page
  window.addEventListener('scroll', () => {
    
    // Si on a scrollé de plus de 50 pixels vers le bas
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbarText.classList.add('scrolled'); // On ajoute le nouveau style
    } else {
      navbar.classList.remove('scrolled');
      navbarText.classList.remove('scrolled'); // Sinon on l'enlève
    }
    
  });

const Carousel = (() => {
    const getActiveSlide = () =>
        document.querySelector(".carousel__slide.active");
    const getFirstSlide = () =>
        document.querySelector(".carousel__slider").firstElementChild;
    const getLastSlide = () =>
        document.querySelector(".carousel__slider").lastElementChild;

    const getSiblingSlide = (slide, direction) =>
        direction === "prev"
            ? slide.previousElementSibling
            : slide.nextElementSibling;

    const getNewActiveSlide = (key, activeSlide) => {
        const actions = {
            Home: getFirstSlide,
            End: getLastSlide,
            ArrowLeft: () => getSiblingSlide(activeSlide, "prev"),
            ArrowRight: () => getSiblingSlide(activeSlide, "next")
        };
        return actions[key]?.() || null;
    };

    const updateScreen = (activeSlide) => {
        const carouselScreen = document.querySelector(".image-display .screen");
        const img = activeSlide.querySelector("img").cloneNode(true);
        carouselScreen.innerHTML = "";
        carouselScreen.appendChild(img);
    };

    const scrollToActiveSlide = (activeSlide) => {
        const carouselSlider = document.querySelector(".carousel__slider");
        const { offsetLeft, offsetWidth } = activeSlide;
        const { clientWidth } = carouselSlider;

        carouselSlider.scrollTo({
            left: offsetLeft - clientWidth / 2 + offsetWidth / 2,
            behavior: "smooth"
        });
    };

    const updateActiveSlideClass = (activeSlide) => {
        document
            .querySelectorAll(".carousel__slide.active")
            .forEach((slide) => slide.classList.remove("active"));
        activeSlide.classList.add("active");
    };

    const updateCarousel = (activeSlide) => {
        updateActiveSlideClass(activeSlide);
        updateScreen(activeSlide);
        scrollToActiveSlide(activeSlide);
        updateButtonStates(activeSlide);
    };

    const updateButtonStates = (activeSlide) => {
        const prevButton = document.querySelector(".carousel__btn.prev");
        const nextButton = document.querySelector(".carousel__btn.next");

        prevButton.disabled = !getSiblingSlide(activeSlide, "prev");
        nextButton.disabled = !getSiblingSlide(activeSlide, "next");
    };

    const handleKeydown = (e) => {
        if (!e.target.closest(".carousel__slider")) return;
        const activeSlide = getActiveSlide();
        const newActiveSlide = getNewActiveSlide(e.key, activeSlide);

        if (newActiveSlide) {
            e.preventDefault();
            updateCarousel(newActiveSlide);
        }
    };

    const handleButtonClick = (e) => {
        const activeSlide = getActiveSlide();
        const newActiveSlide = getSiblingSlide(
            activeSlide,
            e.currentTarget.classList.contains("prev") ? "prev" : "next"
        );

        if (newActiveSlide) {
            updateCarousel(newActiveSlide);
        }
    };

    const handleCarouselClick = (e) => {
        const clickedSlide = e.target.closest(".carousel__slide");
        if (clickedSlide) {
            updateCarousel(clickedSlide);
        }
    };

    const initCarousel = () => {
        const carouselSlider = document.querySelector(".carousel__slider");
        const prevButton = document.querySelector(".carousel__btn.prev");
        const nextButton = document.querySelector(".carousel__btn.next");

        updateCarousel(getFirstSlide());

        document.addEventListener("keydown", handleKeydown);
        prevButton.addEventListener("click", handleButtonClick);
        nextButton.addEventListener("click", handleButtonClick);
        carouselSlider.addEventListener("click", handleCarouselClick);
    };

    initCarousel();
})();


new Chart(document.getElementById("budgetChart"), {
    type: "doughnut",

    data: {
        labels: [
            "Réception Sponsors",
            "Assurance",
            "Services banquaires",
            "Logement",
            "Don association",
            "Logistique ascension",
            "Location matériel",
            "Compagnie des guides"
        ],

        datasets: [{
            data: [200, 200, 100, 700, 1000, 300, 700, 20000],
        }]
    },

    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return `${context.label} : ${value} €`;
                    }
                }
            }
        }
    }
});

new Chart(document.getElementById("sourceChart"), {
    type: "doughnut",

    data: {
        labels: [
            "Subventions",
            "Sponsoring et dons",
            "Ventes"
        ],

        datasets: [{
            data: [2000, 21000, 200],
        }]
    },

    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return `${context.label} : ${value} €`;
                    }
                }
            }
        }
    }
});

// ----- ENVOYER UN MESSAGE -----

document
  .getElementById("send-btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("mail");
    const messageField = document.getElementById("message");
    const sendBtn = document.getElementById("send-btn");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !message) {
      alert("Merci de remplir tous les champs avant d’envoyer.");
      return;
    }

    const formspreeUrl = "https://formspree.io/f/xdazzzev";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    sendBtn.textContent = "Envoi...";
    sendBtn.style.opacity = "0.5";
    sendBtn.disabled = true;

    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("C'est envoyé ! Merci Robin te répondra bientôt.");
        nameField.value = "";
        emailField.value = "";
        messageField.value = "";
      } else {
        alert("Oups ! Un problème est survenu. Vérifie ton email.");
      }
    } catch (error) {
      alert("Erreur de connexion. Vérifie ton réseau.");
    } finally {
      sendBtn.textContent = "Envoyer";
      sendBtn.style.opacity = "1";
      sendBtn.disabled = false;
    }
  });