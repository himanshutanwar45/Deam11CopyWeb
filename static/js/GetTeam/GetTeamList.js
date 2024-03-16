
var team_id = ""
function CloseSignUp() {
    let divopen = document.getElementById('modal-container')
    divopen.style.display = 'none';
}

function CloseSignUp_Player() {
    let divopen = document.getElementById('modal-container-player-info')
    divopen.style.display = 'none';
}

$('#loader-container').fadeOut();


function GetAllTeamList() {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            $.ajax({
                url: '/GetTeams/GetTeamList',
                type: 'GET',
                success: function (response) {
                    //console.log(response)
                    let data = response.data;
                    $("#packs-card-container").empty();
                    $.each(data, function (index, row) {
                        let pack_card_detail =
                            '<div class="pack-card-content">' +
                                '<div class="pack-card-left-section">' +
                                    '<div class="pack-card-details">' +
                                        '<div class="pack-card-detail">' +
                                            '<h4 class="pack-card-heading">' + row.Team_Code + '</h4>' +
                                        '</div>' +
                                        '<div class="pack-card-detail">' +
                                            '<h4 class="pack-card-heading">' + row.Team_Name + '</h4>' +
                                        '</div>' +
                                        '<div class="pack-card-detail image-attachment">' +
                                            '<img class="pack-card-heading-img" src="data:image/png;base64,' + row.Images + '" />' +
                                        
                                            // '<div style="margin-left:100px">' +
                                            //     '<img id="image_id-' + index + '" class="pack-card-attach" src="data:image/png;base64,' + attachment_data + '" id="image_attach"/>' +
                                            //     '<input type="file" id="fileInput-' + row.Team_Id + '" accept="image/*" style="display:none;" name="fileInput-' + row.Team_Id + '"> ' +
                                            // '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="pack-card-right-section">' +
                                    '<button class="btn btn-outline-danger" id="buttonComponent-' + index + '">Get</button>' +
                                '</div>' +
                                '<div class="pack-card-right-section" style="margin-left:15px;"> ' +
                                    '<button class="btn btn-outline-danger" id="playerAPI-' + index + '">+</button>' +
                                '</div>' +
                            '</div>' 
                        $("#packs-card-container").append(pack_card_detail)

                        // let image_id_button = "image_id-" + index;
                        // let file_input_button = "fileInput-" + row.Team_Id

                        // $(document).ready(function () {
                        //     $("#" + image_id_button).click(function () {

                        //         $("#" + file_input_button).click();
                        //     });

                        //     // Handle file input change
                        //     $("#" + file_input_button).change(function () {
                        //         team_id = row.Team_Id
                        //         var photo = 'fileInput-' + team_id
                        //         var fileInput = document.getElementById(photo);

                        //         // Check if any file is selected
                        //         if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                        //             alert('No file selected.');
                        //             return;
                        //         }

                        //         var files = fileInput.files;
                        //         let formData = new FormData();
                        //         formData.append('team_id', team_id);
                        //         formData.append('tp', "0");

                        //         for (var i = 0; i < files.length; i++) {
                        //             formData.append('fileInput', files[i]);
                        //         }

                        //         $.ajax({
                        //             url: '/GetTeams/Team_Flag',
                        //             type: 'POST',
                        //             data: formData,
                        //             contentType: false,
                        //             processData: false,
                        //             beforeSend: function () {
                        //                 $('#loader-container').fadeIn();
                        //             },
                        //             success: function (response) {
                        //                 $.each(response, function (index, row) {
                        //                     //Error_Name = row.Error_Name;
                        //                     //alert(Error_Name)
                        //                     GetAllTeamList()
                        //                     $('#loader-container').fadeOut();
                        //                 })
                        //             }
                        //         });

                        //         //console.log(team_id)
                        //     });
                        // });

                        let buttonid = "buttonComponent-" + index;
                        $("#" + buttonid).click(function (event) {
                            event.preventDefault();
                            team_id = row.Team_Id

                            window.location.href = '/GetTeams/TeamList/PlayerList?team_id=' + team_id;
                        })

                        let playerAPI = "playerAPI-" + index;
                        $("#" + playerAPI).click(function () {
                            let new_team_id = row.Team_Id
                            //console.log(new_team_id)
                            let FormData = {
                                team_id: new_team_id
                            }
                            $.ajax({
                                url: '/GetTeams/AddPlayer',
                                type: 'POST',
                                data: FormData,
                                beforeSend:function(){
                                    $('#loader-container').fadeIn();
                                },
                                success: function (response) {
                                    //console.log(response)
                                    Error_Code = response.ErrorCode;
                                    Error_Name = response.Error_Name;
                                    let body = 
                                        '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
                                        '<strong id="msg-alert">'+Error_Name+'</strong>'+
                                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                                        '</div>'
                                    $("#header-msg").append(body)
                                    $('#loader-container').fadeOut();
                                }
                            })
                        })

                    })
                    $('#loader-container').fadeOut();
                }
            })

            allfields = true;
        }

    }, 100);
}

GetAllTeamList();


let image_id = 1
let attachment_data = ""

function Get_Attachment() {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            let FormData = {
                image_id: image_id
            }
            $.ajax({
                url: '/Attachment',
                type: 'POST',
                data: FormData,
                success: function (response) {
                    $.each(response, function (index, row) {
                        attachment_data = row.text;
                        //console.log(attachment_data)
                    })
                }
            })

            allfields = true;
        }

    }, 0);

}

Get_Attachment();

$(document).ready(function () {
    $("#Update").click(function (event) {
        event.preventDefault()

        let FormData = {
            json_type: "Add_Teams"
        }

        $.ajax({
            url: '/GetTeams/NewTeam',
            type: 'POST',
            data: FormData,
            beforeSend: function () {
                $('#loader-container').fadeIn();
            },
            success: function (response) {
                let Error_Name = response.Error_Name;
                let body = 
                '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
                '<strong id="msg-alert">'+Error_Name+'</strong>'+
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                '</div>'
                $("#header-msg").append(body)
                $('#loader-container').fadeOut();
                GetAllTeamList();
            }
        })
        //$('#loader-container').fadeIn();
    })
})


