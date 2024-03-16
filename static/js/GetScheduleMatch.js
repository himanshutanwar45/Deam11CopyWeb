
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
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Date_2 + ' (' + row.Start_Time + ')</h4>' +
                            '<h6 class="pack-card-sub-heading">' + row.Series_Name + '</h6>' +
                            '</div>' +
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Series_Category + '</h4>' +
                            '<h4 class="pack-card-heading">' + row.Team_Name + ' VS ' + row.Team_Name_2 + '</h4>' +

                            '</div>' +
                            '<div class="pack-card-detail">' +
                            '<h4 class="pack-card-heading">' + row.Match_Format + '</h4>' +
                            '<h6 class="pack-card-sub-heading">' + row.Match_Desc + '</h6>' +
                            '</div>' +
                            '</div>' +
                            '<div class="pack-card-benefits-heading">' + row.Ground + ' (' + row.City +
                            ')</div>' +
                            '</div>' +
                            '<div class="pack-card-right-section">' +
                            '<button class="btn fit" id="buttonComponent-' + index + '"> Create Team </button>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        $("#packs-card-container").append(pack_card_detail)

                        let getplanbutton = "buttonComponent-" + index;

                        $("#" + getplanbutton).click(function () {
                            // $("#colm-logo").css('display', 'block')
                            // $(".btn-recharge").css('display', 'block')
                            $("#modal-container").css('display', 'flex')
                            $("#modal-container").empty()
                            match_id = row.Match_Id
                            let modal = ' <div class="modal-backdrop">' +
                                '</div>' +
                                '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                '<h3 class="modal-heading">User Info</h3>' +
                                '<span onclick="CloseSignUp(event)" class="close" title="Close Modal">&times;</span>' +
                                '</div>' +
                                '<div class="tabs-header" id="tab-header-userinfo">' +
                                //Fetch the player category from "getloginInfo()"
                                '</div>' +

                                '<div class="modal-header">' +
                                //'<h3 class="modal-heading">Player List</h3>' +
                                '<button class="prev-btn fit" id="preview_team"> Preview </button>' +
                                '<button class="prev-btn fit" id="save_team" style="margin-left:10px"> Save Team </button>' +
                                '<button class="prev-btn fit" id="Random" style="margin-left:10px"> Random Generate </button>' +
                                '</div>' +
                                '<div class="main-section-container-playerinfo">' +

                                '<div class="tabs-container">' +
                                '<div class="tabs-header" id="tab-header-player">' +
                                //Fetch the player category from "getPlayerCategory()"
                                '</div>' +


                                '<div class="tabs-content">' +
                                '<div class="tabs-conponent">' +
                                '<div class="packs-card-container-playerinfo" id="packs-card-container-playerinfo">' +
                                // fetch the all player with category from "getPlayerwithCategory()"
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            $("#modal-container").append(modal)

                            $(document).ready(function () {
                                $("#save_team").click(function (event) {
                                    event.preventDefault();
                                    // selectedPlayer.forEach(player => {

                                    //     let formData = {
                                    //         'match_id': player.match_id,
                                    //         'player_id': player.player_id,
                                    //         'player_name': player.player_name,
                                    //         'user_id': player.user_id,
                                    //         'points': used_points,
                                    //         'credit_points': credit_points,
                                    //         'balance_points': balance_points,
                                    //         'player_type': player.player_type
                                    //     }

                                    //     $.ajax({
                                    //         type: 'POST',
                                    //         url: '/GetMatch/GetScheduleMatch/SelectedPlayer',
                                    //         contentType: 'application/json;charset=UTF-8',
                                    //         data: JSON.stringify(formData),
                                    //         beforeSend: function () {
                                    //             $('#loader-container').fadeIn();
                                    //         },
                                    //         success: function (response) {
                                    //             console.log(response);
                                    //             $('#loader-container').fadeOut();
                                    //         },
                                    //         error: function (error) {
                                    //             console.error('Error saving data:', error);
                                    //             $('#loader-container').fadeOut();
                                    //         }
                                    //     });
                                    // });
                                    var data_json = JSON.stringify(selected_player_json)
                                    $.ajax({
                                        type: 'POST',
                                        url: '/GetMatch/GetScheduleMatch/SelectedPlayer',
                                        contentType: 'application/json;charset=UTF-8',
                                        data: data_json,
                                        beforeSend: function () {
                                            $('#loader-container').fadeIn();
                                        },
                                        success: function (response) {
                                            console.log(response);
                                            $('#loader-container').fadeOut();
                                        },
                                        error: function (error) {
                                            console.error('Error saving data:', error);
                                            $('#loader-container').fadeOut();
                                        }
                                    });

                                })
                            })



                            getPlayerCategory()
                            getloginInfo(match_id)
                            
                            $(document).ready(function () {
                                $("#Random").click(function (event) {
                                    event.preventDefault()
                                    let team_1 = row.Team_Id
                                    let team_2 = row.Team_Id_2
                                    let formData = {
                                        match_type : match_type,
                                        match_id : match_id,
                                        team_1 : team_1,
                                        team_2 : team_2
                                    }
                                    $.ajax({
                                        url:'/GetMatch/GetScheduleMatch/GetRandomTeamInsert',
                                        type:'POST',
                                        data:formData,
                                        beforeSend: function () {
                                            $('#loader-container').fadeIn();
                                        },
                                        success:function(response){
                                            getPlayerCategory()
                                            
                                            getloginInfo(match_id)
                                            player_id = 0

                                            var indexToDelete = playerIdsList.indexOf(player_id);

                                            if (indexToDelete !== -1) {
                                                playerIdsList.splice(indexToDelete, 1);


                                            }
                                            var indexToDelete_Delete = selected_player_json.selectedPlayer.findIndex(player => player.player_id === player_id);

                                            if (indexToDelete_Delete !== -1) {
                                                selected_player_json.selectedPlayer.splice(indexToDelete_Delete, 1);
                                                //console.log(`Player with ID ${player_id} deleted.`);

                                            }
                                            data = response.data
                                            //console.log(data)
                                            // $.each(data, function (index, row) {
                                            //     playerIdsList.push(row.Player_Id);
                                            //     selected_player_json.selectedPlayer.push({
                                            //         match_id: row.Match_Id,
                                            //         player_id: row.Player_Id,
                                            //         player_name: row.Player_Name,
                                            //         user_id: row.User_Code,
                                            //         points: row.Credit_Points,
                                            //         credit_points: row.Used_Points,
                                            //         balance_points: row.Balance_Points,
                                            //         player_type: row.Category
                                            //     });
                                            console.log(selected_player_json)
                                            //     console.log(playerIdsList)
                                            // })

                                            $('#loader-container').fadeOut();
                                        }
                                    })

                                })
                            })

                            $(document).ready(function () {
                                $("#preview_team").click(function (event) {
                                    event.preventDefault()

                                    $("#preview-container").css('display', 'flex')
                                    $("#preview-container").empty()
                                    let modal = ' <div class="modal-backdrop">' +
                                        '</div>' +
                                        '<div class="modal-content">' +
                                        '<div class="modal-header">' +
                                        '<h3 class="modal-heading">Your Team Preview</h3>' +
                                        '<span onclick="Close_preview_team()" class="close" title="Close Modal">&times;</span>' +
                                        '</div>' +

                                        '<div class="main-section-container">' +
                                        '<div class="right-content">' +
                                        '<div class="recharge-online-container">' +
                                        '<div class="tabs-container">' +
                                        '<div class="tabs-header" id="tab-header-preview-allrounder"> ' +
                                        '<span class="tab-header-span-preview">All Rounder: </span>' +
                                        '</div>' +

                                        '<div class="tabs-header" id="tab-header-preview-batsmen">' +
                                        '<span class="tab-header-span-preview">Batsmen: </span>' +
                                        '</div>' +

                                        '<div class="tabs-header" id="tab-header-preview-bowler">' +
                                        '<span class="tab-header-span-preview">Bowler: </span>' +
                                        '</div>' +

                                        '<div class="tabs-header" id="tab-header-preview-wicketkeeper">' +
                                        '<span class="tab-header-span-preview">Wicket Keeper: </span>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>'
                                    $("#preview-container").append(modal)

                                    selected_player_json.selectedPlayer.forEach(function (row) {
                                        //console.log(row)
                                        //console.log(row.player_name)
                                        //console.log(row.category)
                                        if (row.player_type == 'ALL ROUNDER') {
                                            var html = '<div class="tabs-header-scroll-section"></div>' +
                                                '<div class="tabs-header-content" id="tab-header-' + index + '"><span class="tabs-header-content-text">' + row.player_name + '</span></div>'
                                            $("#tab-header-preview-allrounder").append(html)
                                        }

                                        else if (row.player_type == 'BATSMEN') {
                                            var html = '<div class="tabs-header-scroll-section"></div>' +
                                                '<div class="tabs-header-content" id="tab-header-' + index + '"><span class="tabs-header-content-text">' + row.player_name + '</span></div>'
                                            $("#tab-header-preview-batsmen").append(html)
                                        }

                                        else if (row.player_type == 'BOWLER') {
                                            var html = '<div class="tabs-header-scroll-section"></div>' +
                                                '<div class="tabs-header-content" id="tab-header-' + index + '"><span class="tabs-header-content-text">' + row.player_name + '</span></div>'
                                            $("#tab-header-preview-bowler").append(html)
                                        }

                                        else if (row.player_type == 'WICKET KEEPER') {
                                            var html = '<div class="tabs-header-scroll-section"></div>' +
                                                '<div class="tabs-header-content" id="tab-header-' + index + '"><span class="tabs-header-content-text">' + row.player_name + '</span></div>'
                                            $("#tab-header-preview-wicketkeeper").append(html)
                                        }
                                    });
                                })
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
//END

Get_scheduled_Match(match_type)


//This function is for player category AllRounder,Batsmen ETC
function getPlayerCategory() {
    $.ajax({
        url: '/GetMatch/GetScheduleMatch/GetPlayerCategory',
        type: 'GET',
        success: function (response) {
            $("#tab-header-player").empty();
            //console.log(response)
            $.each(response, function (index, row) {
                //console.log(row.text, row.value);
                var html = '<div class="tabs-header-scroll-section"></div>' +
                    '<div class="tabs-header-content" id="tab-header-player-' + index + '"><span class="tabs-header-content-text">' + row.text + '</span><span class="tabs-header-content-text" id="tab-header-' + row.text + '"></span></div>'
                $("#tab-header-player").append(html)
            });
            $("#tab-header-player .tabs-header-content-text").click(function () {
                $("#tab-header-player .tabs-header-content-text").removeClass("active");
                $(this).addClass("active");

                player_type = $(this).text();
                //player_count = 0
                getPlayerwithCategory(match_id, player_type) // This is for showing all player from selecting match_id and player_type
                //console.log(selected_player_json)
                // $.each(playerIdsList, function (index, row) {
                //     //console.log(row)

                //     let hide_add_team = "AddTeam-" + row;
                //     let hide_delete_team = "Delete-" + row;



                //     $("#" + hide_add_team).css('display', 'flex')
                //     $("#" + hide_delete_team).css('display', 'flex')

                // })

                //console.log(playerIdsList)

            });

        }
    });
}
//END 


// This is for showing all player from selecting match_id and player_type
function getPlayerwithCategory(param_match_id, param_category_id) {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_id: param_match_id,
                category: param_category_id
            }

            $.ajax({
                url: '/GetMatch/GetScheduleMatch/GetPlayerwithCategory',
                type: 'POST',
                data: formData,
                success: function (response) {
                    player_info = response.data
                    //console.log(player_info)
                    $("#packs-card-container-playerinfo").empty();
                    if (player_info.length > 0) {
                        $.each(player_info, function (index, row) {


                            show_hide = row.Show_Hide
                            let pack_card_detail =
                                '<div class="pack-card-container-playerinfo">' +
                                '<div class="pack-card-content-playerinfo">' +
                                '<div class="pack-card-left-section-playerinfo">' +
                                '<div class="pack-card-details-playerinfo">' +
                                '<div class="pack-card-detail-playerinfo">' +
                                '<h4 class="pack-card-heading-playerinfo">' + row.Player_Name + '</h4>' +
                                '</div>' +

                                '<div class="pack-card-detail-playerinfo">' +
                                '<img  class="view-benefits-heading" src="data:image/jpeg;base64,' + row.Player_Image + '" />' +
                                '</div>' +

                                '<div class="pack-card-detail-playerinfo">' +
                                '<h4 class="pack-card-heading-playerinfo">' + row.Points + '</h4>' +
                                '</div>' +

                                // '<div class="pack-card-detail">' +
                                // '<button class="btn fit" id="captain-' + row.Player_Id + '"> C </button>' +
                                // '<button class="btn fit" id="vice_captain-' + row.Player_Id + '" style="margin-left:10px;"> VC </button>' +
                                // '</div>' +

                                '</div>' +
                                // '<div class="pack-card-benefits-heading-playerinfo">' + row.Category + '</div>' +
                                '</div>' +
                                '<div class="pack-card-right-section-playerinfo">' +
                                '<button class="btn-add fit" id="AddTeam-' + row.Player_Id + '"> + </button>' +
                                '<button class="btn-delete fit" id="Delete-' + row.Player_Id + '" style="display:none"> - </button>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            $("#packs-card-container-playerinfo").append(pack_card_detail)

                            $("#used_points").text(used_points)
                            $("#balance_Credit_points").text(balance_points)



                            // credit_points = row.Credit_Points
                            // used_points = row.Used_Points
                            // balance_points = row.Balance_Points

                            // let cap_btn = 'captain-' + row.Player_Id

                            // $("#" + cap_btn).click(function (event) {
                            //     event.preventDefault()
                            //     value_of_captain = $(this).text().trim()
                            //     player_id = row.Player_Id
                            //     // cap_list.push({
                            //     //     match_id:match_id,
                            //     //     player_id:player_id,
                            //     //     value_of_captain:value_of_captain,
                            //     //     user_code:user_code
                            //     // })

                            //     if (cap_list.length < 1) {
                            //         if (!cap_list.includes(player_id)) {
                            //             cap_list.push({
                            //                 match_id: match_id,
                            //                 player_id: player_id,
                            //                 value_of_captain: value_of_captain,
                            //                 user_code: user_code
                            //             })
                            //             $("#" + cap_btn).removeClass('selected-btn')
                            //             $("#" + cap_btn).addClass('selected-btn')
                            //             console.log(cap_list);
                            //         }
                            //     }
                            // })

                            let delete_player = "Delete-" + row.Player_Id
                            let add_team = "AddTeam-" + row.Player_Id;

                            if (show_hide === '1') {
                                $("#" + delete_player).css('display', 'flex')
                                $("#" + add_team).css('display', 'none')
                                // credit_points = row.used_points
                                // balance_points = row.Balance_Points
                            }
                            else {
                                $("#" + delete_player).css('display', 'none')
                                $("#" + add_team).css('display', 'flex')
                            }

                            $("#" + add_team).click(function () {
                                player_id = row.Player_Id
                                points = row.Points
                                //console.log(points)
                                player_name = row.Player_Name

                                if (playerIdsList.length < 11) {
                                    if (!playerIdsList.includes(player_id)) {
                                        playerIdsList.push(player_id);

                                        used_points += points

                                        balance_points = credit_points - used_points
                                        //console.log(balance_points)
                                        if (balance_points >= 0) {
                                            selected_player_json.selectedPlayer.push({
                                                "match_id": match_id,
                                                "player_id": player_id,
                                                "player_name": player_name,
                                                "user_code": user_code,
                                                "points": credit_points,
                                                "credit_points": used_points,
                                                "balance_points": balance_points,
                                                "player_type": player_type
                                            })
                                            //console.log(selectedPlayer)
                                            console.log(selected_player_json)

                                            $("#used_points").text(used_points)

                                            $("#balance_Credit_points").text(balance_points)

                                            $("#" + delete_player).css('display', 'flex')
                                            $("#" + add_team).css('display', 'none')
                                        }
                                        else {
                                            $("#" + delete_player).css('display', 'none')
                                            $("#" + add_team).css('display', 'flex')
                                        }

                                    }
                                }
                            })

                            $("#" + delete_player).click(function () {

                                //console.log(used_points)
                                player_id = row.Player_Id

                                var indexToDelete = playerIdsList.indexOf(player_id);

                                if (indexToDelete !== -1) {
                                    playerIdsList.splice(indexToDelete, 1);


                                }
                                var indexToDelete_Delete = selected_player_json.selectedPlayer.findIndex(player => player.player_id === player_id);

                                if (indexToDelete_Delete !== -1) {
                                    selected_player_json.selectedPlayer.splice(indexToDelete_Delete, 1);
                                    //console.log(`Player with ID ${player_id} deleted.`);

                                }

                                //     // deletedPlayer.push({
                                //     //     match_id: match_id,
                                //     //     player_id: player_id,
                                //     //     player_name: player_name,
                                //     //     user_code: user_code,
                                //     //     points: credit_points,
                                //     //     credit_points: used_points,
                                //     //     balance_points: balance_points,
                                //     //     player_type: player_type
                                //     // });

                                //     //console.log(deletedPlayer)
                                //     // console.log(playerIdsList)

                                if (used_points >= 0) {
                                    points = row.Points
                                    used_points -= points

                                    balance_points = credit_points - used_points

                                    $("#used_points").text(used_points)

                                    $("#balance_Credit_points").text(balance_points)

                                    console.log(selected_player_json)

                                    $("#" + delete_player).css('display', 'none')

                                    $("#" + add_team).css('display', 'flex')
                                }
                            })

                            //console.log(playerIdsList)
                        })

                        $.each(playerIdsList, function (index, row) {
                            //console.log(row)

                            let hide_add_team = "AddTeam-" + row;
                            let hide_delete_team = "Delete-" + row;

                            $("#" + hide_add_team).css('display', 'none')
                            $("#" + hide_delete_team).css('display', 'flex')

                        })

                    }

                    //console.log(selected_player_json)
                }
            });
            allfields = true;
        }

    }, 500);
}

