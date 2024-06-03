document.addEventListener('DOMContentLoaded', function() {
    var appointmentChart = document.getElementById('appointment-chart');

    // Sample appointment data (replace with actual data)
    var appointmentData = [
        { month: 'Jan', appointments: 5 },
        { month: 'Feb', appointments: 7 },
        { month: 'Mar', appointments: 10 },
        { month: 'Apr', appointments: 8 },
        { month: 'May', appointments: 6 },
        { month: 'Jun', appointments: 9 },
        { month: 'Jul', appointments: 12 },
        { month: 'Aug', appointments: 11 },
        { month: 'Sep', appointments: 8 },
        { month: 'Oct', appointments: 6 },
        { month: 'Nov', appointments: 7 },
        { month: 'Dec', appointments: 5 }
    ];

    // Create a bar chart for appointment schedule
    var appointmentChartHtml = '<h2>Appointment Schedule for Last 12 Months</h2>';
    appointmentChartHtml += '<div class="appointment-calendar">';
    for (var i = 0; i < appointmentData.length; i++) {
        appointmentChartHtml += '<div class="bar" style="height: ' + (appointmentData[i].appointments * 20) + 'px;">';
        appointmentChartHtml += '<span class="label">' + appointmentData[i].month + '</span>';
        appointmentChartHtml += '</div>';
    }
    appointmentChartHtml += '</div>';


    appointmentChart.innerHTML = appointmentChartHtml;
           // Sample data dictionary with categorical severity values
           const timeSeriesData = {
            "January 2023": "None or minimal",
            "February 2023": "Mild",
            "March 2023": "Moderate",
            "April 2023": "Severe",
            "May 2023": "Moderate",
            "June 2023": "Mild"
            // Add more months and severity values as needed
        };
        // let timeSeriesData = {};

        // Extract months and severity values from the data dictionary
        const months = Object.keys(timeSeriesData);
        const severityValues = Object.values(timeSeriesData);

        // Convert severity values to numerical values for Chart.js
        const severityMapping = {
            "None or minimal": 1,
            "Mild": 2,
            "Moderate": 3,
            "Severe": 4
        };
        const severityData = severityValues.map(value => severityMapping[value]);

        // Create a Chart.js radar chart
        const ctx = document.getElementById('severityRadarChart').getContext('2d');
        const severityRadarChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Depression Severity Progress',
                    data: severityData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                              type: 'line',
                              xMin: 'April 2023',
                              xMax: 'April 2023',
                              borderColor: 'rgb(255, 99, 132)',
                              borderWidth: 2,
                              borderDash: [5, 5],
                            }
                          }                    
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        filter: function (item, chart) {
                            return !item.text.includes('Depression Severity Progress');
                        }
                    }
                }
            }
        });
});
