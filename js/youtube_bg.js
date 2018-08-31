 var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('bg-video', {
      height: '390',
      width: '640',
      videoId: 'c1fFiOM38-0',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      },
      playerVars: {rel: 0},
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    window.a = event;
    event.target.playVideo();
    event.target.mute();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    if (event.data == YT.PlayerState.ENDED) {
      event.target.playVideo();
    }
  }