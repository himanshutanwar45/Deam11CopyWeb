var params = new URLSearchParams(window.location.search);
var playerId = params.get('playerId');


function Get_player_info() {
    let FormData = {
        player_id: playerId
    }

    $.ajax({
        url: '/GetTeams/GetPlayer_Info',
        type: 'POST',
        data: FormData,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (response) {
            $("#modal-container-player-info").css('display', 'flex')
            $("#modal-container-player-info").empty()
            let player_info = response.data;
            //console.log(player_info)
            //console.log(response)
            if (player_info.length > 0) {
                let Player_Info = player_info[0]
                var formattedDate = new Date(Player_Info.DOB);
                var date_of_birth = formattedDate.toLocaleDateString("fr-FR");

                let modal = 
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
                    '<img class="view-benefits-player-info" src="' + Player_Info.Image_URL + '" />' +
                    '</div>' +

                    '<div style="margin-left:50px;" class="plan-price-details">' +
                    '<h3 class="view-benefits-price"> ' + Player_Info.Batting_Style + '</h3>' +
                    '<h3 class="view-benefits-price"> ' + Player_Info.Bowling_Style + '</h3>' +

                    '</div>' +

                    '</div>' +
                    '</div>' +
                    '<div class="modal-header">' +
                    '<h3 class="modal-heading" style="margin-left:20px;">Biography</h3>' +
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

        }, error: function (error) {
            console.log(error)
            $("#modal-container-player-info").css('display', 'none')
        }

    });
}
Get_player_info()