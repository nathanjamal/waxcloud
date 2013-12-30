var key;
if (top === self) {
    var clientId = 'kcnatAysjQ6U57cdPFVHCw'; //live
     //clientId = 'ea0389f188e2f63f1db2e6604ca86bf9';//testing
} else {
    var clientId = '6469a1b1fa0eb606e81121bf06f41a3d'; //fb
}
var scToken;
var userId;
// var baseUrl = 'http://www.waxcloud.com/';
var baseUrl = 'http://www.kindrdapp.com/waxcloud/tablet/';

var delTime;

function fff() {
    if (navigator.userAgent.indexOf("Firefox") != -1) {
        if (top === self) {
            window.location = baseUrl + 'ff.html';
        } else {
            window.location = baseUrl + 'facebook/ff.html';
        }
    }
}
fff();

//check for search hash
var hash = window.location.hash;
if(hash.indexOf('q=')>0){
    var q = hash.replace('#/q=','');
    searchSoundcloud(q,true);
}

blah();

//the one that works
function blah() {
    if (window.location.hash.indexOf('access_token') > 0) {
        var accessToken = window.location.hash.split('&');
        scToken = accessToken[0].replace('access_token=', '').replace('#', '');
        var favorites = 'https://api.soundcloud.com/me/favorites.json?client_id=' + clientId + '&oauth_token=' + scToken + '&limit=50&callback=?';
        var usersTracks = 'https://api.soundcloud.com/me/tracks.json?client_id=' + clientId + '&oauth_token=' + scToken + '&limit=50&callback=?';
        var user = 'https://api.soundcloud.com/me.json?client_id=' + clientId + '&oauth_token=' + scToken + '&callback=?';

        var exclusive = 'https://api.soundcloud.com/me/activities/tracks/exclusive.json?client_id=' + clientId + '&oauth_token=' + scToken + '&callback=?';
        var affiliated = 'https://api.soundcloud.com/me/activities/tracks/affiliated.json?client_id=' + clientId + '&oauth_token=' + scToken + '&callback=?';



        $.getJSON(user, function (data) {
            var avatar = data.avatar_url;
            userId = data.id;
            var heyArray = ['Hey', 'Wa gwaan', 'Hola', 'Yo', 'Ciao', 'Salut', 'As-Salamu Alaykum', 'hoi','здравствуй','Hallo','Oi','konnichiwa', 'haroo'];
            var chosenhey = heyArray[Math.floor(Math.random() * heyArray.length)];

            $('#logged-in-as').html(chosenhey+', <a href="' + data.permalink_url + '" target="_blank" >' + data.username + '</a>')
            .siblings('#profile-pic').children('img').attr('src', avatar.replace('large', 'badge'));
            $('#login').html('<img src="' + baseUrl + 'img/btn-disconnect-s.png" alt="logout of soundclound" />').attr('id', 'logout');
        });

        $.getJSON(favorites, function (data) {
            for (i in data) {
                if (data[i].stream_url != 'undefined') {
                    createAndPlace(data[i]);
                }
            }
            chromeIe();
        });
        $.getJSON(usersTracks, function (data) {
            for (i in data) {
                if (data[i].stream_url != 'undefined') {
                    createAndPlace(data[i]);
                }  
            }
            chromeIe();
        });

       // $.getJSON(exclusive, function (data) {
            //for (i in data.collection) {
           //     createAndPlace(data.collection[i].origin.track, 'incoming');
           // }
           // chromeIe();
      //  });

       /* $.getJSON(affiliated, function (data) {
            for (i in data.collection) {
                createAndPlace(data.collection[i].origin, 'incoming');
            }
            chromeIe();
        });*/

    }else{
        //before soundcloud redirect 
    }
}

function searchSoundcloud(q,place) {
    var searchUrl = 'http://api.soundcloud.com/tracks.json?client_id=' + clientId + '&limit=10?filter=streamable&q='+q;
    $.getJSON(searchUrl + "&format=json&callback=?", function (data) {
        if (place) {
            for (i in data) {
                createAndPlace(data[i]);
            }
        } else {
            $('#search-results').children('li.s-r-row').remove();
            for (i in data) {
                listResults(data[i]);
            }
        }
        chromeIe();
        var loc = (place) ? 'home' : 'desk';
        track('search', loc, q);
    });
}

