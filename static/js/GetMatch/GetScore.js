
var params = new URLSearchParams(window.location.search);
var Match_Id = params.get('match_Id');


$(document).ready(function () {
    let formData = {
        match_id: Match_Id
    };

    $.ajax({
        url: '/GetMatch/GetMatchList/GetMatchHeader',
        type: 'POST',
        data: formData,
        success: function (data) {
            //console.log(data)
            column_data = data.data;
            if (column_data.length > 0) {
                let score_data = column_data[0]
                let modal =
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="view-benefits-container" id = "view-benefits-container">' +
                    '<div class="view-benefits-content" id="view-benefits-content">' +
                    //'<div class="plan-price-details">' +
                    //'<h3 class="view-benefits-price" style="color:Blue;cursor:pointer;" id="find_match_id_'+Match_Id+'"> ' + Match_Id + '</h3>' +
                    //'</div>' +
                    '<div class="plan-price-details">' +
                    '<h3 class="view-benefits-price">' + score_data.Series_Description + ' (' + score_data.Year + ')</h3>' +
                    '<h3 class="view-benefits-price"> <b>' + score_data.Status + '</b></h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $("#modal-container").append(modal)

                $.each(column_data, function (index, row) {
                    //console.log(row)
                    let html = '<div class="pack-card-container">' +
                        '<div class="pack-card-content">' +
                        '<div class="pack-card-left-section">' +
                        '<div class="pack-card-details">' +
                        //1st
                        '<div class="pack-card-detail">' +

                        '<h4 class="pack-card-heading" id="team_id_' + row.Team_Id + '"  style="cursor:pointer;">' + row.Team_Name + '</h4>' +
                        '</div>' +

                        //2nd
                        '<div class="pack-card-detail">' +
                        '<h4 class="pack-card-heading">Runs: ' + row.Runs + '</h4>' +

                        '</div>' +

                        '</div>' +
                        //'<div class="pack-card-benefits-heading">' + row.City + '</div>' +
                        '</div>' +
                        '<div class="pack-card-right-section">' +
                        '<img class="pack-card-heading-imgsmall" src="data:image/png;base64,' + row.Images + '" />' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    $('#packs-card-score-detail').append(html);

                    let score_detail = "team_id_" + row.Team_Id
                    let bowl_team_id = row.Bowl_Team_Id

                    $("#" + score_detail).click(function (event) {
                        // event.preventDefault()
                        // $("#modal-container-batter").empty();
                        // $("#modal-container-batter").css('display', 'flex')
                        //Get_Batter(Match_Id, row.Team_Id);
                        //Get_Bowler(Match_Id, row.Team_Id)

                        window.location.href = '/GetMatch/MatchList/ScoresDetails?match_Id=' + Match_Id + '&team_Id=' + row.Team_Id + '&bowl_team_id='+bowl_team_id;
                    })
                })


            }
            else {
                $("#modal-container").css('display', 'none')
            }

            $('#loader-container').fadeOut();
        }
    });
})
