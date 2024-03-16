$('#loader-container').fadeOut();

function Close_preview_team() {
    let divopen = document.getElementById('modal-container')
    divopen.style.display = 'none';
    $("#modal-container").empty()
}

let player_type = ""
let match_id = ""
$(document).ready(function () {
    $.ajax({
        url: '/PreviewTeam/ShowPreviewTeam',
        type: 'GET',

        success: function (response) {
            //console.log(response)
            usage_data = response.data;
            $.each(usage_data, function (index, row) {
                //console.log(row)
                match_id = row.Match_Id
                let pack_card_detail =
                    '<div class="pack-card-container">' +
                    '<div class="pack-card-content">' +
                    '<div class="pack-card-left-section">' +
                    '<div class="pack-card-details">' +
                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading">' + row.Start_Date + '</h4>' +
                    '<h6 class="pack-card-sub-heading">' + row.Match_Desc + '</h6>' +
                    '</div>' +

                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading">' + row.Series_Name + '</h4>' +

                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pack-card-right-section">' +
                    '<button class="btn fit" id="Preview-' + row.Match_Id + '"> Preview Team </button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $("#packs-card-container").append(pack_card_detail)

                let preview_team = "Preview-" + row.Match_Id
                $("#" + preview_team).click(function () {
                    match_id = row.Match_Id
                    $("#modal-container").css('display', 'flex')
                    $("#modal-container").empty()
                    let modal = ' <div class="modal-backdrop">' +
                        '</div>' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<h3 class="modal-heading">Preview Team</h3>' +
                        '<span onclick="Close_preview_team()" class="close" title="Close Modal">&times;</span>' +
                        '</div>' +

                        '<div class="tabs-header" id="tab-header-totalpoints">' +
                               
                        '</div>' +
                        
                        '<div class="main-section-container">' +
                        '<div class="right-content">' +
                        '<div class="recharge-online-container">' +
                        '<div class="tabs-container">' +
                        // '<div class="tabs-header" id="tab-header-preview-team">' +
                        // '</div>' +


                        '<div class="tabs-content">' +
                        '<div class="tabs-conponent">' +
                        '<div class="packs-card-container-previewteam" id="packs-card-container-previewplayer">' +
                        // fetch the all player with category from "getPreviewTeamPlayer()"
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    $("#modal-container").append(modal)

                    getPreviewTeamPlayer(match_id)

                    $("#GetScore").click(function () {

                    })

                })


            })

            $('#loader-container').fadeOut();
        }
    })
})

function getPreviewTeamPlayer(param_match_id) {
    let formData = {
        match_id: param_match_id
    }
    $.ajax({
        url: '/PreviewTeam/ShowPreviewTeamPlayer',
        type: 'POST',
        data: formData,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (response) {
            //console.log(response)
            let preview_player = response.usage_data

            $("#packs-card-container-previewplayer").empty();
            $.each(preview_player, function (index, row) {
                //console.log(row)
                if (preview_player.length > 0) {
                    let pack_card_detail =
                        '<div class="pack-card-container-previewteam">' +
                        '<div class="pack-card-content-previewteam">' +
                        '<div class="pack-card-left-section-previewteam">' +
                        '<div class="pack-card-details-previewteam">' +
                        '<div class="pack-card-detail-previewteam">' +
                        '<h4 class="pack-card-heading-previewteam">' + row.Player_Name + ' ('+row.Points+')</h4>' +
                        '</div>' +

                        '<div class="pack-card-detail-previewteam">' +
                        '<img  class="view-benefits-heading" src="data:image/jpeg;base64,' + row.Player_Image + '" />' +
                        '</div>' +

                        '<div class="pack-card-detail-previewteam"> Players Runs' +
                        '<h4 class="pack-card-heading-previewteam" >'+row.Runs+'</h4>' +
                        '</div>' +

                        '<div class="pack-card-detail-previewteam"> Wickets' +
                        '<h4 class="pack-card-heading-previewteam" >'+row.Wickets+'</h4>' +
                        '</div>' +

                        '<div class="pack-card-detail-previewteam"> Total Points' +
                        '<h4 class="pack-card-heading-previewteam" >'+row.Total_Points+'</h4>' +
                        '</div>' +

                        // '<div class="pack-card-detail">' +
                        // '<button class="btn fit" id="captain-' + row.Player_Id + '"> C </button>' +
                        // '<button class="btn fit" id="vice_captain-' + row.Player_Id + '" style="margin-left:10px;"> VC </button>' +
                        // '</div>' +

                        '</div>' +
                        '<div class="pack-card-benefits-heading-previewteam">' + row.Category + '</div>' +
                        '</div>' +
                        // '<div class="pack-card-right-section">' +
                        // '<button class="btn fit" id="AddTeam-' + row.Player_Id + '"> Add to Team </button>' +
                        // '<button class="btn clear secondary" id="Delete-' + row.Player_Id + '" style="display:none"> Delete Player </button>' +
                        // '</div>' +
                        '</div>' +
                        '</div>'
                    $("#packs-card-container-previewplayer").append(pack_card_detail)
                   
                }
            })
            getPreviewTeamPlayerPoints(match_id)
            $('#loader-container').fadeOut();
        }
    })
}


function getPreviewTeamPlayerPoints(param_match_id) {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_id: param_match_id
            }

            $.ajax({
                url: '/PreviewTeam/ShowPreviewTeamPlayer_Points',
                type: 'POST',
                data: formData,
                success: function (response) {
                    row_data = response.data;
                    header_info = row_data[0]
                    //console.log(header_info)
                    let html = '<div class="player_credit">' +
                    '<div class="box" id="div1"> Total Runs: <span class="span-player-content">' + header_info.Runs + '</span></div>' +
                    '<div class="box" id="div1"> Total Points: <span class="span-player-content">' + header_info.Total_Points + '</span></div>' +
                    '</div>'
                    $("#tab-header-totalpoints").append(html)
                }

            })
            allfields = true;
        }

    }, 500);
}