function chromeIe() {
    if (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Chrome/i))
        $('.recordSleeveBk').addClass('custom_cursor');
}

function listResults(data) {
    var img = (data.artwork_url != '' && data.artwork_url != null)? data.artwork_url + '?tiny': 'img/thumb25.gif';
    var row = '<li class="s-r-row" id="s-r-' + data.id + '"><img src="' + img + '" class="s-r-thumb" width="25" height="25" /><h3 class="s-r-title">' + data.title + '</h3><p class="s-r-artist">' + data.user.username + '</p></li>';
    $('#search-results').removeClass('loading').append(row);
    $('#s-r-' + data.id).data('track-data', data);
}

var vinylCount = 0;

function createAndPlace(data,incoming) {
    var record,
    inc = (incoming != undefined) ? '<img src="' + baseUrl + 'img/incoming.png" class="incoming" alt="incoming />"' : '',
    tagTtl = (data.title != '' && data.title != null) ? data.title.toLowerCase() : '',
    tagArtist = (data.user.username != '' && data.user.username != null) ? data.user.username.toLowerCase() : '',
    tagGenre = (data.genre != '' && data.genre != null) ? data.genre.toLowerCase() : '',
    tagLabel = (data.label_name != '' && data.label_name != null) ? data.title.toLowerCase() : '',
    sleeveArray = ["sleeve","sleeve2","sleeve3","sleeve4","sleeve5","sleeve6"];

    var sleeve = sleeveArray[i % sleeveArray.length];
    var patternFunc = (window.location.hash.indexOf('q=')>0) ? 'flapped4' : 'flapped';
    
    if (data.artwork_url != null && data.artwork_url != undefined) {
        img = data.artwork_url;
        var record = '<div style="' + executeFunctionByName(patternFunc, window, vinylCount) + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt"><img src="' + img + '" width="144" height="144" alt="" /><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" />' + inc + '</div></div>';
    } else {
        var record = '<div style="' + executeFunctionByName(patternFunc, window, vinylCount) + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt whiteLabel"><span style="-webkit-transform:rotate(' + randomFromTo(-3, 3) + 'deg);font-size:' + randomFromTo(19, 23) + 'px;" class="artist">' + data.user.username + '</span><span class="album"  style="-webkit-transform:rotate(' + randomFromTo(-4, 4) + 'deg);font-size:' + randomFromTo(19, 22) + 'px;">' + data.title + '</span><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" />' + inc + '</div></div>';
    }

    $('body').append(record);
    $('#' + data.id).draggable({ containment: 'window',
        start: function () {
            search(''); $('h3.bubble').fadeOut(100); 
            if( $(this).children('img.record').length > 0 ){//dont wanna do it when the record is on the deck
                delTime = setTimeout(function(){
                    $('#delete-area').fadeIn(500);   
                },300);
            }
        },stop: function () {
            clearTimeout(delTime);
            $('#delete-area').fadeOut(300);   
        }
    });
    vinylCount++;
}

