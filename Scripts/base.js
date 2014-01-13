var key,
    retina = window.devicePixelRatio > 1,
    scToken,
    userId,
    baseUrl = 'http://www.waxcloud.com/',
    //baseUrl = 'http://waxcloud.dev/',//testinh
    clientId = 'kcnatAysjQ6U57cdPFVHCw',
    //clientId = 'ea0389f188e2f63f1db2e6604ca86bf9',//testinh
    delTime,
    vinylCount = 0,
    sleeveArray = ["sleeve","sleeve2","sleeve3","sleeve4","sleeve5","sleeve6"],
    heyArray = [
        'Hey', 
        'Wa gwaan', 
        'Hola', 
        'Yo', 
        'Ciao', 
        'Salut', 
        'As-Salamu Alaykum', 
        'hoi',
        'здравствуй',
        'Hallo',
        'Oi',
        'konnichiwa',
        'haroo'
    ],

    commonEle = {
        win: undefined
    },

    centerPoint = {
        cpT: undefined,
        cpL: undefined
    };


// function fff() {
//     if (navigator.userAgent.indexOf("Firefox") != -1) {
//         if (top === self) {
//             window.location = baseUrl + 'ff.html';
//         } else {
//             window.location = baseUrl + 'facebook/ff.html';
//         }
//     }
// }
// fff();

//check for search hash
var hash = window.location.hash;
if(hash.indexOf('q=')>0){
    var q = hash.replace('#/q=','');
    searchSoundcloud(q,true);
}


function searchSoundcloud(q,place) {
    var searchUrl = 'http://api.soundcloud.com/tracks.json?client_id=' + clientId + '&limit=10?filter=streamable&q='+q;
    $.getJSON(searchUrl + "&format=json&callback=?", function (data) {
        if (place) {
            for (i in data) {
                Soundcloud.Press_and_place(data[i]);
            }
        } else {
            $('#search-results').children('li.s-r-row').remove();
            for (i in data) {
                listResults(data[i]);
            }
        }

        var loc = (place) ? 'home' : 'desk';
        Tracking.Google('search', loc, q);
    });
}


function listResults(data) {
    var img = (data.artwork_url != '' && data.artwork_url != null)? data.artwork_url + '?tiny': 'img/thumb25.gif';
    var row = '<li class="s-r-row" id="s-r-' + data.id + '"><img src="' + img + '" class="s-r-thumb" width="25" height="25" /><h3 class="s-r-title">' + data.title + '</h3><p class="s-r-artist">' + data.user.username + '</p></li>';
    $('#search-results').removeClass('loading').append(row);
    $('#s-r-' + data.id).data('track-data', data);
}


function flapped(i) {
  
    i = parseInt(i);

    var output;

    //find out how much horizontal space we have to play with
     // 280 is space taken up by player, 28 is the left margin, 160 is record col width
    var maxCols = Math.floor((commonEle.win.width() - (280+28) )/160);

    //find what col we should place this in
    var pos = Math.floor(i / 10);

    //if we are not passed the max cols, place in col. else, place in pile
    if( pos < maxCols ){

        var leftFrom = 28+(pos*160),
            leftTo = leftFrom+4,
            leftPos = randomFromTo(leftFrom, leftTo),
            zIndex = (pos == 0)? i + 2 : i + 1,
            zeroedPos = (pos == 0)? i+2 : (i+2) - (pos*10),
            topPos = parseInt(zeroedPos) * parseInt(randomFromTo(35, 40));

    }else{

        var leftPos = randomFromTo(50, 55),
            zIndex = i + 1,
            topPos = randomFromTo(557, 561);

    }

    //build style
    output = 'left:'+leftPos+'px; top:'+topPos+'px; z-index:'+zIndex+';';

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
        $('div.recordSleeveBk').css({ opacity: '1.0' }).removeClass('glow');
    } else {

        var records = $('div.recordSleeveBk');
        
        records.css({ opacity: '0.4' }).removeClass('glow');

        var matchedEles = records.filter(function( index ) {

            var output;
            if( 
                $(this).is('[data-artist*="' + q + '"]') || 
                $(this).is('[data-title*="' + q + '"]') || 
                $(this).is('[data-genre*="' + q + '"]') || 
                $(this).is('[data-label*="' + q + '"]')
            ){
                return true;
            }else{
                return false;
            }

        });
    
        TweenMax.to(matchedEles, .3, {opacity: 1, className: '+=glow'});

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
            aniDur = aniDur*0.001;//change to seconds
            //$('#arm').animate({ rotate: '37deg' }, aniDur);
            TweenMax.to($('#arm'), aniDur, {rotation: "37_cw" });
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

    TweenMax.to($('#arm'), 0.8, {rotation: "19_cw", onComplete: function(){
            //play clackle
            $('#crackle')[0].play();
            
            //get track length and set arm to move ar right speed
            var dur = $('#playerEngine')[0].duration;
            if (dur != NaN) {
                var aniDur = Math.ceil(dur * 1000);
                aniDur = aniDur*0.001;
                //$('#arm').animate({ rotate: '37deg' }, aniDur);
                TweenMax.to($('#arm'), aniDur, {rotation: "37_cw" });
            }

            //remove loading
            warmingUp(false);

            //play record
            setTimeout(function () {
                $('#playerEngine')[0].play();
                var loc = (window.location.href.indexOf('/single/') > 0) ? 'single' : 'desk';
                var name = $('#player').attr('data-current');
                
                Tracking.Google('play', loc, name);

            }, 1000);

        } 
    });
    
    // $('#arm').animate({ rotate: '19deg' }, 800, function () {

    // });
}
var spin;
function spinRecord() {
    spin = setInterval(function () { 
        //$('#player').children('#deck').animate({ rotate: '+=10deg' }, 0, 'linear');
        TweenMax.to($('#deck'), 0, {rotation: "+=10_cw" });
    }, 35);    					
}

