var params = new URLSearchParams(window.location.search);
var Match_Id = params.get("match_id");
let team_1 = params.get("team_id")
let team_2 = params.get("team_id_2")
let match_type = params.get('match_type')

let credit_points = 0;
let balance_points = 0;
let used_points = 0;
let playerIdsList = [];
let player_id = "";
let points = "";
let selectedPlayer = [];
let deletedPlayer = [];
let selected_player_json = { selectedPlayer: [] };
let player_type = "";

function getloginInfo(param_match_id) {
    let formData = {
        match_id: param_match_id,
    };
    $.ajax({
        url: "/GetMatch/GetScheduleMatch/GetLoginInfowithCredits",
        type: "POST",
        data: formData,
        success: function (response) {
            data = response.data;

            header_info = data[0];
            used_points = header_info.Used_Points;
            credit_points = header_info.Credit_Points;
            user_code = header_info.User_Code;
            balance_points = credit_points - used_points;
            $("#tab-header-userinfo").empty();
            let html =
                "<div>" +
                '<div class="box">' +
                '<div class="box-child-title">Name: </div>' +
                '<div class="box-child-value"><span >' +
                header_info.First_Name +
                " " +
                header_info.Last_Name +
                "</span></div>" +
                "</div>" +
                '<div class="box">' +
                '<div class="box-child-title">Credit Points: </div>' +
                '<div class="box-child-value"><span>' +
                credit_points +
                "</span></div>" +
                "</div>" +
                '<div class="box">' +
                '<div class="box-child-title">Used Points: </div>' +
                '<div class="box-child-value"><span id="used_points" >' +
                used_points +
                "</span></div>" +
                "</div>" +
                '<div class="box">' +
                '<div class="box-child-title">Balance Points: </div>' +
                '<div class="box-child-value"><span id="balance_Credit_points" >' +
                balance_points +
                "</span></div>" +
                "</div>" +
                "</div>";

            $("#tab-header-userinfo").append(html);

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

        },
    });
}

getloginInfo(Match_Id);

//This function is for player category AllRounder,Batsmen ETC
function getPlayerCategory() {
    $.ajax({
        url: "/GetMatch/GetScheduleMatch/GetPlayerCategory",
        type: "GET",
        success: function (response) {
            $("#tab-header").empty();
            //console.log(response)
            $.each(response, function (index, row) {
                //console.log(row.text, row.value);
                var html = '<div class="tabs-header-scroll-section"></div>';
                if (row.text == "ALL ROUNDER") {
                    html +=
                        '<div class="tabs-header-content" id="tab-header-player"><span class="tabs-header-content-text active">' +
                        row.text +
                        '</span><span class="tabs-header-content-text" id="tab-header-' +
                        row.text +
                        '"></span></div>';
                } else {
                    html +=
                        '<div class="tabs-header-content" id="tab-header-player"><span class="tabs-header-content-text">' +
                        row.text +
                        '</span><span class="tabs-header-content-text" id="tab-header-' +
                        row.text +
                        '"></span></div>';
                }

                $("#tab-header").append(html);
            });

            $("#tab-header-player .tabs-header-content-text").click(function () {
                $("#tab-header-player .tabs-header-content-text").removeClass("active");
                $(this).addClass("active");

                player_type = $(this).text();

                getPlayerwithCategory(Match_Id, player_type); // This is for showing all player from selecting match_id and player_type
            });
        },
    });
}

getPlayerCategory();

player_type = 'ALL ROUNDER'

//END

