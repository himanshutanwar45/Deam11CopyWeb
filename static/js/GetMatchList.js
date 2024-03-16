
$('#loader-container').fadeOut();

let match_type = ""

$(document).ready(function () {
    $.ajax({
        url: '/GetMatch/MatchType',
        type: 'GET',
        success: function (response) {
            $.each(response, function (index, row) {
                //console.log(row.text, row.value);
                var html = '<div class="tabs-header-scroll-section"></div>' +
                    '<div class="tabs-header-content" id="tab-header-' + index + '"><span class="tabs-header-content-text">' + row.text + '</span></div>'
                $("#tab-header").append(html)
            });
            $("#tab-header .tabs-header-content-text").click(function () {
                $("#tab-header .tabs-header-content-text").removeClass("active");
                $(this).addClass("active");

                match_type = $(this).text();
                //console.log(match_type);
                Get_match_List(match_type);
                $("#tab-content").empty()
                $("#packs-card-container").empty()
                // div = '<div class="tabs-section">' + match_type + '</div>'
                // $("#tab-content").append(div)
            });

        }
    });
});


function Get_match_List(param_match_type) {
    let allfields = false;

    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_type: param_match_type
            }

            $.ajax({
                url: '/GetMatch/GetMatchList',
                type: 'POST',
                data: formData,
                beforeSend: function () {
                    $('#loader-container').fadeIn();
                },
                success: function (response) {
                    //console.log(response)
                    var colname = response.columns;
                    var data = response.data;
                    $.each(data, function (index, row) {
                        //console.log(row)
                        //console.log(row.Date)
                        let pack_card_detail =
                            '<div class="pack-card-container">' +
                            '<div class="pack-card-content">' +
                            '<div class="pack-card-left-section">' +
                            '<div class="pack-card-details">' +
                            //1st
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Start_Date + ' (' + row.Start_Time + ')</h4>' +
                            '<h6 class="pack-card-sub-heading">' + row.Match_Description + '</h6>' +
                            '</div>' +

                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Series_Name +'</h4>' +
                            
                            '</div>' +

                            // '<div class="pack-card-detail">' +
                            // '<h4 class="pack-card-heading">' + row.Team_Name + ' (' + row.Team_S_Name + ')</h4>' +
                            // '<h4 class="pack-card-heading">' + row.Team_Name_2 + ' (' + row.Team_S_Name_2 + ')</h4>' +
                            // '</div>' +

                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading"> Runs: ' + row.Runs + '</h4>' +
                            //'<h4 class="pack-card-heading"> Runs: ' + row.Runs_2 + ', Wickets: ' + row.Wickets_2 + ', Overs: ' + row.Overs_2 + '</h4>' +
                            '</div>' +

                            '</div>' +

                            '<div class="pack-card-benefits-heading">' + row.Match_Format + '</div>' +
                            '<div class="pack-card-benefits-heading">' + row.City + ' (' + row.Ground + ')</div>' +
                            '</div>' +


                            '<div class="pack-card-right-section">' +
                            '<button class="btn fit" id="buttonComponent-' + index + '">' + row.Match_Id + '</button>' +
                            '<button class="btn clear secondary" id="API-' + index + '">API</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        $("#packs-card-container").append(pack_card_detail)
                        let Match_Id = row.Match_Id
                        let getplanbutton = "buttonComponent-" + index;
                        $("#" + getplanbutton).click(function () {
                            // $("#colm-logo").css('display', 'block')
                            // $(".btn-recharge").css('display', 'block')
                            $("#modal-container").css('display', 'flex')
                            $("#modal-container").empty()
                            //console.log(Match_Id)
                            let formData = {
                                match_id: Match_Id
                            };

                            $.ajax({
                                url: '/GetMatch/GetMatchList/GetMatchHeader',
                                type: 'POST',
                                data: formData,
                                beforeSend: function () {
                                    $('#loader-container').fadeIn();
                                },
                                success: function (data) {
                                    console.log(data)
                                    column_data = data.data;
                                    //console.log(column_data)
                                    if (column_data.length > 0) {
                                        let score_data = column_data[0]
                                        let modal = '<div class="modal-backdrop">' +
                                            '</div>' +
                                            '<div class="modal-content">' +
                                            '<div class="modal-header">' +
                                            '<h3 class="modal-heading">Match Header</h3>' +
                                            '<span onclick="CloseSignUp(event)" class="close" title="Close Modal">&times;</span>' +
                                            '</div>' +
                                            '<div class="modal-body">' +
                                            '<div class="view-benefits-container" id = "view-benefits-container">' +
                                            '<div class="view-benefits-content" id="view-benefits-content">' +
                                            //'<div class="plan-price-details">' +
                                            //'<h3 class="view-benefits-price" style="color:Blue;cursor:pointer;" id="find_match_id_'+Match_Id+'"> ' + Match_Id + '</h3>' +
                                            //'</div>' +
                                            '<div class="plan-price-details">' +
                                            '<h3 class="view-benefits-price">' + score_data.Series_Description + ' (' + score_data.Year + ')</h3>' +
                                            '<h3 class="view-benefits-price"> ' + score_data.Status + '</h3>' +
                                            '</div>' +
                                            '<div class="packs-card-container" id="packs-card-score-detail">' +

                                            '</div>' +
                                            // '<div class="right-session-table-score-detail" >' +
                                            // '<table class="styled-table" id="score_card_details" >' +
                                            // '<thead>' +
                                            // '<tr>' +
                                            // '<th>Team Id</th>' +
                                            // '<th>Team Name</th>' +
                                            // '<th>Runs</th>' +
                                            // '</tr>' +
                                            // '</thead>' +
                                            // '<tbody>' +
                                            // // Add your table rows here if needed
                                            // '</tbody>' +

                                            // '</table>' +
                                            // '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>'
                                        $("#modal-container").append(modal)

                                        // $.each(column_data, function (index, row) {
                                        //     //console.log(row);
                                        //     let html = '<tr>' +
                                        //         '<td class="team_id">' + row.Team_Id + '</td>' +
                                        //         '<td>' + row.Team_Name + ' (' + row.Team_Short_Name + ')</td>' +
                                        //         '<td>' + row.Runs + '</td>' +
                                        //         '</tr>';
                                        //     $('#score_card_details tbody').append(html);
                                        // });

                                        $.each(column_data, function (index, row) {
                                            //console.log(row)
                                            let html = '<div class="pack-card-container">' +
                                                '<div class="pack-card-content">' +
                                                '<div class="pack-card-left-section">' +
                                                '<div class="pack-card-details">' +
                                                //1st
                                                '<div class="pack-card-detail">' +
                                                '<h4 class="pack-card-heading" id="team_id_' + row.Team_Id + '"  style="cursor:pointer;">' + row.Team_Name + '</h4>' +
                                                '<h6 class="pack-card-sub-heading" >' + row.Team_Id + '</h6>' +
                                                '</div>' +

                                                '<div class="pack-card-detail">' +
                                                    '<img class="pack-card-heading-imgsmall" src="data:image/png;base64,' + row.Images + '" />' +
                                                '</div>' +

                                                //2nd
                                                '<div class="pack-card-detail">' +
                                                '<h4 class="pack-card-heading">Runs: ' + row.Runs + '</h4>' +

                                                '</div>' +

                                                '</div>' +
                                                //'<div class="pack-card-benefits-heading">' + row.City + '</div>' +
                                                '</div>' +
                                                // '<div class="pack-card-right-section">' +
                                                // '<button class="btn fit" id="buttonComponent-' + index + '">' + row.Match_Id + '</button>' +
                                                // '<button class="btn clear secondary" id="API-' + index + '">API</button>' +
                                                // '</div>' +
                                                '</div>' +
                                                '</div>'
                                            $('#packs-card-score-detail').append(html);

                                            let score_detail = "team_id_" + row.Team_Id

                                            $("#" + score_detail).click(function () {
                                                $("#modal-container-batter").empty();
                                                $("#modal-container-batter").css('display', 'flex')
                                                Get_Batter(Match_Id, row.Team_Id);
                                                Get_Bowler(Match_Id, row.Team_Id)
                                            })
                                        })


                                    }
                                    else {
                                        $("#modal-container").css('display', 'none')
                                    }
                                    // $('#score_card_details tbody').on('click', 'td.team_id', function () {
                                    //     $(this).closest('tr').toggleClass('selected-row');
                                    //     $("#score_card_details tbody tr").not($(this).closest('tr')).removeClass('selected-row');
                                    //     let team_id = $(this).text();
                                    //     //console.log(team_id);
                                    //     $("#modal-container-batter").empty();
                                    //     $("#modal-container-batter").css('display', 'flex')
                                    //     Get_Batter(Match_Id, team_id);
                                    //     Get_Bowler(Match_Id, team_id)
                                    // });



                                    $('#loader-container').fadeOut();
                                }
                            });
                        })


                        let aPIBtn = "API-" + index;
                        $("#" + aPIBtn).click(function () {

                            let formData = {
                                match_id: Match_Id
                            };

                            $.ajax({
                                url: '/GetMatch/GetMatchList/Scoreupdate',
                                type: 'POST',
                                data: formData,
                                beforeSend: function () {
                                    $('#loader-container').fadeIn();
                                },
                                success: function (data) {
                                    //console.log(data)
                                    Error_Name = data.Error_Name;
                                    alert(Error_Name)
                                    $('#loader-container').fadeOut();
                                }
                            })

                            //console.log(Match_Id)

                        })


                    })
                    //Get_match_List(match_type) 
                    $('#loader-container').fadeOut();
                }

            })
            allfields = true;
        }
    }, 100);
}

