$(document).ready(function (){
    window.odometerOptions = {
        duration: 1.5 * 1000
    };
    setTimeout(function(){
        $('#number_of_heart_transplants').text("12");

        $('#number_of_kidney_transplants').text("12039");

        $('#number_of_lung_transplants').text("502");

        $('#number_of_intestine_transplants').text("348");
    }, 100);
});