//END

//This is for showing selected player for the team 
function getloginInfo(param_match_id) {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {
            let formData = {
                match_id: param_match_id
            }
            $.ajax({
                url: '/GetMatch/GetScheduleMatch/GetLoginInfowithCredits',
                type: 'POST',
                data: formData,
                success: function (response) {
                    data = response.data;

                    header_info = data[0]
                    used_points = header_info.Used_Points
                    credit_points = header_info.Credit_Points
                    user_code = header_info.User_Code;
                    balance_points = credit_points - used_points
                    $("#tab-header-userinfo").empty()
                    let html = '<div class="player_credit">' +
                        '<div class="box" id="div1"> Name: <span class="span-player-content">' + header_info.First_Name + ' ' + header_info.Last_Name + '</span></div>' +
                        '<div class="box" id="div1"> Total Credit Points: <span class="span-player-content">' + credit_points + '</span></div>' +

                        '<div class="box" > Used Credit Points: <span class="span-player-content" id="used_points" >' + used_points + '</span></div>' +
                        '<div class="box" > Balance Credit Points: <span class="span-player-content" id="balance_Credit_points" >' + balance_points + '</span></div>' +
                        '</div>'
                    $("#tab-header-userinfo").append(html)
                    //selected_player_json = { selectedPlayer: [] }
                    $.each(data, function (index, row) {
                        playerIdsList.push(row.Player_Id);

                        selected_player_json.selectedPlayer.push({
                            match_id: row.Match_Id,
                            player_id: row.Player_Id,
                            player_name: row.Player_Name,
                            user_id: row.User_Code,
                            points: row.Credit_Points,
                            credit_points: row.Used_Points,
                            balance_points: row.Balance_Points,
                            player_type: row.Category
                        });
                        //console.log(row.Match_Id)
                    })
                }
            });
            allfields = true;
        }

    }, 500);
}

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


