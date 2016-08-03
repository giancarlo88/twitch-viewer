



var html = ""

var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "brunofin", "comster44", "RobotCaleb", "thomasballinger", "beohoff", "LIRIK", "mitchflowerpower"]
var write = function(code){
    setTimeout(function(){$("tbody").append(code)}, 1000);
}

var getData = function (channel) {
    $.getJSON("https://api.twitch.tv/kraken/streams?channel=" + channel, function (data) {
        if (data._total !== 0) { //if channel is streaming
            html += "<tr class = 'table-success'><td><a href = 'http://www.twitch.tv/'" + data.streams[0].channel.display_name + "'><img src='" + data.streams[0].channel.logo + "'></img></a></td><td><a href = 'http://www.twitch.tv/" + channel + "'>" + data.streams[0].channel.display_name + "</a></td><td>Currently Playing: " + data.streams[0].game + "</tr>"
            
        } else { //if channel is not streaming
            $.getJSON("https://api.twitch.tv/kraken/users/" + channel, function (data2) {
                    //look up the user API instead
                    if (data2.logo !== null) { //if there is a logo in the user API, use it
                        html += "<tr class = 'table-danger'><td><a href = 'http://www.twitch.tv/" + data2.display_name + "'><img src='" + data2.logo + "'></img></a></td><td><a href = 'http://www.twitch.tv/" + channel + "'>" + channel + "</a></td><td>Offline</tr>";

                    } else { //if there is no logo, use a placeholder instead

                        html += "<tr class = 'table-danger'><td><a href = 'http://www.twitch.tv/" + channel + "'><img src='http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png'></img></a></td><td><a href = 'http://www.twitch.tv/" + channel + "'>" + channel + "</a></td><td>Offline</td></tr>";
                    }
                })
                .fail(function () { //if there is no user found
                    html += "<tr class = 'table-danger'><td><a href = 'http://www.twitch.tv/" + channel + "'><img src='http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png'></img></td><td>" + channel + "</td><td>User does not exist.</td></tr>"

                })
        }
    });
};

var streamSearch = function () {
    var html2 = "<br><br>Results (Click to add to list): <p>";
    var srch = "";
    var i;
    srch = $("#searchbox").val();
    $.getJSON("https://api.twitch.tv/kraken/search/channels?q=" + srch, function (data3) {
        if (data3._total === 0) {
            html2 = "Sorry! There are no matches for your search.";
        } else {
            for (i = 0; i < data3.channels.length; i++) {
                html2 += "<a class='results' id = '" + data3.channels[i].display_name + "'> " + data3.channels[i].display_name + " </a>// "

            }
        }
        $("#results").html(html2)
    })



}

$("#button").click(streamSearch);

$("body").on('click', '.results', function () {
    var rslt= $(this).attr("id");
    $(this).replaceWith("<span id ='" + rslt + "'class='text-muted'>Adding...</span>"); 
    html =""
    getData(rslt);
    setTimeout(function(){write(html);
                          $("#"+rslt).replaceWith("<span class ='text-muted'>Added!</span")
                         ;}, 1000)})

$("#searchbox").keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        streamSearch();
    }
});


$("body").on("click", "#online", function () {
    $(".table-danger").addClass("hidn");
    $(".table-success").removeClass("hidn");
});

$("body").on("click", "#offline", function () {
    $(".table-success").addClass("hidn");
    $(".table-danger").removeClass("hidn");

});

$("body").on("click", "#all", function () {
    $(".table-success").removeClass("hidn");
    $(".table-danger").removeClass("hidn");
})

$("document").ready(function () {
    for (var j = 0; j < streamers.length; j++) {
        getData(streamers[j])};
        setTimeout(function(){$("#loading").addClass("hidn");
        write(html)}, 3000);
        $("#srch").removeClass("hidn");
    })