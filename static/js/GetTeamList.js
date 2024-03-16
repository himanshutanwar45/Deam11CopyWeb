
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
                            '<div class="pack-card-container">' +
                            '<div class="pack-card-content">' +
                            '<div class="pack-card-left-section">' +
                            '<div class="pack-card-details">' +
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Team_Code + '</h4>' +
                            '</div>' +
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Team_Name + '</h4>' +
                            '</div>' +
                            '<div class="pack-card-detail">' +
                            '<img class="pack-card-heading-img" src="data:image/png;base64,' + row.Images + '" />' +
                            '</div>' +
                            '<div class="pack-card-detail" >' +
                            '<img id="image_id-' + index + '" class="pack-card-attach" src="data:image/png;base64,' + attachment_data + '" id="image_attach"/>' +
                            '<input type="file" id="fileInput-' + row.Team_Id + '" accept="image/*" style="display:none;" name="fileInput-' + row.Team_Id + '"> ' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="pack-card-right-section">' +
                            '<button class="btn fit" id="buttonComponent-' + index + '">' + row.Team_Id + '</button>' +
                            '</div>' +
                            '<div class="pack-card-right-section" style="margin-left:15px;"> ' +
                            '<button class="btn fit" id="playerAPI-' + index + '">API</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>'

                        $("#packs-card-container").append(pack_card_detail)

                        let image_id_button = "image_id-" + index;
                        let file_input_button = "fileInput-" + row.Team_Id

                        $(document).ready(function () {
                            $("#" + image_id_button).click(function () {

                                $("#" + file_input_button).click();
                            });

                            // Handle file input change
                            $("#" + file_input_button).change(function () {
                                team_id = row.Team_Id
                                var photo = 'fileInput-' + team_id
                                var fileInput = document.getElementById(photo);

                                // Check if any file is selected
                                if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                                    alert('No file selected.');
                                    return;
                                }

                                var files = fileInput.files;
                                let formData = new FormData();
                                formData.append('team_id', team_id);
                                formData.append('tp', "0");

                                for (var i = 0; i < files.length; i++) {
                                    formData.append('fileInput', files[i]);
                                }

                                $.ajax({
                                    url: '/GetTeams/Team_Flag',
                                    type: 'POST',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    beforeSend: function () {
                                        $('#loader-container').fadeIn();
                                    },
                                    success: function (response) {
                                        $.each(response, function (index, row) {
                                            //Error_Name = row.Error_Name;
                                            //alert(Error_Name)
                                            GetAllTeamList()
                                            $('#loader-container').fadeOut();
                                        })
                                    }
                                });

                                //console.log(team_id)
                            });
                        });

                        let buttonid = "buttonComponent-" + index;
                        $("#" + buttonid).click(function () {
                            team_id = row.Team_Id
                            let team_name = row.Team_Name
                            $("#modal-container").css('display', 'flex')
                            $("#modal-container").empty()
                            let modal = '<div class="modal-backdrop">' +
                                    '</div>' +
                                    '<div class="modal-content">' +
                                    '<div class="modal-header">' +
                                    '<h3 class="modal-heading">Players Name</h3>' +
                                    '<span onclick="CloseSignUp(event)" class="close" title="Close Modal">&times;</span>' +
                                    '</div>' +
                                    '<div class="modal-body">' +
                                    '<div class="view-benefits-container" id = "view-benefits-container">' +
                                    '<div class="view-benefits-content" id="view-benefits-content">' +
                                    //'<div class="plan-price-details">' +
                                    //'<h3 class="view-benefits-price" style="color:Blue;cursor:pointer;" id="find_match_id_'+Match_Id+'"> ' + Match_Id + '</h3>' +
                                    //'</div>' +
                                    '<div class="plan-price-details">' +
                                    // '<h3 class="view-benefits-price">' + score_data.Series_Description + ' (' + score_data.Year + ')</h3>' +
                                    // '<h3 class="view-benefits-price"> ' + score_data.Status + '</h3>' +
                                    '</div>' +
                                    '<div class="packs-card-container-playerdetails" id="packs-card-team-detail">'+
                                
                                    '</div>'+
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'

                            $("#modal-container").append(modal)
                            Get_player_list_from_team(team_id)
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
                                    alert(Error_Name)
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

function Get_player_list_from_team(param_team_id) {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            let Form_Data = {
                team_id: param_team_id
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
                    $('#player_name tbody').empty()
                    $.each(data, function (index, row) {
                        // html = '<tr>' +
                        //     '<td class="player-id">' + row.Player_Id + '</td>' +
                        //     '<td>' + row.Player_Name + '</td>' +
                        //     '<td>' + '<img class="view-benefits-playerImage" src="data:image/png;base64,' + row.Player_Image + '" />' + '</td>' +
                        //     '<td>' + '<img id="image_id_players-' + index + '" class="pack-card-attach" src="data:image/png;base64,' + attachment_data + '"/>' +
                        //     '<input type="file" id="fileInput_player-' + row.Player_Id + '" accept="image/*" style="display:none;" name="fileInput_player-' + row.Player_Id + '"> ' + '</td>' +
                        //     '<td><button class="btn fit" id="aPI-' + index + '">API</button></td>' +
                        //     '</tr>';
                        // $('#player_name tbody').append(html);
                        
                        let pack_card_detail =
                        '<div class="pack-card-container-playerdetails">' +
                            '<div class="pack-card-content-playerdetails">' +
                                '<div class="pack-card-left-section-playerdetails">' +
                                    '<div class="pack-card-details-playerdetails">' +
                                    //1st
                                        '<div class="pack-card-detail-playerdetails">' +
                                            '<h4 class="pack-card-heading-playerdetails" id="player_name_'+row.Player_Id+'" style="cursor:pointer;">' + row.Player_Name + '</h4>' +
                                            '<h6 class="pack-card-sub-heading-playerdetails">' + row.Player_Id + '</h6>' +
                                        '</div>' +

                                        '<div class="pack-card-detail-playerdetails">' +
                                            '<img class="view-benefits-playerImage" src="data:image/png;base64,' + row.Player_Image + '" />' +
                                        '</div>' +

                                        '<div class="pack-card-detail-playerdetails">' +
                                            '<img id="image_id_players-' + index + '" class="pack-card-attach-playerdetails" src="data:image/png;base64,' + attachment_data + '"/>' +
                                            '<input type="file" id="fileInput_player-' + row.Player_Id + '" accept="image/*" style="display:none;" name="fileInput_player-' + row.Player_Id + '"> ' + 
                                        '</div>' +

                                '</div>' +
                                '<div class="pack-card-benefits-heading-playerdetails"></div>' +
                                   // '<div class="pack-card-benefits-heading">'+row.City + ' (' + row.Ground + ')</div>' +
                                '</div>' +
                                '<div class="pack-card-right-section">' +
                                    '<button class="btn fit" id="aPI-' + index + '">API</button>'+
                                '</div>' +
                            '</div>' +
                        '</div>'
                        $('#packs-card-team-detail').append(pack_card_detail);
                        
                        let buttonid = "aPI-" + index;
                        $("#" + buttonid).click(function () {

                            Insert_Player_Info(row.Player_Id)
                            Get_player_info(row.Player_Id)

                        })

                        let image_id_players = "image_id_players-" + index;
                        let fileInput_players = "fileInput_player-" + row.Player_Id

                        $(document).ready(function () {
                            $("#" + image_id_players).click(function () {

                                $("#" + fileInput_players).click();
                                
                            });

                            $("#" + fileInput_players).change(function () {
                                player_id = row.Player_Id
                                team_id = row.Team_Id
                                //console.log(team_id)
                                var photo = 'fileInput_player-' + player_id
                                var fileInput = document.getElementById(photo);

                                // Check if any file is selected
                                if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                                    alert('No file selected.');
                                    return;
                                }
                                //console.log(player_id)
                                var files = fileInput.files;
                                let formData = new FormData();
            
                                formData.append('team_id', player_id);
                                formData.append('tp', "1");

                                for (var i = 0; i < files.length; i++) {
                                    formData.append('fileInput', files[i]);
                                }

                                $.ajax({
                                    url: '/GetTeams/Team_Flag',
                                    type: 'POST',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    beforeSend: function () {
                                        $('#loader-container').fadeIn();
                                    },
                                    success: function (response) {
                                        $.each(response, function (index, row) {
                                            //Error_Name = row.Error_Name;
                                            //console.log(Error_Name)
                                           //console.log(team_id)
                                        })
                                        Get_player_list_from_team(team_id)
                                        $('#loader-container').fadeOut();
                                        
                                    }
                                });

                            })
                        })
                        
                        let player_id = "player_name_"+row.Player_Id

                        $("#" + player_id).click(function(){
                            let playerId = row.Player_Id
                            Get_player_info(playerId)
                        })

                    });

                    // $('#player_name tbody').on('click', 'td.player-id', function () {
                    //     let playerId = $(this).text();
                        
                    //     //console.log(playerId)

                    //     //Insert_Player_Info(playerId)

                    //     Get_player_info(playerId)

                    // });
                    $('#loader-container').fadeOut();
                }
            })
            allfields = true;
        }

    }, 600);
}



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
                alert(Error_Name)
                $('#loader-container').fadeOut();
                GetAllTeamList();
            }
        })
        //$('#loader-container').fadeIn();
    })
})


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
            $('#loader-container').fadeOut();
        }
        
    })
}