var centerPoint = {};
    centerPoint.cpT = ($(window).height() / 2),
    centerPoint.cpL = ($(window).width() / 2) - 290;

    function flapped(i) {
        var output;
        i = parseInt(i);
        if (i <= 10) {
            i = i + 2;
            output = 'left:' + randomFromTo(28, 32) + 'px; top:' + (parseInt(i) * parseInt(randomFromTo(35, 40)) ) + 'px; z-index:'+i+';';
        } else if (i > 10 && i <= 20) {
            i = i + 1;
            output = 'left:' + randomFromTo(202, 206) + 'px; top:' + ((parseInt(i) - 10) * parseInt(randomFromTo(35, 40))) + 'px; z-index:' + i + ';';
        } else if (i > 20 && i <= 30) {
            i = i + 1;
            output = 'left:' + randomFromTo(362, 366) + 'px; top:' + ((parseInt(i) - 20) * parseInt(randomFromTo(35, 40))) + 'px; z-index:' + i + ';';
        } else if (i > 30 && i <= 40) {
            i = i + 1;
            output = 'left:' + randomFromTo(520, 524) + 'px; top:' + ((parseInt(i) - 30) * parseInt(randomFromTo(35, 40))) + 'px; z-index:' + i + ';';
        }

        return output;
    }
    
    function flapped4(i) {
        var output;
        i = parseInt(i);
        if (i <= 3) {
            i = i + 1;
            output = 'left:' + randomFromTo(28, 32) + 'px; top:' + (parseInt(i) * parseInt(randomFromTo(55, 60)) ) + 'px; z-index:'+i+';';
        } else if (i > 3 && i <= 7) {
            i = i + 1;
            output = 'left:' + randomFromTo(202, 206) + 'px; top:' + ((parseInt(i) - 4) * parseInt(randomFromTo(55, 60))) + 'px; z-index:' + i + ';';
        } else if (i > 7 && i <= 11) {
            i = i + 1;
            output = 'left:' + randomFromTo(362, 366) + 'px; top:' + ((parseInt(i) - 8) * parseInt(randomFromTo(55, 60))) + 'px; z-index:' + i + ';';
        }
        return output;
    }
    
    function executeFunctionByName(functionName, context , args ) {
      //var args = Array.prototype.slice.call(arguments).splice(2);
      var args = new Array(args.toString()); 
      var namespaces = functionName.split(".");
      var func = namespaces.pop();
      for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }
      return context[func].apply(this, args);
    }

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function search(q) {
    q = (q != undefined) ? q.toLowerCase() : '' ;
    if (q == '') {
        $('.recordSleeveBk').css({ opacity: '1.0' }).removeClass('glow');
    } else {
        $('.recordSleeveBk').css({ opacity: '0.4' }).removeClass('glow');
        $('.recordSleeveBk').filter('[data-artist*="' + q + '"]').animate({ opacity: '1.0' }).addClass('glow');
        $('.recordSleeveBk').filter('[data-title*="' + q + '"]').animate({ opacity: '1.0' }).addClass('glow');
        $('.recordSleeveBk').filter('[data-genre*="' + q + '"]').animate({ opacity: '1.0' }).addClass('glow');
        $('.recordSleeveBk').filter('[data-label*="' + q + '"]').animate({ opacity: '1.0' }).addClass('glow');
    }
}

function playPause(play,btn) {
    if (play == 1 && $('#playerEngine')[0].readyState > 0 && $('#playerEngine')[0].paused == true) {
        spinRecord();
        $('#playerEngine')[0].play();
        $('#crackle')[0].play();
        var played = $('#playerEngine')[0].currentTime,
        dur = $('#playerEngine')[0].duration,
        remaining = (dur - played);
        if (remaining != NaN) {
            var aniDur = Math.ceil(remaining * 1000);
            $('#arm').animate({ rotate: '37deg' }, aniDur);
        }
        btn.attr('data-paused', 0);
    } else if (play != 1 && $('#playerEngine')[0].paused == false && $('#playerEngine')[0].ended == false) {
        $('#playerEngine')[0].pause();
        $('#crackle')[0].pause();
        clearInterval(spin);
        $('#arm').stop();
        btn.attr('data-paused', 1);
    }
}

function warmingUp(on) {
    var msg2, msg3, msg4;
    if (on == true) {
        $('#player-status').text('Warming up...').show();
        msg2 = setTimeout(function () { $('#player-status').text('Not long now...') }, 5000);
        msg3 = setTimeout(function () { $('#player-status').text('Its coming, I promise.') }, 10000);
        msg4 = setTimeout(function () { $('#player-status').text('Hmm... Sorry this is taking a while.') }, 20000);
    } else {
        clearTimeout(msg2);
        clearTimeout(msg3);
        clearTimeout(msg4);
        $('#player-status').text('').hide();
    }
}