Get_match_List(match_type) 


function Get_Batter(param_match_id, param_team_id) {
    let allfields = false;

    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_id: param_match_id,
                team_id: param_team_id
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
                    //console.log(data)
                    let modal_batter = '<div class="modal-backdrop-details">' +
                        '</div>' +
                        '<div class="modal-content-details" id="modal-content-details">' +
                        '<div class="modal-header-details">' +
                        '<h3 class="modal-heading-details">Batting Details</h3>' +
                        '<span onclick="Close_details(event)" class="close" title="Close Modal">&times;</span>' +
                        '</div>' +
                        '<div class="modal-body-details">' +
                        '<div class="view-benefits-container" id = "view-benefits-container">' +
                        '<div class="view-benefits-content" id="view-benefits-content">' +
                        '<div class="right-session-table-score-detail" >' +
                        '<table class="styled-table-details" id="batting_details" >' +
                        '<thead>' +
                        '<tr>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    $("#modal-container-batter").append(modal_batter)

                    $("#batting_details thead tr").empty();
                    $("#batting_details tbody").empty();
                    var headerRow = $('<tr></tr>').appendTo("#batting_details thead");
                    $.each(colname, function (index, colnames) {
                        headerRow.append('<th>' + colnames + '</th>');
                        //console.log(colnames)
                    });

                    $.each(data, function (index, row) {
                        var tableRow = $('<tr></tr>').appendTo("#batting_details tbody");
                        $.each(colname, function (index, columnName) {
                            tableRow.append('<td>' + row[columnName] + '</td>');
                        });
                    });
                    $('#loader-container').fadeOut();
                }

            });

            allfields = true;
        }
    }, 1000);
}


