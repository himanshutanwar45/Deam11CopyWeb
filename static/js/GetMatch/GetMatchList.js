
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
                success: function (response) {
                    //console.log(response)
                    var colname = response.columns;
                    var data = response.data;
                    $.each(data, function (index, row) {
                        //console.log(row)
                        //console.log(row.Date)
                        let pack_card_detail =
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
                            '<button class="btn btn-outline-danger" id="buttonComponent-' + index + '">' + row.Match_Id + '</button>' +
                            '<button class="btn btn-outline-danger" id="API-' + index + '">+</button>' +
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

                            window.location.href = '/GetMatch/MatchList/Scores?match_Id=' + Match_Id;

                            //console.log(Match_Id)
                            
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
                // Get_matchType();
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



