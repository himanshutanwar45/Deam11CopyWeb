
$('#loader-container').fadeOut();


var passwordInput = document.getElementById('Pass');
var confirmPasswordInput = document.getElementById('ConPass');
var passwordError = document.getElementById('PassCheck');

function validatePassword() {
    if (passwordInput.value == confirmPasswordInput.value) 
    {
        passwordError.innerHTML = 'Correct Password';
        passwordError.style.color="green";

    } else {
        passwordError.innerHTML = 'InCorrect Password';
        passwordError.style.color="red";
    }
}

confirmPasswordInput.addEventListener('keyup', validatePassword);
passwordInput.addEventListener('keyup', validatePassword);

function IsAdminFn(event) {
    event.preventDefault();
    var IsAdmin = document.getElementById("IsAdmin").value;

    if (IsAdmin == 'Y') {
        document.getElementById("EmpCode").disabled = false;
        document.getElementById("IsAdmin1").disabled = false;
        document.getElementById("Days").disabled = false;
        console.log(IsAdmin)
    }
}


$(document).ready(function () {
    $('#Add').click(function (event) {
        event.preventDefault();
        var data = {
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            email: $('#email').val(),
            Pass: $('#Pass').val(),
            ConPass: $('#ConPass').val(),
        };
        $.ajax({
            url: '/Admin/AddUsers',
            type: 'POST',
            data: data,
            beforeSend:function(){
                $('#loader-container').fadeIn();
            },
            success: function (data) {
                var ErrorCode = data.Error_Code;
                var ErrorName = data.Error_Name;
                //console.log("ErrorCode: " + ErrorCode);
                //console.log("ErrorName: " + ErrorName);
                // Display the result to the user
                // You can modify the code below to display the result in your webpage
                if (ErrorCode == "1") {
                    alert(ErrorName);
                }
                else if ((ErrorCode == "0")) {
                    alert(ErrorName);
                    $('#fname').val('');
                    $('#lname').val('');
                    $('#email').val('');
                    $('#Pass').val('');
                    $('#ConPass').val('');

                    // $(document).ready(function (event) {
                    //     $.ajax({
                    //         url: '/Employee/LastEmpCode',
                    //         type: 'GET',
                    //         success: function (data) {
                    //             var textbox_value = data; // Use the first value from the returned data
                    //             $('#EmpCode').val(textbox_value);
                    //         }
                    //     });
                    // });
                }
                else {
                    alert(ErrorName);
                }

                $('#loader-container').fadeOut();
            }
        });
    });
});


$(document).ready(function () {
    $('#Update').click(function (event) {
        event.preventDefault();
        var data = {
            email: $('#email').val(),
            Pass: $('#Pass').val(),
            ConPass: $('#ConPass').val(),
        };
        $.ajax({
            url: '/Admin/UpdatePassword',
            type: 'POST',
            data: data,
            beforeSend:function(){
                $('#loader-container').fadeIn();
            },
            success: function (data) {
                var ErrorCode = data.Error_Code;
                var ErrorName = data.Error_Name;
                //console.log("ErrorCode: " + ErrorCode);
                //console.log("ErrorName: " + ErrorName);
                // Display the result to the user
                // You can modify the code below to display the result in your webpage
                if (ErrorCode == "1") {
                    alert(ErrorName);
                }
                else if ((ErrorCode == "0")) {
                    alert(ErrorName);
                    $('#Pass').val('');
                    $('#ConPass').val('');

                    // $(document).ready(function (event) {
                    //     $.ajax({
                    //         url: '/Employee/LastEmpCode',
                    //         type: 'GET',
                    //         success: function (data) {
                    //             var textbox_value = data; // Use the first value from the returned data
                    //             $('#EmpCode').val(textbox_value);
                    //         }
                    //     });
                    // });
                }
                else {
                    alert(ErrorName);
                }
                $('#loader-container').fadeOut();
            }
        });
    });
});
