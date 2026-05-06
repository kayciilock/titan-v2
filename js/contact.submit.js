document.getElementById('generalEnquiryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // --- TURNSTILE BYPASS START ---
    const turnstileResponse = turnstile.getResponse(); 

    if (!turnstileResponse) {
        alert("Please complete the security check.");
        return;
    }

    // --- TURNSTILE BYPASS END ---

    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    jsonData['cf-turnstile-response'] = turnstileResponse;

    // --- TOPIC CRASH FIX ---
    // This checks if the element exists before trying to read '.value'
    const topicElement = document.getElementById('topic');
    if (topicElement) {
        const topicValue = topicElement.value.trim();
        delete jsonData.topic;
        if (topicValue !== "") {
            jsonData.message = " ~ " + topicValue + " ~ " + (jsonData.message || "");
        }
    } else {
        console.warn("Element with ID 'topic' not found. Skipping topic formatting.");
    }

    const jsonString = JSON.stringify(jsonData);

    // Useful for debugging: see what you are actually sending to AWS
    console.log("Payload being sent:", jsonString);

    fetch('https://rrj6fb2ec4.execute-api.ap-southeast-2.amazonaws.com/prod/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        document.querySelector('.success-message').style.display = 'block';
        document.querySelector('.error-message').style.display = 'none';
        document.getElementById('generalEnquiryForm').reset();
        
        // turnstile.reset(); // Commented out while Turnstile is disabled

        setTimeout(() => {
            document.querySelector('.success-message').style.display = 'none';
        }, 5000);
    })
    .catch((error) => {
        console.error("Submission error:", error);
        document.querySelector('.success-message').style.display = 'none';
        document.querySelector('.error-message').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.error-message').style.display = 'none';
        }, 5000);
    });
});