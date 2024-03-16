var params = new URLSearchParams(window.location.search);
var Match_Id = params.get('match_Id');
var Team_Id = params.get('team_Id')
var Bowl_Team_Id = params.get('bowl_team_id')

$("#tab-header .tabs-header-content-text").click(function () {
    $("#tab-header .tabs-header-content-text").removeClass("active");
    $(this).addClass("active");
    score_type = $(this).text();
    $("#packs-card-score-detail").empty();

    if (score_type == 'Batters') {
        Get_batters();

    }
    else if (score_type == 'Bowlers') {
        Get_Bowlers();
    }
});


Get_batters();


function Get_batters() {
    let formData = {
        match_id: Match_Id,
        team_id: Team_Id
    };

    $.ajax({
        url: '/GetMatch/GetMatchList/GetBatterDetails',
        type: 'POST',
        data: formData,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (data) {
            //console.log(data)
            var colname = data.columns;
            var data = data.data;
            $.each(data, function (index, row) {
                let pack_card_detail =
                    '<div class="pack-card-content">' +
                    '<div class="pack-card-left-section">' +
                    '<div class="pack-card-details">' +
                    //1st
                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading">' + row.Player_Name + '</h4>' +

                    '</div>' +

                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading"> Runs: ' + row.Runs + '</h4>' +
                    '<h4 class="pack-card-heading"> Fours: ' + row.Fours + '</h4>' +
                    '<h4 class="pack-card-heading"> Sixes: ' + row.Sixes + '</h4>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +


                    '<div class="pack-card-right-section">' +
                    '<h6 class="pack-card-sub-heading">' + row.Team_Name + '</h6>' +
                    '<div style="margin-top:50px">' +
                    '<div class="pack-card-benefits-heading" > Balls: ' + row.Balls + '</div>' +
                    '<div class="pack-card-benefits-heading">Dots: ' + row.Dots + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $("#packs-card-score-detail").append(pack_card_detail)
            })
            $('#loader-container').fadeOut();
        }

    });
}



function Get_Bowlers() {
    let formData = {
        match_id: Match_Id,
        team_id: Bowl_Team_Id
    };

    $.ajax({
        url: '/GetMatch/GetMatchList/GetBowlerDetails',
        type: 'POST',
        data: formData,
        beforeSend: function () {
            $('#loader-container').fadeIn();
        },
        success: function (data) {
            //console.log(data)
            var colname = data.columns;
            var data = data.data;
            $.each(data, function (index, row) {
                let pack_card_detail =
                    '<div class="pack-card-content">' +
                    '<div class="pack-card-left-section">' +
                    '<div class="pack-card-details">' +
                    //1st
                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading">' + row.Player_Name + '</h4>' +

                    '</div>' +

                    '<div class="pack-card-detail">' +
                    '<h4 class="pack-card-heading"> Balls: ' + row.Balls + '</h4>' +
                    '<h4 class="pack-card-heading"> Wickets: ' + row.Wickets + '</h4>' +
                    '<h4 class="pack-card-heading"> Wides: ' + row.Wides + '</h4>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +


                    '<div class="pack-card-right-section">' +
                    '<h6 class="pack-card-sub-heading">' + row.Team_Name + '</h6>' +
                    '<div style="margin-top:40px">' +
                    '<div class="pack-card-benefits-heading" > Runs: ' + row.Runs + '</div>' +
                    '<div class="pack-card-benefits-heading">No Balls: ' + row.No_Balls + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $("#packs-card-score-detail").append(pack_card_detail)
            })
            // let modal =
            //     '<div class="modal-content-details" id="modal-content-details">' +
            //     '<div class="modal-header-details">' +
            //     '<h3 class="modal-heading-details">Bowling Details</h3>' +
            //     '<span onclick="Close_details(event)" class="close" title="Close Modal">&times;</span>' +
            //     '</div>' +
            //     '<div class="modal-body-details">' +
            //     '<div class="view-benefits-container" id = "view-benefits-container">' +
            //     '<div class="view-benefits-content" id="view-benefits-content">' +
            //     '<div class="right-session-table-score-detail" >' +
            //     '<table class="styled-table-details" id="bowling_details" >' +
            //     '<thead>' +
            //     '<tr>' +
            //     '</tr>' +
            //     '</thead>' +
            //     '<tbody>' +
            //     '</tbody>' +
            //     '</table>' +
            //     '</div>' +
            //     '</div>' +
            //     '</div>' +
            //     '</div>' +
            //     '</div>'
            // $("#modal-container-batter").append(modal)

            // $("#bowling_details thead tr").empty();
            // $("#bowling_details tbody").empty();
            // var headerRow = $('<tr></tr>').appendTo("#bowling_details thead");
            // $.each(colname, function (index, colnames) {
            //     headerRow.append('<th>' + colnames + '</th>');
            //     //console.log(colnames)
            // });

            // $.each(data, function (index, row) {
            //     var tableRow = $('<tr></tr>').appendTo("#bowling_details tbody");
            //     $.each(colname, function (index, columnName) {
            //         tableRow.append('<td style="cursor:pointer;">' + row[columnName] + '</td>');
            //     });
            // });

            $('#loader-container').fadeOut();
        }
    });
}
