document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    
    if (burgerMenu && mobileNavOverlay) {
        
        burgerMenu.addEventListener('click', () => {
            
            burgerMenu.classList.toggle('open');
            mobileNavOverlay.classList.toggle('open');
            
            
            if (burgerMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('open');
                mobileNavOverlay.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
});

// --- 1. INJECTION DE LA CONFIGURATION (Variables) ---
document.addEventListener("DOMContentLoaded", () => {
    // Injection des Textes
    document.querySelectorAll('[data-text]').forEach(element => {
        const key = element.getAttribute('data-text');
        if (ambConfig[key]) {
            element.innerHTML = ambConfig[key];
        }
    });

    // Injection des Liens (href)
    document.querySelectorAll('[data-link]').forEach(element => {
        const key = element.getAttribute('data-link');
        if (ambConfig[key]) {
            element.href = ambConfig[key];
        }
    });
});

// --- 2. NAVBAR SCROLL ---
const navbar = document.querySelector(".navbar");
const navbarText = document.querySelector(".nav-text");
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbarText.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
        navbarText.classList.remove('scrolled');
    }
});

// --- 3. CARROUSEL ---
const Carousel = (() => {
    const getActiveSlide = () => document.querySelector(".carousel__slide.active");
    const getFirstSlide = () => document.querySelector(".carousel__slider").firstElementChild;
    const getLastSlide = () => document.querySelector(".carousel__slider").lastElementChild;
    const getSiblingSlide = (slide, direction) => direction === "prev" ? slide.previousElementSibling : slide.nextElementSibling;
    
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
        carouselSlider.scrollTo({ left: offsetLeft - clientWidth / 2 + offsetWidth / 2, behavior: "smooth" });
    };

    const updateCarousel = (activeSlide) => {
        document.querySelectorAll(".carousel__slide.active").forEach((slide) => slide.classList.remove("active"));
        activeSlide.classList.add("active");
        updateScreen(activeSlide);
        scrollToActiveSlide(activeSlide);
        document.querySelector(".carousel__btn.prev").disabled = !getSiblingSlide(activeSlide, "prev");
        document.querySelector(".carousel__btn.next").disabled = !getSiblingSlide(activeSlide, "next");
    };

    const initCarousel = () => {
        updateCarousel(getFirstSlide());
        document.addEventListener("keydown", (e) => {
            if (!e.target.closest(".carousel__slider")) return;
            const newActiveSlide = getNewActiveSlide(e.key, getActiveSlide());
            if (newActiveSlide) { e.preventDefault(); updateCarousel(newActiveSlide); }
        });
        document.querySelectorAll(".carousel__btn").forEach(btn => btn.addEventListener("click", (e) => {
            const newActiveSlide = getSiblingSlide(getActiveSlide(), e.currentTarget.classList.contains("prev") ? "prev" : "next");
            if (newActiveSlide) updateCarousel(newActiveSlide);
        }));
        document.querySelector(".carousel__slider").addEventListener("click", (e) => {
            const clickedSlide = e.target.closest(".carousel__slide");
            if (clickedSlide) updateCarousel(clickedSlide);
        });
    };
    initCarousel();
})();

// --- 4. GRAPHIQUES (Chart.js) ---
new Chart(document.getElementById("budgetChart"), {
    type: "doughnut",
    data: {
        labels: ["Réception Sponsors", "Assurance", "Services banquaires", "Logement", "Don association", "Logistique ascension", "Location matériel", "Compagnie des guides"],
        datasets: [{ data: [200, 200, 100, 700, 1000, 300, 700, 20000] }]
    },
    options: { plugins: { tooltip: { callbacks: { label: context => `${context.label} : ${context.raw} €` } } } }
});

new Chart(document.getElementById("sourceChart"), {
    type: "doughnut",
    data: { labels: ["Subventions", "Sponsoring et dons", "Ventes"], datasets: [{ data: [2000, 21000, 200] }] },
    options: { plugins: { tooltip: { callbacks: { label: context => `${context.label} : ${context.raw} €` } } } }
});

// --- 5. ENVOI DU FORMULAIRE ---
document.getElementById("send-btn").addEventListener("click", async function (e) {
    e.preventDefault();
    const nameField = document.getElementById("name"), emailField = document.getElementById("mail"), messageField = document.getElementById("message"), sendBtn = document.getElementById("send-btn");
    if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
        alert("Merci de remplir tous les champs avant d’envoyer.");
        return;
    }
    const formData = new FormData();
    formData.append("name", nameField.value.trim());
    formData.append("email", emailField.value.trim());
    formData.append("message", messageField.value.trim());

    sendBtn.textContent = "Envoi...";
    sendBtn.style.opacity = "0.5";
    sendBtn.disabled = true;

    try {
        const response = await fetch("https://formspree.io/f/mppwdgdk", { method: "POST", body: formData, headers: { Accept: "application/json" } });
        if (response.ok) {
            alert("C'est envoyé ! Merci, AMB vous répondra bientôt.");
            nameField.value = ""; emailField.value = ""; messageField.value = "";
        } else {
            alert("Oups ! Un problème est survenu. Vérifiez votre email.");
        }
    } catch (error) {
        alert("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
        sendBtn.textContent = "Envoyer";
        sendBtn.style.opacity = "1";
        sendBtn.disabled = false;
    }
});