
    //Disable double tap on document
    var lastTouchEnd = 0;
    document.documentElement.addEventListener('touchend', function (event) {
      var now = (new Date()).getTime();
      if (now - lastTouchEnd <= 400) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };