$(document).ready(function() {
    $("#registeration_form").submit(function(form){
        if($("#password").val() != $("#rpassword").val()){
          $("#password_err").text("*Passwords do not match!");
          form.preventDefault();
        }
    });
});