// This is for showing all player from selecting match_id and player_type
function getPlayerwithCategory(param_match_id, param_category_id) {
    let formData = {
        match_id: param_match_id,
        category: param_category_id,
    };

    $.ajax({
        url: "/GetMatch/GetScheduleMatch/GetPlayerwithCategory",
        type: "POST",
        data: formData,
        success: function (response) {
            //console.log(response)
            player_info = response.data;
            //console.log(player_info)
            $("#packs-card-container-playerinfo").empty();
            if (player_info.length > 0) {
                $.each(player_info, function (index, row) {
                    show_hide = row.Show_Hide;
                    let pack_card_detail =
                        '<div class="pack-card-content">' +
                        '<div class="pack-card-left-section">' +
                        '<div class="pack-card-details">' +
                        '<div class="pack-card-detail">' +
                        '<h4 class="pack-card-heading">' +
                        row.Player_Name +
                        " (" +
                        row.Points +
                        ")</h4>" +
                        "</div>" +
                        '<div class="pack-card-detail">' +
                        '<img  class="view-benefits-heading" src="' +
                        row.Player_Image +
                        '" />' +
                        "</div>" +
                        "</div>" +
                        // '<div class="pack-card-benefits-heading-playerinfo">' + row.Category + '</div>' +
                        "</div>" +
                        '<div class="pack-card-right-section">' +
                        '<button class="btn btn-outline-primary" id="AddTeam-' +
                        row.Player_Id +
                        '"> + </button>' +
                        '<button class="btn btn-outline-danger" id="Delete-' +
                        row.Player_Id +
                        '" style="display:none"> - </button>' +
                        "</div>" +
                        "</div>";
                    $("#packs-card-container-playerinfo").append(pack_card_detail);

                    $("#used_points").text(used_points);
                    $("#balance_Credit_points").text(balance_points);

                    let delete_player = "Delete-" + row.Player_Id;
                    let add_team = "AddTeam-" + row.Player_Id;

                    if (show_hide === "1") {
                        $("#" + delete_player).css("display", "flex");
                        $("#" + add_team).css("display", "none");
                        // credit_points = row.used_points
                        // balance_points = row.Balance_Points
                    } else {
                        $("#" + delete_player).css("display", "none");
                        $("#" + add_team).css("display", "flex");
                    }

                    $("#" + add_team).click(function () {
                        player_id = row.Player_Id;
                        points = row.Points;

                        player_name = row.Player_Name;

                        if (playerIdsList.length < 11) {
                            if (!playerIdsList.includes(player_id)) {
                                if (used_points + points <= credit_points) {
                                    used_points += points;
                                    balance_points = credit_points - used_points;

                                    if (balance_points >= 0) {
                                        playerIdsList.push(player_id);
                                        selected_player_json.selectedPlayer.push({
                                            match_id: Match_Id,
                                            player_id: player_id,
                                            player_name: player_name,
                                            user_code: user_code,
                                            points: credit_points,
                                            credit_points: used_points,
                                            balance_points: balance_points,
                                            player_type: player_type,
                                            player_image: row.Player_Image,
                                        });
                                        //console.log(playerIdsList)
                                        //console.log(selected_player_json);

                                        $("#used_points").text(used_points);

                                        $("#balance_Credit_points").text(balance_points);

                                        $("#" + delete_player).css("display", "flex");
                                        $("#" + add_team).css("display", "none");
                                    } else {
                                        $("#" + delete_player).css("display", "none");
                                        $("#" + add_team).css("display", "flex");
                                    }
                                }
                            }
                        }
                    });

                    $("#" + delete_player).click(function () {
                        //console.log(used_points)
                        player_id = row.Player_Id;

                        var indexToDelete = playerIdsList.indexOf(player_id);

                        if (indexToDelete !== -1) {
                            playerIdsList.splice(indexToDelete, 1);
                        }
                        var indexToDelete_Delete =
                            selected_player_json.selectedPlayer.findIndex(
                                (player) => player.player_id === player_id
                            );

                        if (indexToDelete_Delete !== -1) {
                            selected_player_json.selectedPlayer.splice(
                                indexToDelete_Delete,
                                1
                            );
                            //console.log(`Player with ID ${player_id} deleted.`);
                        }

                        if (used_points >= 0) {
                            points = row.Points;
                            used_points -= points;

                            balance_points = credit_points - used_points;

                            $("#used_points").text(used_points);

                            $("#balance_Credit_points").text(balance_points);

                            console.log(selected_player_json);

                            $("#" + delete_player).css("display", "none");

                            $("#" + add_team).css("display", "flex");
                        }
                    });
                });

                $.each(playerIdsList, function (index, row) {
                    //console.log(row)

                    let hide_add_team = "AddTeam-" + row;
                    let hide_delete_team = "Delete-" + row;

                    $("#" + hide_add_team).css("display", "none");
                    $("#" + hide_delete_team).css("display", "flex");
                });
            }

            //console.log(selected_player_json)
        },
    });
}

getPlayerwithCategory(Match_Id, "ALL ROUNDER");

//END