var test
function isReady() {
    spinRecord();
    showSocial(1);
    test = setInterval(function () {
        if ($('#playerEngine')[0].readyState > 0) {
            setArm();
            clearInterval(test);
        }
    }, 200);
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
    //$('#arm').stop().animate({ rotate: '0deg' },800);
    TweenMax.to($('#arm'), 0.8, {rotation: "0_ccw" });

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
    var slug = name.replace(/-/g, ' ')
                .replace(/\//g, ' ')
                .replace(/   /g, ' ')
                .replace(/  /g, ' ');
    var perma = 'http://www.waxcloud.com/single/#/' + slug + '/' + recordSleeveBk.attr('id');
    setSocial(name, perma);
    
    $('#player').attr('data-current',name)
        .children('#playerEngine').attr('src', stream + '?client_id=' + clientId);
    
    record.appendTo('#deck');
    TweenMax.to(record, 0.2, {left: '11px',top: '11px'});

    if ($('#deck').children('img.record').length > 0) {
        warmingUp(true);
    }
    isReady();
    record.draggable({ start: function () { removeRecord1(); }, stop: function () { } });
    //recordSleeveBk.animate({ 'top': commonEle.win.height() - 167 + 'px', 'left': $('#player').offset().left - 175 + 'px', opacity: '0.8' }, 400);

    TweenMax.to(recordSleeveBk, 0.4, {
        left: ($('#player').offset().left - 175)+'px',
        top: (commonEle.win.height() - 167)+'px',
        opacity: '0.8'
    });

    //send tracl to latest plays
    Tracking.Plays(recordSleeveBk.attr('id'), name, slug, recordSleeveBk.children('div.recordSleeveFrt').children('img').eq(0).attr('src') );   
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


function appearAnimate(ele,pos){
    ele.attr('data-animating', 'true');

    TweenMax.fromTo(ele, 0.5, 
        {
            scale: 0.1,
            rotation: '360_ccw'
        },
        {
            scale: 1,
            rotation: pos+'_cw',
            onComplete: function () { ele.attr('data-animating', 'false'); }
        }
    );
}

function removeAnimate(ele) {
    ele.stop().attr('data-animating', 'true');

    TweenMax.to(ele, 0.5, 
        {
            scale: 0,
            rotation: '360_cw',
            onComplete: function () {
                ele.attr('data-animating', 'false').remove(); 
                $('h3.bubble').hide(); 
            }
        }
    );
}

var Tracking = {

    Google: function(type, loc, name) {
        _gaq.push(['_trackEvent', type, loc, name]);
    },

    Plays: function(id, name, slug, img) {
        var base = (window.location.href.indexOf('http://www.')==0)? 'http://www.waxcloud.com/' : 'http://waxcloud.com/';

        $.post(
            base+"data-send.php",
            {
                id: id,
                name: name,
                slug: slug,
                img: img
            },
            function(data){
                //console.log(data);
            }
        );

    }

};

var Soundcloud = {

    Login: function(extention){

        if(extention == undefined)
            extention = '';

        window.location = 'https://soundcloud.com/connect?client_id='+clientId+'&response_type=token&redirect_uri='+baseUrl+extention;
          
    },

    Get_sc_token: function(){

        if (window.location.hash.indexOf('access_token') > 0) {

            var accessToken = window.location.hash.split('&');

            scToken = accessToken[0].replace('access_token=', '').replace('#', '');

            return scToken;

        }else{

            return false;
        }

    },

    Init_new_user: function() {

        if (window.location.hash.indexOf('access_token') > 0) {

            var token = Soundcloud.Get_sc_token();

            var user = 'https://api.soundcloud.com/me.json?client_id='+clientId+'&oauth_token='+token+'&callback=?';

            //get user data
            $.getJSON(user, function (data) {
                
                userId = data.id;   
                var avatar = data.avatar_url;
                var chosenhey = heyArray[Math.floor(Math.random() * heyArray.length)];

                $('#logged-in-as')
                    .html(chosenhey+', <a href="'+data.permalink_url+'" target="_blank" >'+data.username+'</a>')
                    .siblings('#profile-pic')
                        .children('img').attr('src', avatar.replace('large', 'badge'));
                
                $('#login').html('<img src="'+baseUrl+'img/btn-disconnect-s.png" alt="logout of soundclound" />').attr('id', 'logout');
            });

            //Place all users tracks
            Soundcloud.Get_users_faves(0);
            Soundcloud.Get_users_uploads(0);

        }else{
            //before soundcloud redirect 
        }

    },

    Get_users_faves: function(offset){

        var favorites = 'https://api.soundcloud.com/me/favorites.json?client_id=' + clientId + '&oauth_token=' + scToken + '&limit=50&offset='+offset+'&callback=?';

        $.getJSON(favorites, function (data) {
            
            //loop and add steamable tracks to board.
            for (i in data) {
                if (data[i].stream_url != 'undefined') {
                    Soundcloud.Press_and_place(data[i]);
                }
            }

            //if it didnt return empty, try to get more.
            var newOffset = offset+50;
            if(data.length)
                Soundcloud.Get_users_faves(newOffset);

        });
          
    },

    Get_users_uploads: function(offset){

        var usersTracks = 'https://api.soundcloud.com/me/tracks.json?client_id=' + clientId + '&oauth_token=' + scToken + '&limit=50&offset='+offset+'&callback=?';

        $.getJSON(usersTracks, function (data) {
            
            //loop and add steamable tracks to board.
            for (i in data) {
                if (data[i].stream_url != 'undefined') {
                    Soundcloud.Press_and_place(data[i]);
                }
            }

            //if it didnt return empty, try to get more.
            var newOffset = offset+50;
            if(data.length)
                Soundcloud.Get_users_uploads(newOffset);

        });
          
    },

    Press_and_place: function(data) {
        
        var record,
        //format info
        tagTtl = (!!data.title) ? data.title.toLowerCase() : '',
        tagArtist = (!!data.user.username) ? data.user.username.toLowerCase() : '',
        tagGenre = (!!data.genre) ? data.genre.toLowerCase() : '',
        tagLabel = (!!data.label_name) ? data.title.toLowerCase() : '';

        //select cover and how the records will be place on the desk
        var sleeve = sleeveArray[i % sleeveArray.length];
        var patternFunc = (window.location.hash.indexOf('q=')>0) ? 'flapped4' : 'flapped';
        
        //build cover
        var customCursor = (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Chrome/i))? 'custom_cursor' : '';

        if (!!data.artwork_url) {
            img = data.artwork_url;
            //get larger if retina
            if(retina)
                img = img.replace('large','t300x300');

            var record = '<div style="' + executeFunctionByName(patternFunc, window, vinylCount) + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk '+customCursor+'"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt"><img src="' + img + '" width="144" height="144" alt="" /><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" /></div></div>';
        } else {
            var record = '<div style="' + executeFunctionByName(patternFunc, window, vinylCount) + '" id="' + data.id + '" data-perma="' + data.permalink_url + '" data-stream="' + data.stream_url + '" data-title="' + tagTtl + '" data-artist="' + tagArtist + '" data-genre="' + tagGenre + '" data-label="' + tagLabel + '" class="recordSleeveBk '+customCursor+'"><img class="record" id="record' + data.id + '" src="' + baseUrl + 'img/vinyl.png" alt="" /><div class="recordSleeveFrt whiteLabel"><span style="-webkit-transform:rotate(' + randomFromTo(-3, 3) + 'deg);font-size:' + randomFromTo(19, 23) + 'px;" class="artist">' + data.user.username + '</span><span class="album"  style="-webkit-transform:rotate(' + randomFromTo(-4, 4) + 'deg);font-size:' + randomFromTo(19, 22) + 'px;">' + data.title + '</span><img class="tex" src="' + baseUrl + 'img/' + sleeve + '.png" alt="" /></div></div>';
        }

        //add record to desk
        commonEle.body.append(record);
        
        //bind dragg events
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

};

var Homepage = {

    Get_latest_plays: function(){

        var base = (window.location.href.indexOf('http://www.')==0)? 'http://www.waxcloud.com/' : 'http://waxcloud.com/';

        var d = new Date();
        var n = d.getTime();

        $.get(
            base+'get-data.php?'+n,
            function(data){
                
                //build list
                var list = $('<ol></ol>');

                list.addClass('latest-plays');

                //add rows
                var i = 0;
                while(i < 5){
                    var row = data[i];

                    var li = '<li id="'+row.id+'">'+
                        '<div class="li-record">'+
                            '<img class="li-disc" src="" alt="" >'+
                            '<img class="li-sleave" src="'+row.img.replace('t300x300','t67x67')+'" alt="" >'+
                        '</div>'+
                        '<p>'+row.name+'</p>'+
                        '<div class="clear-both"></div>'+
                    '</li>';

                    list.append(li);

                    i++;
                }

                $('#latest').children('p').replaceWith(list);

                //add click events
                Homepage.Bind_latest_plays();
            },
            'json'
        );

    },

    Bind_latest_plays: function(){

        $('aside.fibo-960-s','#home').on('click', 'li', function(){

            //build link
            var id = $(this).attr('id'),
                slug = encodeURIComponent( $(this).children('p').text() ),
                link = 'http://www.waxcloud.com/single/#/' + slug + '/' + id;

                window.location = link;

            Tracking.Google('click', 'latest plays', $(this).children('p').text());

        });

    }

};


$(document).ready(function () {

    //save common elements
    commonEle.win = $(window);
    commonEle.body = $('body');

    //set body height //do we need this
    //commonEle.body.height(commonEle.win.height());

    //set page mid points
    centerPoint.cpT = (commonEle.win.height() / 2),
    centerPoint.cpL = (commonEle.win.width() / 2) - 290;

    //home login btn
    $('#init-connect').click(function(e){
        e.preventDefault();

        Soundcloud.Login('board.html');
    });

    $("#login").click(function(e){
        e.preventDefault();
        
        Soundcloud.Login('board.html');
    });

    $("#logout").click(function () {
        window.location = 'index.html';
        return false;
    });

    //check if we have been redirected from SC. if so, init user data
    if (window.location.hash.indexOf('access_token') > 0)
        Soundcloud.Init_new_user();

    if( $('#home').length )
        Homepage.Get_latest_plays();


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


    commonEle.body.on(
        {
            mousemove: function(e) {
                if ($(this).hasClass('ui-draggable-dragging') == false) {
                    var title = $(this).attr('data-title'),
                    artist = $(this).attr('data-artist');
                    $('h3.bubble').remove();
                    $('body').append('<h3 class="bubble">' + title + '-' + artist + '</h3>');
                    $('h3.bubble').css({ 'top': e.pageY - 40, 'left': e.pageX });
                }
            },
            mouseover: function() {
                if ($(this).attr('data-animating') != 'true') {

                    TweenMax.to($(this), 0.2,{rotation: '-='+randomFromTo(0, 4)});
                    $(this).children('img.record').stop().animate({ 'left': '20px' }, 200);
                }
            },
            mouseout: function() {
                if ($(this).attr('data-animating') != 'true') {
                    $('h3.bubble').fadeOut(100);

                    TweenMax.to($(this), 0.2,{rotation: '+='+randomFromTo(0, 4)});
                    $(this).children('img.record').stop().animate({ 'left': '0px' }, 200);
                }
            },
            mousedown: function() {
                var z = $(this);
                zindexShuffle(z);
            }

        },
        'div.recordSleeveBk'
    );


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

        Tracking.Google('share', loc, name);
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

    $('#search-results').on('click','li.s-r-row', function () {
        var data = $(this).data('track-data');
        Soundcloud.Press_and_place(data);
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
        var q = encodeURIComponent($(this).val());
        if (e.keyCode == 13) {
            window.location = baseUrl + 'board.html#/q=' + q;
            searchSoundcloud(q);
        }
    });
});