function Get_player_info(param_player_id) {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {

            let FormData = {
                player_id: param_player_id
            }

            $.ajax({
                url: '/GetTeams/GetPlayer_Info',
                type: 'POST',
                data: FormData,
                beforeSend:function(){
                    $('#loader-container').fadeIn();
                },
                success: function (response) {
                    $("#modal-container-player-info").css('display', 'flex')
                    $("#modal-container-player-info").empty()
                    let player_info = response.data;
                    //console.log(player_info)
                    //console.log(response)
                    if (player_info.length>0) {
                        let Player_Info = player_info[0]
                        var formattedDate = new Date(Player_Info.DOB);
                        var date_of_birth = formattedDate.toLocaleDateString("fr-FR");

                        let modal = '<div class="modal-backdrop"></div>' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<h3 class="modal-heading" style="margin-left:10px;">Player Info</h3>' +
                            '<span onclick="CloseSignUp_Player()" class="close" title="Close Modal">&times;</span>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<div class="view-benefits-container" id="view-benefits-container">' +
                            '<div class="view-benefits-content" id="view-benefits-content">' +
                            '<div class="plan-price-details">' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Player_Name + ' (' + Player_Info.Nick_Name + ') </h3>' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Role + '</h3>' +
                            '<h3 class="view-benefits-price"> ' + date_of_birth + ' (' + Player_Info.Birth_Place + ')</h3>' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Intl_Team + '</h3>' +
                            '</div>' +

                            // '<div class="plan-price-details">' +
                            // '<h3 class="view-benefits-price"> ' + Player_Info.Bio + '</h3>' +
                            // '</div>' +

                            '<div class="plan-price-details" style="margin-left:50px;">' +
                                '<img class="view-benefits-player-info" src="data:image/png;base64,' + Player_Info.Player_Image + '" />' +
                            '</div>' +

                            '<div style="margin-left:50px;" class="plan-price-details">' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Batting_Style + '</h3>' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Bowling_Style + '</h3>' +

                            '</div>' +

                            '</div>' +
                            '</div>' +
                            '<div class="modal-header">' +
                            '<h3 class="modal-heading" style="margin-left:10px;">Biography</h3>' +
                            '</div>' +
                            '<div class="view-benefits-container" id="view-benefits-container" style="margin-left:10px;">' +
                            '<h3 class="view-benefits-price"> ' + Player_Info.Bio + '</h3>' +
                            '</div>' +
                            '<div class="right-session-table-player-info" style="margin-left:10px;" >' +
                            '<table class="styled-table" id="player_info" >' +
                            '<thead>' +
                            '<tr>' +
                            '<th>Player Key</th>' +
                            '<th>ODI Rank</th>' +
                            '<th>Test Best Rank</th>' +
                            '<th>ODI Best Rank</th>' +
                            '<th>T20 Best Rank</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            // Add your table rows here if needed
                            '</tbody>' +

                            '</table>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        $("#modal-container-player-info").append(modal);


                        $.each(player_info, function (index, row) {
                            //console.log(row.Player_Id);
                            let html = '<tr>' +
                                '<td class="player-id">' + row.Player_Key + '</td>' +
                                '<td>' + row.Odi_Rank + '</td>' +
                                '<td>' + row.Test_Best_Rank + '</td>' +
                                '<td>' + row.Odi_Best_Rank + '</td>' +
                                '<td>' + row.T20_Best_Rank + '</td>' +
                                '</tr>';
                            $('#player_info tbody').append(html);
                        });

                    }
                    else {
                        $("#modal-container-player-info").css('display', 'none')
                    }
                    $('#loader-container').fadeOut();

                },error:function(error){
                    console.log(error)
                    $("#modal-container-player-info").css('display', 'none')
                }

            });
            allfields = true;
        }

    }, 2000);
}

