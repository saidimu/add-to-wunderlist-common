(function (WL) {

  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  var addString = 'Add to Wunderlist';
  var buttonId = 'addToWunderlistButton';

  function generateGenericButton (className, element) {

    className = className || 'generic-button';
    element = element || '<div/>';

    var $button = $(element).addClass(className)
      .attr('id', buttonId)
      .text(addString);

    var $icon = $('<span/>').addClass('wunderlist-icon');

    $button.prepend($icon);

    return $button;
  }

  function gmailQuickAdd () {

    // these classes may change, not sure how long they last on gmail
    var $mainContainer = $('#\\:ro');
    var $validChild = $mainContainer.children('div:visible');
    var $headerButtons = $validChild.find('.G-Ni');
    var $targetContainer = $($headerButtons.get(3));

    var $clone = $($targetContainer.contents().get(0)).clone();
    $clone.empty().addClass('gmail')
      .attr('id', buttonId)
      .attr('data-tooltip', addString)
      .attr('aria-label', addString)
      .attr('aria-haspopup', 'false')
      .text(addString);

    var $span = $('<span/>').addClass('wunderlist-icon');
    $clone.prepend($span);

    $targetContainer.append($clone);

    $('#' + buttonId).on('click', function () {

      var data = {};

      data.title = window.title;
      WL.showOverlay(data);
    });
  }

  function outlookQuickAdd () {

    var $cloneTarget = $('#Archive').parent();
    var $clone = $cloneTarget.clone();

    $clone.find('a').addClass('outlook')
      .attr('id', buttonId)
      .attr('title', addString)
      .attr('aid', 'wunderlist')
      .text(addString);

    var $span = $('<span/>').addClass('wunderlist-icon');
    $clone.find('a').prepend($span);

    $cloneTarget.before($clone);

    $('#' + buttonId).on('click', function () {

      var data = {};

      data.title = $('.ReadMsgSubject').text();
      data.note = $('.ReadMsgBody').text();
      WL.showOverlay(data);
    });
  }

  function yahooQuickAdd () {

    var $cloneTarget = $('.btn-spam:visible');
    var $clone = $cloneTarget.clone().attr('id', 'wunderlist-container')
      .addClass('yahoo')
      .removeClass('btn-spam');

    $clone.prepend($('<span/>').addClass('wunderlist-icon'));

    $clone.find('a').attr('id', buttonId)
      .addClass('yahoo')
      .attr('title', addString)
      .attr('data-action', '')
      .text(addString);

    $('#btn-msg-actions:visible').after($clone);

    $('#' + buttonId).on('click', function () {

      var data = {};

      var $titleClone = $('.info:visible > h3').clone();
      $titleClone.find('style').remove();

      var $msgClone = $('.msg-body.inner:visible').clone();
      $msgClone.find('style, script, meta').remove();

      data.title = $.trim($titleClone.text());
      data.note = $.trim($msgClone.text());
      WL.showOverlay(data);
    });
  }

  function amazonQuickAdd () {

    var $targetContainer = $('.buyingDetailsGrid');
    var $button = generateGenericButton('amazon');
    $targetContainer.prepend($button);

    $('#' + buttonId).on('click', function (ev) {

      ev.stopPropagation();
      ev.preventDefault();

      var data = {};

      data.title = $('meta[name="title"]').attr('content');
      data.note = $('meta[name="description"]').attr('content') + " \n" + $('link[rel="canonical"]').attr('href');
      data.specialList = 'wishlist';
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function imdbQuickAdd () {

    var $targetContainer = $('#overview-bottom');
    var $button = generateGenericButton('imdb btn2 large primary');
    $targetContainer.append($button);

    $('#' + buttonId).on('click', function (ev) {

      ev.stopPropagation();
      ev.preventDefault();

      var data = {};

      var stars = $.trim($('.star-box-giga-star').text());
      stars = stars.length ? ' [' + stars + ']' : '';

      data.title = $('h1 .itemprop').text() + stars;
      data.note = $.trim($('p[itemprop="description"]').text()) + " \n" + $('link[rel="canonical"]').attr('href');
      data.specialList = 'movies';

      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function youtubeQuickAdd () {

    var $target = $('.yt-uix-button-subscription-container:visible');
    var $button = generateGenericButton('youtube yt-uix-button-subscribe-branded');
    $target.after($button);

    $('#' + buttonId).on('click', function (ev) {

      ev.stopPropagation();
      ev.preventDefault();

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = openGraph.description + " \n" + openGraph.url;
      data.specialList = 'movies';
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function wikipediaQuickAdd () {

    var $target = $('#siteSub');
    var $button = generateGenericButton('wikipedia');
    $target.after($button);

    $('#' + buttonId).on('click', function (ev) {

      var data = {};

      data.title = document.title;
      data.note = $.trim($('#mw-content-text').text()).substring(0, 500) + " ... \n" + window.location.href;
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });

  }

  function ebayQuickAdd () {

    var $targetContainer = $('#ebayShare_1');
    var $button = generateGenericButton('ebay');
    $targetContainer.append($button);

    $('#' + buttonId).on('click', function (ev) {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = openGraph.description + " ... \n" + openGraph.url;
      data.specialList = 'wishlist';
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function asosQuickAdd () {

    var $targetContainer = $($('#variants, .product-buttons').get(0));
    var $button = generateGenericButton('asos button small grey', '<a/>');
    $targetContainer.append($button);

    $('#' + buttonId).on('click', function (ev) {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = $.trim(($('#infoAndCare').text() || openGraph.description)).substring(0, 500) + " ... \n" + openGraph.url;
      data.specialList = 'wishlist';
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function etsyQuickAdd () {

    var $targetContainer = $('#secondary-actions');
    var $button = generateGenericButton('etsy button-fave');
    $targetContainer.append($button);

    $('#' + buttonId).on('click', function (ev) {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = ($('.title-module:visible').text() || openGraph.title);
      data.note = ($.trim($('.description-item:visible .description').text()).substring(0, 500) || openGraph.description) + " ... \n" + (openGraph.url || window.location.href);
      data.specialList = 'wishlist';
      WL.showOverlay(data);
      return false;
    }).on('submit', function () {

      return false;
    });
  }

  function injectQuickAddLink () {

    var host = window.location.hostname;
    var hash = window.location.hash;
    var search = window.location.search;

    var $button = $('#' + buttonId);
    if ($button.length) {

      $button.remove();
    }

    if (/mail\.google\.com/.test(host) && hash.split('/')[1]) {

      gmailQuickAdd();
    }
    else if (/mail\.live\.com/.test(host) && (/&mid=/.test(hash) || /&mid=/.test(search))) {

      outlookQuickAdd();
    }
    else if (/mail\.yahoo\.com/.test(host)) {

      yahooQuickAdd();
    }
    else if (/amazon\./.test(host)) {

      amazonQuickAdd();
    }
    else if (/imdb\./.test(host)) {

      imdbQuickAdd();
    }
    else if (/youtube\.com/.test(host)) {

      youtubeQuickAdd();
    }
    else if (/wikipedia\.org/.test(host)) {

      wikipediaQuickAdd();
    }
    else if (/ebay\./.test(host)) {

      ebayQuickAdd();
    }
    else if (/\.asos\./.test(host)) {

      asosQuickAdd();
    }
    else if (/\.etsy\./.test(host)) {

      etsyQuickAdd();
    }
  }

  var lastLocation = window.location.hostname + window.location.pathname + window.location.search + window.location.hash;
  function checkLocation () {

    var host = window.location.hostname;
    var path = window.location.pathname;
    var hash = window.location.hash;
    var search = window.location.search;

    if (lastLocation !== host + path + search + hash) {

      lastLocation = host + path + search + hash;
      injectQuickAddLink();
    }
  }

  $(function () {

    var timeout = 100;
    var host = window.location.hostname;

    if (/mail\.google\.com/.test(host)) {

      timeout = 5000;
    }

    // takes a while for the dom to be really ready on gmail
    window.setTimeout(injectQuickAddLink, timeout);
    // simulate onhashchange for websites that are messing with pushstate and history
    window.setTimeout(function () {

      window.setInterval(checkLocation, 100);
    }, timeout);
  });

})(window.WL);