function Get_Bowler(param_match_id, param_team_id) {
    let allfields = false;

    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_id: param_match_id,
                team_id: param_team_id
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
                    let modal =
                        '<div class="modal-content-details" id="modal-content-details">' +
                        '<div class="modal-header-details">' +
                        '<h3 class="modal-heading-details">Bowling Details</h3>' +
                        '<span onclick="Close_details(event)" class="close" title="Close Modal">&times;</span>' +
                        '</div>' +
                        '<div class="modal-body-details">' +
                        '<div class="view-benefits-container" id = "view-benefits-container">' +
                        '<div class="view-benefits-content" id="view-benefits-content">' +
                        '<div class="right-session-table-score-detail" >' +
                        '<table class="styled-table-details" id="bowling_details" >' +
                        '<thead>' +
                        '<tr>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    $("#modal-container-batter").append(modal)

                    $("#bowling_details thead tr").empty();
                    $("#bowling_details tbody").empty();
                    var headerRow = $('<tr></tr>').appendTo("#bowling_details thead");
                    $.each(colname, function (index, colnames) {
                        headerRow.append('<th>' + colnames + '</th>');
                        //console.log(colnames)
                    });

                    $.each(data, function (index, row) {
                        var tableRow = $('<tr></tr>').appendTo("#bowling_details tbody");
                        $.each(colname, function (index, columnName) {
                            tableRow.append('<td style="cursor:pointer;">' + row[columnName] + '</td>');
                        });
                    });

                    $('#loader-container').fadeOut();
                }
            });

            allfields = true;
        }
    }, 1000);
}



$(document).ready(function () {
    $("#match_list").click(function (event) {
        event.preventDefault()

        $.ajax({
            url: '/GetMatch/NewMatch',
            type: 'POST',
            beforeSend: function () {
                $('#loader-container').fadeIn();
            },
            success: function (response) {
                let Error_Name = response.Error_Name;
                alert(Error_Name)
                $('#loader-container').fadeOut();
                Get_matchType();
                Get_match_List(match_type);
            }
        })
        //$('#loader-container').fadeIn();
    })
})


function CloseSignUp(event) {
    event.preventDefault()
    $("#modal-container").css('display', 'none')
}

function Close_details(event) {
    event.preventDefault()
    $("#modal-container-batter").css('display', 'none')
    $("#modal-container-bowler").css('display', 'none')
}



