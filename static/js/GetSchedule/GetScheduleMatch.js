
function CloseSignUp(event) {
    event.preventDefault();
    let divopen = document.getElementById('modal-container')
    divopen.style.display = 'none';

    $.each(playerIdsList, function (index, row) {
        //console.log(row)

        let hide_add_team = "AddTeam-" + row;
        let hide_delete_team = "Delete-" + row;

        $("#" + hide_add_team).css('display', 'flex')
        $("#" + hide_delete_team).css('display', 'none')

    })

    playerIdsList = []
    selected_player_json = { selectedPlayer: [] }
}


function Close_preview_team() {
    let divopen = document.getElementById('preview-container')
    divopen.style.display = 'none';
    $("#preview-container").empty()
}


let match_type = ""
let player_type = ""
let match_id = ""
let user_code = ""

let credit_points = 0
let balance_points = 0
let used_points = 0
let playerIdsList = [];
let player_id = ""
let points = ""
let selectedPlayer = []
let deletedPlayer = []
let player_name = ""
let value_of_captain = ""
let value_of_v_captain = ""
//let player_count = 0

let selected_player_json = { selectedPlayer: [] }


//This is for the 1st page and show header of match type like international, domestic ETC
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
                Get_scheduled_Match(match_type);// This is for showing the all schedule match using match type
                $("#tab-content").empty()
                $("#packs-card-container").empty()
                // div = '<div class="tabs-section">' + match_type + '</div>'
                // $("#tab-content").append(div)
            });

        }
    });
});

//END

// This is for showing the all schedule match using match type this function is calling in frontpage jquery which is 1st of the code
function Get_scheduled_Match(param_match_type) {
    let allfields = false;

    setTimeout(() => {
        if (!allfields) {
            let FormData = {
                mt: param_match_type
            }

            $.ajax({
                url: '/GetMatch/GetScheduleMatch',
                type: 'POST',
                data: FormData,
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
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Date_2 + ' (' + row.Start_Time + ')</h4>' +
                            '<h6 class="pack-card-sub-heading">' + row.Series_Name + '</h6>' +
                            '</div>' +
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Series_Category + '</h4>' +
                            '<h4 class="pack-card-heading">' + row.Team_Name + ' VS ' + row.Team_Name_2 + '</h4>' +

                            '</div>' +
                            '<div class="pack-card-detail">' +
                            
                            '<h6 class="pack-card-sub-heading">' + row.Match_Desc + '</h6>' +
                            '</div>' +
                            '</div>' +
                            '<div class="pack-card-benefits-heading">' + row.Ground + ' (' + row.City +
                            ')</div>' +
                            '</div>' +
                            '<div class="pack-card-right-section">' +
                            '<button class="btn btn-outline-danger" id="buttonComponent-' + index + '"> Create Team </button>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        $("#packs-card-container").append(pack_card_detail)

                        let getplanbutton = "buttonComponent-" + index;

                        $("#" + getplanbutton).click(function () {
                            // $("#colm-logo").css('display', 'block')
                            // $(".btn-recharge").css('display', 'block')
                            // $("#modal-container").css('display', 'flex')
                            // $("#modal-container").empty()
                            match_id = row.Match_Id
                            let team_id = row.Team_Id
                            let team_id_2 = row.Team_Id_2
                            Get_match_Type(match_id,function(Match_Type){
                                match_type = Match_Type
                            })
                            
                            window.location.href = '/GetMatch/UpcomminMatches/CreateTeam?match_id='+match_id+'&team_id='+team_id+'&team_id_2='+team_id_2+'&match_type='+match_type;
                        
                        })

                    })
                    $('#loader-container').fadeOut();
                }

            })
            allfields = true;
        }
    }, 100);
}
//END

Get_scheduled_Match(match_type)



$(document).ready(function () {
    $("#schedule_list").click(function (event) {
        event.preventDefault()

        let FormData = {
            json_type: 'Add_Schedule_Matches_List'
        }
        $.ajax({
            url: '/GetMatch/GetScheduleMatch/GetScheduleMatchList',
            type: 'POST',
            data: FormData,
            beforeSend: function () {
                $('#loader-container').fadeIn();
            },
            success: function (response) {
                let Error_Name = response.Error_Name;
                alert(Error_Name)
                $('#loader-container').fadeOut();
            }
        })
    })
})


function Get_match_Type(param_match_id,callback){
    let formData = {
        match_id:param_match_id
    }

    $.ajax({
        url:'/GetMatch/GetScheduleMatch/GetMatchType_Schedule',
        type:'POST',
        data:formData,
        success:function(response){
            let data = response.data

            callback(data[0].Series_Category)
        }
    })
}