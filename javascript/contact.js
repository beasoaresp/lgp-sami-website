const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let res = await response.json();
        if (response.status == 200) {
            // Success
            result.style.color = "var(--accent-cyan)";
            result.innerText = "Thank you! Your message has been sent successfully.";
            form.reset();
        } else {
            console.log(response);
            result.style.color = "#DC554E";
            result.innerText = res.message;
        }
    })
    .catch(error => {
        console.log(error);
        result.style.color = "#DC554E";
        result.innerText = "Something went wrong. Please try again later.";
    })
    .then(() => {
        submitBtn.innerText = "Submit";
        submitBtn.disabled = false;
        result.style.display = "block";
        
        setTimeout(() => {
            result.style.display = "none";
        }, 5000);
    });
});