
document.addEventListener("DOMContentLoaded", () => {
    // Alvos a animar
    const acronym = document.querySelector(".brand-info .acronym");
    const slogan = document.querySelector(".brand-info .slogan");
    const text = document.querySelector(".brand-info .text");
    const image = document.querySelector(".mockup-image");

    // Injeta a classe de visibilidade com um micro-atraso para o browser processar o estilo inicial
    setTimeout(() => {
        if (acronym) acronym.classList.add("reveal-visible");
        if (slogan) slogan.classList.add("reveal-visible");
        if (text) text.classList.add("reveal-visible");
        if (image) image.classList.add("reveal-visible");
    }, 150);
});

const Members = document.querySelectorAll(".team-departments");

const observerConfig = {
    threshold: 0.1,
    rootMargin: "0px 0px -200px 0px"
};

function animarEntrada(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("team_member_visible");
            observer.unobserve(entry.target);
        }
    });
}

const cardObserver = new IntersectionObserver(animarEntrada, observerConfig);

Members.forEach(card => {
    card.classList.add("team_member_hide");
    cardObserver.observe(card);
});










document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.classList.add("flipped");
    });

    card.addEventListener("mouseleave", () => {
        card.classList.remove("flipped");
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".license-tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // 1. Remove a classe activa de todos os botões
            tabs.forEach(btn => btn.classList.remove("active"));
            
            // 2. Esconde todos os blocos de conteúdo
            contents.forEach(content => content.classList.remove("active"));

            // 3. Ativa o botão atual
            tab.classList.add("active");

            // 4. Mostra o conteúdo correspondente baseado no atributo data-target
            const targetId = tab.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });
});