function Close_preview_team() {
    let divopen = document.getElementById("preview-container");
    divopen.style.display = "none";
    $("#preview-container").empty();
}

$(document).ready(function () {
    $("#preview_team").click(function (event) {
        event.preventDefault();

        $("#preview-container").empty();
        $("#preview-container").css("display", "flex");

        let modal =
            ' <div class="modal-backdrop">' +
            "</div>" +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h3 class="heading">Your Team Preview</h3>' +
            '<span onclick="Close_preview_team()" class="close" title="Close Modal">&times;</span>' +
            "</div>" +
            '<div class="main-section-container">' +
            '<div class="left-content">' +
            '<div class="desc-container">' +
            '<div class="heading">' +
            "<h1> All Players </h1>" +
            "</div> " +
            "</div>" +
            "</div>" +
            '<div class="right-content">' +
            '<div class="recharge-online-container">' +
            '<div class="tabs-container">' +
            '<div class="tabs-content">' +
            '<div class="tabs-conponent">' +
            '<div class="packs-card-container" id="packs-card-container-preview">' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $("#preview-container").append(modal);

        delete_player_id()

        selected_player_json.selectedPlayer.forEach(function (row) {
            //console.log(row);
            let pack_card_detail =
                '<div class="pack-card-content">' +
                '<div class="pack-card-left-section">' +
                '<div class="pack-card-details">' +
                '<div class="pack-card-detail">' +
                '<h4 class="pack-card-heading">' +
                row.player_name +
                "</h4>" +
                "</div>" +
                '<div class="pack-card-detail">' +
                '<img  class="view-benefits-heading" src="' +
                row.player_image +
                '" />' +
                "</div>" +
                "</div>" +
                // '<div class="pack-card-benefits-heading-playerinfo">' + row.Category + '</div>' +
                "</div>" +
                // '<div class="pack-card-right-section">' +
                // '<button class="btn btn-outline-primary" id="AddTeam-' + row.Player_Id + '"> + </button>' +
                // '<button class="btn btn-outline-danger" id="Delete-' + row.Player_Id + '" style="display:none"> - </button>' +
                // '</div>' +
                "</div>";

            $("#packs-card-container-preview").append(pack_card_detail);
        });
    });
});


$(document).ready(function () {
    $("#sys_generated").click(function (event) {
        event.preventDefault();
        let formData = {
            match_type: match_type,
            match_id: Match_Id,
            team_1: team_1,
            team_2: team_2,
        };
        $.ajax({
            url: "/GetMatch/GetScheduleMatch/GetRandomTeamInsert",
            type: "POST",
            data: formData,
            beforeSend: function () {
                $("#loader-container").fadeIn();
            },
            success: function (response) {
                getPlayerCategory();

                getloginInfo(Match_Id);
                getPlayerwithCategory(Match_Id, player_type)
                delete_player_id()
                data = response.data;

                // let body = 
                // '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
                // '<strong id="msg-alert">'+data.Error_Name+'</strong>'+
                // '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                // '</div>'
                // $("#header-msg").append(body)

                // console.log(data)

                //console.log(selected_player_json)

                $("#loader-container").fadeOut();
            },
        });
    });
});

$(document).ready(function () {
    $("#save_team").click(function (event) {
        event.preventDefault();
        var data_json = JSON.stringify(selected_player_json);
        $.ajax({
            type: "POST",
            url: "/GetMatch/GetScheduleMatch/SelectedPlayer",
            contentType: "application/json;charset=UTF-8",
            data: data_json,
            success: function (response) {
                //console.log(response);
                let body =
                    '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
                    '<strong id="msg-alert">' + response.Error_Name + '</strong>' +
                    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>'
                $("#header-msg").append(body)
            },
            error: function (error) {
                //console.error("Error saving data:", error);
                $("#loader-container").fadeOut();
            },
        });
    });
});


function delete_player_id() {
    player_id = 0;

    var indexToDelete = playerIdsList.indexOf(player_id);

    if (indexToDelete !== -1) {
        playerIdsList.splice(indexToDelete, 1);
    }
    var indexToDelete_Delete =
        selected_player_json.selectedPlayer.findIndex(
            (player) => player.player_id === player_id
        );

    if (indexToDelete_Delete !== -1) {
        selected_player_json.selectedPlayer.splice(indexToDelete_Delete, 1);
    }
}