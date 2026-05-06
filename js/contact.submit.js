document.getElementById('generalEnquiryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const turnstileResponse = turnstile.getResponse(); 

    if (!turnstileResponse) {
        alert("Please complete the security check.");
        return;
    }

    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    jsonData['cf-turnstile-response'] = turnstileResponse;

    delete jsonData.topic;
    const topicValue = document.getElementById('topic').value.trim();
    if (topicValue !== "") {
        jsonData.message = " ~ " + topicValue + " ~ " + jsonData.message;
    }

    const jsonString = JSON.stringify(jsonData);

    fetch('https://rrj6fb2ec4.execute-api.ap-southeast-2.amazonaws.com/prod/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.success-message').style.display = 'block';
        document.querySelector('.error-message').style.display = 'none';
        document.getElementById('generalEnquiryForm').reset();
        
        turnstile.reset();

        setTimeout(() => {
            document.querySelector('.success-message').style.display = 'none';
        }, 5000);
    })
    .catch((error) => {
        document.querySelector('.success-message').style.display = 'none';
        document.querySelector('.error-message').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.error-message').style.display = 'none';
        }, 5000);
    });
});