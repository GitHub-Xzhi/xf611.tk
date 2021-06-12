var $window = $(window),
    gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function() {
    // setup garden
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
    setContentCss();
    setMissubearSite();

    // renderLoop
    setInterval(function() {
        garden.render();
    }, Garden.options.growSpeed);
});

/**
 * 设置content样式
 */
function setContentCss() {
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));
}

/**
 * 设置想念熊的位置
 */
function setMissubearSite() {
    setContentCss();
    var missubearWidth = $('#missubear').width();
    var missubearHeight = $('#missubear').height();
    var gardenWidth = $('#garden').width();
    var loveHeartTop = $('#loveHeart').offset().top;
    var loveHeartLeft = $('#loveHeart').offset().left;
    if (loveHeartTop < missubearHeight) {
        loveHeartTop = missubearHeight;
    }
    var missubearTop = loveHeartTop - missubearHeight+30;
    var missubearLeft = loveHeartLeft+gardenWidth/2-missubearWidth/2;
    $('#loveHeart').offset({ top: loveHeartTop, left: loveHeartLeft});
    $('#missubear').offset({ top: missubearTop, left: missubearLeft});
}

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function() {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            $("#missubear").css("visibility","visible");
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this),
                str = $ele.html(),
                progress = 0;
            $ele.html('');
            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

function timeElapse(date) {

    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> 天 <span class=\"digit\">" + hours + "</span> 时 <span class=\"digit\">" + minutes + "</span> 分 <span class=\"digit\">" + seconds + "</span> 秒";
    $("#elapseClock").html(result);
}

function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
    // $('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
    $('#code').offset({ top: $('#loveHeart').offset().top + 25});
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
    $('#signature').fadeIn(9000);
    $('#myName').fadeIn(9000);
    $('#id_box').fadeIn(9000);
}

var day, hour, minute, second;
var startYear = 2018;
var startDate = "/6/11 22:36:00";
/**
 * 倒计时功能
 */
function countDown() {
    //获取当前时间  
    var nowDate = new Date();
    var nowTimestamp = nowDate.getTime();
    var nowYear = nowDate.getFullYear();
	//周年纪念日时间戳
    var anniversaryTimestamp = (new Date(nowYear + startDate)).getTime();
    var diffTimestamp = anniversaryTimestamp - nowTimestamp;
    if (diffTimestamp <= 0) {
        // 到了这一年纪念日的时间
        $("#yearCount").text(nowYear - startYear + 2);
        var nextTimestamp = (new Date((nowYear + 1) + startDate)).getTime();
        countDownDate(nextTimestamp - nowTimestamp);
    } else {
        $("#yearCount").text(nowYear - startYear + 1);
        countDownDate(diffTimestamp);
    }

    //递归每秒调用countTime方法，显示动态时间效果  
    setTimeout(countDown, 1000);
}

/**
 * 日期倒计时
 */
function countDownDate(timestamp) {
    day = Math.floor(timestamp / 1000 / 60 / 60 / 24);
    hour = Math.floor(timestamp / 1000 / 60 / 60 % 24);
    minute = Math.floor(timestamp / 1000 / 60 % 60);
    second = Math.floor(timestamp / 1000 % 60);

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }

    //将倒计时赋值到div中  
    $("#_d").text(day);
    $("#_h").text(hour);
    $("#_m").text(minute);
    $("#_s").text(second);
}