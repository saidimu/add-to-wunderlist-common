(function (WL) {

  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  var overlayId = 'wunderlist_overlay';

  function showOverlay (postData) {

    var existing = document.getElementById(overlayId);

    if (!existing) {

      var frame = document.createElement('iframe');

      frame.allowtransparency = 'true';
      frame.scrolling = 'no';
      frame.id = overlayId;
      frame.name = overlayId;
      frame.style.cssText = WL.buildCss();
      frame.src = WL.buildUrl(postData);

      frame.onload = function () {

        $('body').css({

          'overflow': 'hidden'
        });

        frame.style.opacity = 1;

        setTimeout(function () {

          frame.style.cssText = WL.buildCss({

            'opacity': 1,
            'transitionSpeed': 50
          });
        }, 1000);
      };

      document.body.appendChild(frame);

      var close = function close (ev) {

        if (ev.data === 'close_wunderlist') {

          frame.style.opacity = 0;

          setTimeout(function () {

            frame.src = 'about:blank';
            frame.onload = function () {

              $('body').css({

                'overflow': ''
              });

              window.removeEventListener('message', close, false);
              frame.parentNode.removeChild(frame);
              frame = null;
            };
          }, 500);
        }
      };

      window.addEventListener('message', close, false);
    }
  }

  // exports
  WL.showOverlay = showOverlay;

})(window.WL);