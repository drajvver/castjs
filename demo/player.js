
function debug(msg) {
  if (typeof msg === 'string') {
    $('#debug').append(msg + "\n")
  } else {
    $('#debug').append(JSON.stringify(msg, null, 4) + "\n")
  }
}

var cc = new Castjs();

cc.on('available', () => {
  $('#cast').removeClass('disabled')
})

cc.on('connect', () => {
  $('#cast').removeClass('disabled')
  $('#cast').addClass('connected')
  if (cc.paused) {
    $('#play').removeClass('fa-pause').addClass('fa-play')
  } else {
    $('#play').removeClass('fa-play').addClass('fa-pause')
  }
})

cc.on('disconnect', () => {
  $('#cast').removeClass('connected')
})

cc.on('statechange', () => {
  $('#state').text(cc.device + ': ' + cc.state)
})

cc.on('pause', () => {
  if (cc.paused) {
    $('#play').removeClass('fa-pause').addClass('fa-play')
  } else {
    $('#play').removeClass('fa-play').addClass('fa-pause')
  }
})

cc.on('volumechange', () => {
  if (cc.volumeLevel == 0) {
    $('#mute').removeClass('fa-volume-up').addClass('fa-volume-mute')
  } else {
    $('#mute').removeClass('fa-volume-mute').addClass('fa-volume-up')
  }
})

cc.on('timeupdate', () => {
  $('#time').text(cc.timePretty);
  $('#duration').text(cc.durationPretty);
  $('#range').attr('value', cc.progress);
  $('#range').rangeslider('update', true);
})

cc.on('error', (err) => {
  debug('[DEBUG] error', err)
})

$('#cast').on('click', () => {
  if (cc.available) {
    cc.cast('https://castjs.io/sintel.mp4', {
      poster     : 'https://castjs.io/demo/poster.jpg',
      title      : 'Sintel',
      description: 'Third Open Movie by Blender Foundation',
      subtitles: [{
          active: true,
          label : 'English',
          src   : 'https://castjs.io/demo/english.vtt'
      }, {
          label : 'Spanish',
          src   : 'https://castjs.io/demo/spanish.vtt'
      }],
    })
  }
})

$('.jq-dropdown-menu').on('click', 'a', function(e) {
  e.preventDefault();
  var index = $(this).attr('href')
  cc.subtitles(index)
  $('.jq-dropdown-menu a').removeClass('active')
  $(this).addClass('active')
})

$('#mute').on('click', () => {
    if ($('#mute').hasClass('fa-volume-up')) {
      cc.mute()
      $('#mute').removeClass('fa-volume-up').addClass('fa-volume-mute')
    } else {
      cc.unmute()
      $('#mute').removeClass('fa-volume-mute').addClass('fa-volume-up')
    }
})

$('#play').on('click', () => {
    if ($('#play').hasClass('fa-play')) {
      cc.play();
      $('#play').removeClass('fa-play').addClass('fa-pause')
    } else {
      cc.pause();
      $('#play').removeClass('fa-pause').addClass('fa-play')
    }
})

$('#stop').on('click', () => {
    cc.disconnect();
    $('#cast').removeClass('session');
})

$('#back').on('click', () => {
    var goback = cc.progress - 1;
    if (goback <= 0) {
      goback = 0;
    }
    cc.seek(goback)
})

var slider = $('input[type="range"]').rangeslider({
  polyfill: false,
  onSlideEnd: function(pos, val) {
    if (cc.connected) {
      cc.seek(val, true);
    }
  }
});