function setArm() {
    $('#arm').animate({ rotate: '19deg' }, 800, function () {
        $('#crackle')[0].play();
        var dur = $('#playerEngine')[0].duration;
        if (dur != NaN) {
            var aniDur = Math.ceil(dur * 1000);
            $('#arm').animate({ rotate: '37deg' }, aniDur);
        }
        warmingUp(false);
        var a = $('#playerEngine').attr('src');
        var audio = new Audio(a);
        audio.play();
       // $('#playerEngine')[0].play();
        setTimeout(function () {
            //alert($('#playerEngine')[0].readyState);
            var loc = (window.location.href.indexOf('/single/') > 0) ? 'single' : 'desk';
            var name = $('#player').attr('data-current');
            track('play', loc, name);
        }, 1000);
    });
}
var spin;
function spinRecord() {
    spin = setInterval(function () { $('#player').children('#deck').animate({ rotate: '+=10deg' }, 0, 'linear'); }, 35);    					
}
var test
function isReady() {
    spinRecord();
    showSocial(1);
    setArm();
    //$('#playerEngine')[0].play();
    //test = setInterval(function () {
        //alert($('#playerEngine')[0].readyState);
        //if ($('#playerEngine')[0].readyState > 0) {
            //setArm();
            //clearInterval(test);
       // }
    //}, 200);
}

function setSocial(name, perma) {
    $('#og-url').attr('content', perma);
    $('#share-link-textbox').val(perma).parent('#link-cont')
    .siblings('#fb-share').attr('href', 'http://www.facebook.com/dialog/feed?app_id=105834392861915&display=popup&link=' + encodeURIComponent(perma) + '&message=Listening%20to%20' + encodeURIComponent(name) + '%20on%20vinyl&caption=' + encodeURIComponent(name) + '%20on%20vinyl&description=' + encodeURIComponent(perma) + '&redirect_uri=' + encodeURIComponent('http://www.waxcloud.com/close.html'))
    .siblings('#tw-share').attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(name) + '%20via%20%23WAXCLOUD&url=' + encodeURIComponent(perma));  
}

function showSocial(on) {
    if (on != undefined) {
        $('#social-cont').fadeIn();
    } else {
        $('#social-cont').fadeOut();
        $('#og-url').attr('content', 'baseUrl');
    }
}

function removeRecord1(element) {
    var record = $('#player').children('#deck').children('.record');

    showSocial();

    $('#playerEngine')[0].pause();
    $('#crackle')[0].pause();
    $('#playerEngine').attr('src', '');
    clearInterval(spin);
    clearInterval(test);
    $('#arm').stop().animate({ rotate: '0deg' },800);

    record.addClass('loose')
    .appendTo('#player')
    .draggable({ stop: function () {
        removeRecord2();
        }
    });

    if (element != undefined) {
        removeRecord2(element);
    }
}

function removeRecord2(element) {
    var record = $('.loose');
    var id = record.attr('id').replace('record', '');
    record
    .prependTo('#' + id).animate({ 'top': '0px', 'left': '-1px' }, 100, function () { record.attr('style', '').removeClass('loose'); })
    .parents('#' + id).animate({ opacity: '1.0' });

    clearInterval(spin);
    clearInterval(test); //done twice for security. bad
    record.animate({ 'top': '0px', 'left': '-1px' }).draggable("destroy");
    warmingUp(false); //some time the msg get put back
    showSocial();
    if (element != undefined) {
        setRecord(element);
    }
}

