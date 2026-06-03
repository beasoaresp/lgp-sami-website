const Members = document.querySelectorAll(".team-departments");

const observerConfig = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
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
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});