
var params = new URLSearchParams(window.location.search);
var team_id = params.get('team_id');

function Get_player_list_from_team() {
    let Form_Data = {
        team_id: team_id
    }

    $.ajax({
        url: '/GetTeams/GetTeamPlayer',
        type: 'POST',
        data: Form_Data,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (response) {
            //console.log(response)
            let data = response.data;
            console.log(data)
            $('#player_name tbody').empty()

            $.each(data, function (index, row) {
                let pack_card_detail =
                    '<div class="pack-card-content">' +
                    '<div class="pack-card-left-section">' +
                    '<div class="pack-card-details">' +
                    //1st
                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading" id="player_name_' + row.Player_Id + '" style="cursor:pointer;">' + row.Player_Name + '</h4>' +
                    '<h6 class="pack-card-sub-heading">' + row.Player_Id + '</h6>' +
                    '</div>' +

                    '<div class="pack-card-detail image-attachment">' +
                    '<img class="view-benefits-playerImage" src="'+ row.Image_URL + '" />' +

                    // '<div style="margin-left:170px">' +
                    // '<img id="image_id_players-' + index + '" class="pack-card-attach" src="data:image/png;base64,' + attachment_data + '"/>' +
                    // '<input type="file" id="fileInput_player-' + row.Player_Id + '" accept="image/*" style="display:none;" name="fileInput_player-' + row.Player_Id + '"> ' +
                    // '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pack-card-right-section">' +
                    '<button class="btn btn-outline-danger" id="aPI-' + index + '">+</button>' +
                    '</div>' +
                    '</div>'
                $('#packs-card-team-detail').append(pack_card_detail);

                let buttonid = "aPI-" + index;

                $("#" + buttonid).click(function () {
                    var player_id = row.Player_Id
                    Insert_Player_Info(player_id)
                })

                // let image_id_players = "image_id_players-" + index;
                // let fileInput_players = "fileInput_player-" + row.Player_Id

                // $(document).ready(function () {
                //     $("#" + image_id_players).click(function () {

                //         $("#" + fileInput_players).click();

                //     });

                //     $("#" + fileInput_players).change(function () {
                //         player_id = row.Player_Id
                //         team_id = row.Team_Id
                //         //console.log(team_id)
                //         var photo = 'fileInput_player-' + player_id
                //         var fileInput = document.getElementById(photo);

                //         // Check if any file is selected
                //         if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                //             alert('No file selected.');
                //             return;
                //         }
                //         //console.log(player_id)
                //         var files = fileInput.files;
                //         let formData = new FormData();

                //         formData.append('team_id', player_id);
                //         formData.append('tp', "1");

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
                //                     //console.log(Error_Name)
                //                     //console.log(team_id)
                //                 })
                //                 Get_player_list_from_team(team_id)
                //                 $('#loader-container').fadeOut();

                //             }
                //         });

                //     })
                // })

                let player_id = "player_name_" + row.Player_Id

                $("#" + player_id).click(function () {
                    let playerId = row.Player_Id
                    window.location.href = '/GetTeams/TeamList/PlayerName?playerId='+playerId;
                })

            });
            $('#loader-container').fadeOut();
        }
    })

}

Get_player_list_from_team()


function Insert_Player_Info(param_player_id) {
    let FormData = {
        player_id: param_player_id
    }

    $.ajax({
        url: '/GetTeams/AddPlayer_Info',
        type: 'POST',
        data: FormData,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (response) {
            //console.log(response)
            let Error_Name = response.Error_Name;
            let body = 
                '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
                '<strong id="msg-alert">'+Error_Name+'</strong>'+
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                '</div>'
            $("#header-msg").append(body)

            $('#loader-container').fadeOut();
        }

    })
}