function setRecord(recordSleeveBk) {
    var stream = recordSleeveBk.attr('data-stream');
    var record = recordSleeveBk.children('img.record');
    var name = recordSleeveBk.attr('data-title') + ' by ' + recordSleeveBk.attr('data-artist');
    var perma = 'http://www.waxcloud.com/single/#/' + name.replace(/ /g, '-').replace(/\//g, '-') + '/' + recordSleeveBk.attr('id');
    setSocial(name, perma);
    $('#player').attr('data-current',name)
    .children('#playerEngine').attr('src', stream + '?client_id=' + clientId);
    record.appendTo('#deck').animate({ 'top': '11px', 'left': '11px' }, 200);
    if ($('#deck').children('img.record').length > 0) {
        warmingUp(true);
    }
    isReady();
    record.draggable({ start: function () { removeRecord1(); }, stop: function () { } });
    recordSleeveBk.animate({ 'top': $(window).height() - 167 + 'px', 'left': $('#player').offset().left - 175 + 'px', opacity: '0.8' }, 400);
}

function zindexShuffle(z) {
    var max = $('div.recordSleeveBk').length,
    prevZ = z.css('z-index');
    z.css('z-index', max);
    $('div.recordSleeveBk').each(function () {
        var curr = $(this);
        if (parseInt(curr.css('z-index')) > prevZ) {
            curr.css('z-index', parseInt(curr.css('z-index')) - 1);
        }
    });
}

function switchSource(s) {
    vinylCount = 0;
    clearBoard();
    if (s == 1) {
        
    } else {
        blah();
    }            
}

function clearBoard() {
    $('div.recordSleeveBk').remove();
}

function track(type, loc, name) {
        _gaq.push(['_trackEvent', type, loc, name]);
}

function appearAnimate(ele,pos){
    ele.attr('data-animating', 'true').scale('0.1').rotate('-320deg').animate({ scale: '1', rotate: pos + 'deg' }, 500, function () { ele.attr('data-animating', 'false'); });
}
function removeAnimate(ele) {
    ele.stop().attr('data-animating', 'true').animate({ scale: '0', rotate: '360deg' }, 500, function () { ele.attr('data-animating', 'false').remove(); $('h3.bubble').hide(); });
}

$(document).ready(function () {
    $('body').height($(window).height());
    
    /*if(navigator.userAgent.indexOf('MSIE')>0){  
        $('#init-connect').css('margin-bottom','20px')
        .siblings('#or').hide()
        .siblings('#home-search').hide();
        $('#sc-search').hide();
    }*/

    if (top === self) {
        //live
        $('#init-connect').attr('href', 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://www.waxcloud.com/board.html');
        //test
        //$('#init-connect').attr('href', 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://localhost:49426/MyRecords-POC/board.html');
    } else {
        $('#init-connect').attr('href', 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://www.waxcloud.com/facebook/board.html');
    }

    $("#player").droppable({
        drop: function (event, ui) {
            var element = $(ui.draggable[0]);
            if (element.is('#deck') == false) {
                if ($('#deck').children('.record').length > 0) {//if theres a record playing remove it
                    removeRecord1(element);
                } else {
                    setRecord(element);
                }
            }
        }
    });

    $("#delete-area").droppable({
        hoverClass: "hover",
        drop: function (event, ui) {
            var element = $(ui.draggable[0]);

            removeAnimate(element);
            $("#delete-area").delay(500).fadeOut(300);
        }
    });

    $("#search").keypress(function () {
        var q = $(this).val();
        search(q);
    }).change(function () {
        var q = $(this).val();
        search(q);
    })
    .blur(function () {
        var q = $(this).val();
        search(q);
    });

    $('#logged-in-as').mouseover(function () {
        $('#profile-pic').show().stop().animate({ opacity: '1.0', 'top': '40px' });
    }).mouseout(function () {
        $('#profile-pic').stop().animate({ opacity: '0.0', 'top': '35px' }, function () { $('#profile-pic').hide() });
    });

    $('.recordSleeveBk').live('mousemove', function (e) {
        if ($(this).hasClass('ui-draggable-dragging') == false) {
            var title = $(this).attr('data-title'),
            artist = $(this).attr('data-artist');
            $('h3.bubble').remove();
            $('body').append('<h3 class="bubble">' + title + '-' + artist + '</h3>');
            $('h3.bubble').css({ 'top': e.pageY - 40, 'left': e.pageX });
        }
    }).live('mouseover', function () {
        if ($(this).attr('data-animating') != 'true') {
            $(this).stop().animate({ rotate: '-2deg' }, 200)
            .children('img.record').stop().animate({ 'left': '20px' }, 200);
        }
    }).live('mouseout', function () {
        if ($(this).attr('data-animating') != 'true') {
            $('h3.bubble').fadeOut(100);
            $(this).stop().animate({ rotate: randomFromTo(-3, 3) + 'deg' }, 200)
            .children('img.record').stop().animate({ 'left': '0px' }, 200);
        }
    }).live('mousedown', function () {
        var z = $(this);
        zindexShuffle(z);
    });


    $('#start-stop').click(function () {
        var btn = $(this);
        if (btn.attr('data-paused') == 0) {
            playPause(0, btn);
            //btn.attr('data-paused', 1);
        } else {
            playPause(1, btn);
            //btn.attr('data-paused', 0);
        }
        return false;
    });

    /* $(window).keyup(function (e) {
    if (e.keyCode == 32) {
    var btn = $('#start-stop');
    if (btn.attr('data-paused') == 0) {
    playPause(0);
    btn.attr('data-paused', 1);
    } else {
    playPause(1);
    btn.attr('data-paused', 0);
    }
    }
    }); */

    $("#login").click(function () {
        if (top === self) {
            //live  
            window.location = 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://www.waxcloud.com/';
            //testing  
            //window.location = 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://localhost:49426/MyRecords-POC/board.html';
        } else {
            window.location = 'https://soundcloud.com/connect?client_id=' + clientId + '&response_type=token&redirect_uri=http://www.waxcloud.com/facebook/board.html';
        }
        return false;
    });

    $("#logout").click(function () {
        window.location = 'index.html';
        return false;
    });

    $("a.social-btn").click(function () {
        var name = $('#player').attr('data-current');
        var loc;
        if ($(this).attr('id') == 'link-share') {
            loc = 'link';
            $('#share-link-textbox').val()
        } else {
            var url = $(this).attr('href');
            window.open(url, "", "height=350,width=500");
            loc = (url.indexOf('facebook.com') > 0) ? 'fb' : 'twtr';
        }

        track('share', loc, name);
        return false;
    });

    var linkTimeout;
    $("#link-share").click(function () {
        $("#link-cont").fadeIn();

        //$("#share-link-textbox").focus();
        //$("#share-link-textbox").select();
    }).mouseout(function () {
        linkTimeout = setTimeout(function () { hideLink(); }, 500);
    }).mouseover(function () {
        clearTimeout(linkTimeout);
    });

    $("#link-cont").mouseout(function () {
        linkTimeout = setTimeout(function () { hideLink(); }, 500);
    }).mouseover(function () {
        clearTimeout(linkTimeout);
    });

    $("#share-link-textbox").click(function () {
        $(this).focus();
        $(this).select();
    });

    function hideLink() {
        $("#link-cont").fadeOut();
    }

    //search source stuff
    var hideSearchResults;
    $('#search-results').hover(function () {
        clearTimeout(hideSearchResults);
        $('body').unbind('click');
    }, function () {
        hideSearchResults = setTimeout(function () {
            $('#search-results').fadeOut();
            $('body').unbind('click');
        }, 5000);
        $('body').click(function () {
            $('#search-results').fadeOut();
            $('body').unbind('click');
        });
    });

    $('#sc-search').keypress(function (e) {
        var q = $(this).val();
        if (e.keyCode == 13) {
            $('#search-results').addClass('loading').fadeIn();
            searchSoundcloud(q);
        }
    });

    $('li.s-r-row').live('click', function () {
        var data = $(this).data('track-data');
        createAndPlace(data);
        chromeIe();
    });

    $('#home-search').focus(function () {
        if ($(this).val() == 'Search for some music') {
            $(this).val('');
        }
    }).blur(function () {
        if ($(this).val() == '') {
            $(this).val('Search for some music');
        }
    }).keypress(function (e) {
        var q = $(this).val();
        if (e.keyCode == 13) {
            window.location = baseUrl + 'board.html#/q=' + q;
            searchSoundcloud(q);
        }
    });
});