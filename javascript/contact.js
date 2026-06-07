const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the browser from leaving or refreshing the page
    
    // Change button text to show it's working
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Send data to Web3Forms in the background
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
            // Success! Show your custom message inside the website UI
            result.style.color = "var(--accent-cyan)";
            result.innerText = "Thank you! Your message has been sent successfully.";
            form.reset(); // Clears out the form inputs seamlessly
        } else {
            // Handle server errors cleanly
            console.log(response);
            result.style.color = "#DC554E";
            result.innerText = res.message;
        }
    })
    .catch(error => {
        // Handle network connection failures
        console.log(error);
        result.style.color = "#DC554E";
        result.innerText = "Something went wrong. Please try again later.";
    })
    .then(() => {
        // Reset button and show message container smoothly
        submitBtn.innerText = "Submit";
        submitBtn.disabled = false;
        result.style.display = "block";
        
        // Optional: Hide the success message automatically after 5 seconds
        setTimeout(() => {
            result.style.display = "none";
        }, 5000);
    });
});