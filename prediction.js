const token = getCookie('token');
const ip = getCookie('ip');

if (!token || !ip) {
    alert('Authorization token or IP is missing.');
}

$('#predict').on('submit', function(e) {
    e.preventDefault();
    const data = {
        gender: parseInt($('input[name="gender"]:checked').val(), 10), // Gender from radio buttons
        age: parseInt($('#age').val(), 10), // Age from input
        hypertension: parseInt($('input[name="hypertension"]:checked').val(), 10), // Hypertension from radio buttons
        heart_disease: parseInt($('input[name="heartDisease"]:checked').val(), 10), // Heart disease from radio buttons
        ever_married: parseInt($('input[name="everMarried"]:checked').val(), 10), // Ever married from radio buttons
        work_type: $('#workType').val(), // Work type from select
        residence_type: $('#residenceType').val(), // Residence type from select
        avg_glucose_level: parseFloat($('#avgGlucoseLevel').val()), // Avg glucose level from input
        bmi: parseFloat($('#bmi').val()), // BMI from input
        smoking_status: $('#smokingStatus').val(), // Smoking status from select
        stroke_prediction: "0", // Default value
        risk_percentage: "0", // Default value
        message: "0" // Default value
    };
    

    console.log(data);
    $.ajax({
        url: `${ip}/api/user/predict/`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            alert('Prediction submitted successfully!');
            $('#predict')[0].reset();
            fetchPredictions(); // Ensure this updates the DataTable properly
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


$(document).ready(function() {
    fetchPredictions(); // Call this function to load the predictions initially
});

function fetchPredictions() {
    $('#predictions').DataTable({
        ajax: {
            url: `${ip}/api/user/predict/`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            dataSrc: '',
        },
        columns: [
            {
                data: 'gender',
                render: function(data) {
                    return data === 1 ? 'Male' : 'Female'; // Convert gender value
                }
            },
            { data: 'age' },
            {
                data: 'hypertension',
                render: function(data) {
                    return data === 1 ? 'Yes' : 'No'; // Convert hypertension value
                }
            },
            {
                data: 'heart_disease',
                render: function(data) {
                    return data === 1 ? 'Yes' : 'No'; // Convert heart disease value
                }
            },
            {
                data: 'ever_married',
                render: function(data) {
                    return data === 1 ? 'Married' : 'Single'; // Convert marital status
                }
            },
            { data: 'work_type' },
            { data: 'residence_type' },
            { data: 'avg_glucose_level' },
            { data: 'bmi' },
            { data: 'smoking_status' },
            { data: 'stroke_prediction' },
            {
                data: 'message',
                render: function(data) {
                    return `<textarea readonly style="width:200px; height: 50px;">${data}</textarea>`;
                }
            },
            { data: 'risk_percentage' },
            {
                data: 'created_at',
                render: function(data) {
                    return new Date(data).toLocaleString(); // Format the date
                }
            }
        ],
        destroy: true // Allow reinitialization of the DataTable
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
