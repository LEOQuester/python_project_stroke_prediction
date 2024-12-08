let token = '';
const ip = 'http://192.168.182.250:8000'; // Updated to use const for better practice
document.cookie = `ip=${ip}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
$(document).ready(function() {
    $('#predictions').DataTable();

    $('#register').on('submit', function(e) {
        e.preventDefault();
        
        const data = {
            "username": $('#regUsername').val(),
            "email": $('#regEmail').val(),
            "phone_number": $('#regPhone').val(),
            "password": $('#regPassword').val(),
        };
        
        console.log(JSON.stringify(data));  // Log the JSON to the console for verification
        
        $.ajax({
            url: `${ip}/api/user/register/`, // Correctly using the 'ip' variable
            type: 'POST',
            contentType: 'application/json', // Set the content type to application/json
            data: JSON.stringify(data), // Stringify the data to JSON format
            success: function(response) {
                alert('Registration successful! You can log in now.');
                $('#register')[0].reset(); // Reset the form
            },
            error: function(jqXHR) {
                // Handle the error based on the response format
                let errorMessage = '';
        
                try {
                    // If the error response is JSON, access it using responseJSON
                    const errorResponse = jqXHR.responseJSON || JSON.parse(jqXHR.responseText);
                    errorMessage = errorResponse.message || 'An unexpected error occurred.';
                } catch (e) {
                    // In case the error response is not JSON, show a general error message
                    errorMessage = 'An unexpected error occurred. Please try again later.';
                }
        
                alert(errorMessage); // Show the error message to the user
            }
        });
    });



    $('#login').on('submit', function(e) {
        e.preventDefault();

        const identifier = $('#loginIdentifier').val(); // Get identifier from the input
        const password = $('#loginPassword').val(); // Get password from the input

        const data = {
            identifier: identifier, // Create an object with 'identifier'
            password: password // Include the password
        };
        console.log(data)
        console.log(JSON.stringify(data)); // Log the JSON object for verification
        var address = `${ip}/api/user/login/`
        $.ajax({
            url: address, // Use the variable for the endpoint
            type: 'POST',
            contentType: 'application/json', // Indicate JSON format
            data: JSON.stringify(data), // Send the data as a JSON string
            success: function(response) {
                token = response.access; // Store the received token
                document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
                alert('Login successful!'); // Notify the user of success
                $('#login')[0].reset(); // Reset the form fields
                window.location.href = 'prediction.html';
            },
            error: function(jqXHR) {
                // Handle the error based on the response format
                let errorMessage = '';
        
                try {
                    // If the error response is JSON, access it using responseJSON
                    const errorResponse = jqXHR.responseJSON || JSON.parse(jqXHR.responseText);
                    errorMessage = errorResponse.message || 'An unexpected error occurred.';
                } catch (e) {
                    // In case the error response is not JSON, show a general error message
                    errorMessage = 'An unexpected error occurred. Please try again later.';
                }
        
                alert(errorMessage); // Show the error message to the user
            }
        });
    });


    
});