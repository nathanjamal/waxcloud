
var trackId;
var name;
    var hash = window.location.hash;
    hash = hash.split('/');
    trackId = hash[2];
    name = decodeURIComponent(hash[1].replace(/-/g,' ') );

    //set og tags
    $('#og-url').attr('content', window.location.href);
    $('#og-title').attr('content', name);

var single = 'https://api.soundcloud.com/tracks/'+trackId+'.json?client_id='+ clientId;

$.getJSON(single + "&format=json&callback=?", function (data) {
    createAndPlaceOne(data);
    chromeIe();
});


function createAndPlaceOne(data) {
    var record,
    tagTtl = (data.title != '' && data.title != null) ? data.title.toLowerCase() : '',
    tagArtist = (data.user.username != '' && data.user.username != null) ? data.user.username.toLowerCase() : '',
    tagGenre = (data.genre != '' && data.genre != null) ? data.genre.toLowerCase() : '',
    tagLabel = (data.label_name != '' && data.label_name != null) ? data.title.toLowerCase() : '',
    sleeveArray = ["sleeve", "sleeve2", "sleeve3", "sleeve4", "sleeve5", "sleeve6"];

    var sleeve = sleeveArray[randomFromTo(0, 5)];

    if (data.artwork_url != null && data.artwork_url != undefined) {
        img = data.artwork_url;
        var record = '<div style="z-index:10;' + inTheCenter() + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt"><img src="' + img + '" width="144" height="144" alt="" /><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" /></div></div>';
    } else {
        var record = '<div style="z-index:10;' + inTheCenter() + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt whiteLabel"><span style="-webkit-transform:rotate(' + randomFromTo(-3, 3) + 'deg);font-size:' + randomFromTo(19, 23) + 'px;" class="artist">' + data.user.username + '</span><span class="album"  style="-webkit-transform:rotate(' + randomFromTo(-4, 4) + 'deg);font-size:' + randomFromTo(19, 22) + 'px;">' + data.title + '</span><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" /></div></div>';
    }

    $('body').append(record);
    $('#' + data.id).draggable({ containment: 'window', start: function () { search(''); $('h3.bubble').fadeOut(100); } });

    $('body').append('<h3 class="bubble" style="display:none;' + inTheCenter('bubble') + '"><strong>Play me!</strong></h3>');
    $('h3.bubble').delay(1200).fadeIn(500);
}

function inTheCenter(bubble) { //return style data to place one vinyl in the center of the page
    if (bubble == undefined) {
        var top = ($(window).height() / 2) - 72; //72 is half record height
        var left = (($(window).width() - 260) / 2) - 72; //260 is player width 72 is half record width
        return 'left:' + left + 'px;top:' + top + 'px;';
    } else {
        var top = ($(window).height() / 2) - 20; //72 is half record height
        var left = (($(window).width() - 260) / 2) - 30; //260 is player width 72 is half record width
        return 'left:' + left + 'px;top:' + top + 'px;';
    }
    
}