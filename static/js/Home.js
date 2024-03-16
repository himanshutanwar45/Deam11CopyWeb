
function Get_Player_Points() {
    let allfields = false;
    setTimeout(() => {
        if (!allfields) {

            $.ajax({
                url: '/Home/AllTeamPoints',
                type: 'GET',
                success: function (response) {
                    let data = response.data;
                    let colname = response.column;
                    $("#point_details tbody").empty();
                    let series_Name = [];
                    let encountered = {}; // Object to keep track of encountered values

                    $.each(data, function (index, row) {
                        let seriesName = row.Series_Name;
                        if (!encountered[seriesName]) {
                            series_Name.push(seriesName);
                            encountered[seriesName] = true;
                        }
                    });

                    $.each(series_Name, function (index, seriesName) {
                        let html = '<div class="right-session-table-point-detail" style="margin-left:10px;">' +
                            '<table class="styled-table" id="point_details_' + index + '">' +
                            '<thead>' +
                            '<tr>' +
                            '<th>Series Name</th>' +
                            '<th>User Name</th>' +
                            '<th>Total Points</th>' +

                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +

                            '</tbody>' +

                            '</table>' +
                            '</div>'

                        $("#pack-card-detail").append(html)

                        let seriesData = data.filter(function (row) {
                            return row.Series_Name === seriesName;
                        });
                    
                        // Populate table rows with data for the current series
                        var tbody = $("#point_details_" + index + " tbody");
                        seriesData.forEach(function (row) {
                            var tableRow = $('<tr></tr>').appendTo(tbody);
                            tableRow.append('<td>' + row.Series_Name + '</td>'); 
                            tableRow.append('<td>' + row.First_Name + '</td>'); 
                            tableRow.append('<td>' + row.Total_Points + '</td>'); 
                        });


                    })
                }

            })
            allfields = true;
        }

    }, 500);
}

Get_Player_Points()

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

// 
//     window.onload = function () {
//         $('#users-frame').attr('src', '/GetMatch/UpcomminMatches');
//     }
//  

$(document).ready(function () {
    $('#users').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/Users');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#tl').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/GetTeams/TeamList');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#users').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/Admin/Users');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#pc').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/Admin/PasswordChange');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#ml').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/GetMatch/MatchList');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#um').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/GetMatch/UpcomminMatches');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#pt').click(function (event) {
        event.preventDefault();
        $('#users-frame').attr('src', '/PreviewTeam');
        $('#users-frame').css('display', 'block');
        $('#close').css('display', 'block');
    });
});



$(document).ready(function () {
    $('#close').click(function (event) {
        $("#users-frame").css('display', 'none');
        $('#close').css('display', 'none');
    })
})

