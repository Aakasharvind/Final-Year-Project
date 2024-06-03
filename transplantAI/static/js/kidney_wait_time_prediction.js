let gauge_options = {
    angle: -0.15, 
    lineWidth: 0.23, 
    radiusScale: 1, 
    pointer: {
      length: 0.62, 
      strokeWidth: 0.068, 
      color: '#000000' 
    },
    limitMax: false,     
    limitMin: false,  
    staticZones: [
        {strokeStyle: "#a9d70b", min: 0, max: 6}, 
        {strokeStyle: "#FFDD00", min: 6, max: 12},
        {strokeStyle: "#F03E3E", min: 12, max: 18}  
    ],
    generateGradient: true,
    highDpiSupport: true,  
    renderTicks: {
      divisions: 5,
      divWidth: 1.1,
      divLength: 0.7,
      divColor: '#333333',
      subDivisions: 3,
      subLength: 0.5,
      subWidth: 0.6,
      subColor: '#666666'
    }
    
};

$(document).ready(function () {

    // var target = document.getElementById('prediction_result');
    // var gauge = new Gauge(target).setOptions(gauge_options); 
    // gauge.maxValue = 18; 
    // gauge.setMinValue(0); 
    // gauge.animationSpeed = 25; 
    // gauge.set(0);

    // Intercept the form submission
    $('#cox_input_form').submit(function (e) {
        // Prevent the default form submission
        e.preventDefault();

        // Get form data
        let coxInputParameters = {
            HLA_A1: $('#HLA_A1').val(),
            HLA_A2: $('#HLA_A2').val(),
            HLA_B1: $('#HLA_B1').val(),
            HLA_B2: $('#HLA_B2').val(),
            HLA_DR1: $('#HLA_DR1').val(),
            HLA_DR2: $('#HLA_DR2').val(),
            age_at_list_registration: $('#age_at_list_registration').val(),
            age_cat: $('#age_cat').val(),
            blood_gp: $('#blood_gp').val(),
            cPRA: $('#cPRA').val(),
            cPRA_cat: $('#cPRA_cat').val(),
            dialysis_duration: $('#dialysis_duration').val(),
            duration: $('#duration').val(),
            gender: $('#gender').val(),
            gestation: $('#gestation').val(),
            if_transplanted: $('#if_transplanted').val(),
            log_time_on_Dialysis: $('#log_time_on_Dialysis').val(),
            number_prior_transplant: $('#number_prior_transplant').val(),
            prior_transplant: $('#prior_transplant').val(),
            underlying_disease: $('#underlying_disease').val()
        };

        

        // Make a POST request
        $.post('/kidney_wait_time_prediction', coxInputParameters, function (response, status) {
            // if (status == "success")
            $('#wait_time_heading').text("Prediction").hide().show('normal');
            $('#cox_prediction').text(`Probable wait-time: ${response} months`).hide().show('normal');
            // gauge.set(response);

        });

    });



    $('#ckd_input_form').submit(function (e) {
        // Prevent the default form submission
        e.preventDefault();

        // Get form data
        let ckdInputParameters = {
            age: $('#age').val(),
            bp: $('#bp').val(),
            specific_gravity: $('#specific_gravity').val(),
            albumin: $('#albumin').val(),
            age_cat: $('#age_cat').val(),
            red_blood_cells: $('#red_blood_cells').val(),
            sugar: $('#sugar').val(),
            pus_cell: $('#pus_cell').val(),
            pus_cell_clumps: $('#pus_cell_clumps').val(),
            bacteria: $('#bacteria').val(),
            blood_glucose_random: $('#blood_glucose_random').val(),
            blood_urea: $('#blood_urea').val(),
            serum_creatinine: $('#serum_creatinine').val(),
            sodium: $('#sodium').val(),
            potassium: $('#potassium').val(),
            haemoglobin: $('#haemoglobin').val(),
            packed_cell_volume: $('#packed_cell_volume').val(),
            white_blood_cell_count: $('#white_blood_cell_count').val(),
            red_blood_cell_count: $('#red_blood_cell_count').val(),
            hypertension: $('#hypertension').val(),
            diabetes_mellitus: $('#diabetes_mellitus').val(),
            coronary_artery_disease: $('#coronary_artery_disease').val(),
            appetite: $('#appetite').val(),
            peda_edema: $('#peda_edema').val(),
            aanemia: $('#aanemia').val(),
            hypertension: $('#hypertension').val(),
            hypertension: $('#hypertension').val()

        };

        

        // Make a POST request
        $.post('/kidney_rejection_prediction', ckdInputParameters, function (response, status) {
            // if (status == "success")
            // $('#wait_time_heading').text("Prediction").hide().show('normal');
            $('#ckd_prediction').text(`${response}`).hide().show('normal');
            // gauge.set(response);

        });

    });


});