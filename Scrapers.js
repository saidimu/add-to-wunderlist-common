(function (WL) {

  //'use strict';

  if (window.top !== window.top) {

    return;
  }

  // modules can be imported individually for different extensions, but all will export onto window.WL
  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  // trims whitespace, reduces inner newlines and spaces, and keeps string below 500 chars
  function trim (string) {

    string = $.trim(string).substring(0, 500);

    // get rid of stacked newlines
    string = string.replace(/\n{3,}/g, '\n\n');

    // get rid of redonk spaces
    string = string.replace(/\s{3,}/g, ' ');

    return string;
  }

  // get the datas we really want
  var Scrapers = {

		'gmail': function  () {

			var data = {};

      data.title = window.title;
      data.note = window.location.href;

      return data;
    },

    'outlook': function  () {

      var data = {};

      data.title = $('.ReadMsgSubject').text();
      data.note = trim($('.ReadMsgBody').text());

      return data;
    },

    'yahooMail': function  () {

      var data = {};

      var $titleClone = $('.info:visible > h3').clone();
      $titleClone.find('style').remove();

      var $msgClone = $('.msg-body.inner:visible').clone();
      $msgClone.find('style, script, meta').remove();

      data.title = $.trim($titleClone.text());
      data.note = trim($msgClone.text());

      return data;
    },

    'amazon': function  () {

      var data = {};

      data.title = $('meta[name="title"]').attr('content');

      data.note = trim($('meta[name="description"]').attr('content'));
      data.note = (data.note ? data.note + " \n" + $('link[rel="canonical"]').attr('href') : undefined);
      
      data.specialList = 'wishlist';

      return data;
    },

    'imdb': function  () {

      var data = {};

      var stars = $.trim($('.star-box-giga-star').text());
      stars = stars.length ? ' [' + stars + ']' : '';

      data.title = $('h1 .itemprop').text();
      data.title = (data.title ? data.title + stars : undefined);

      data.note = trim($('p[itemprop="description"]').text());
      data.note = (data.note ? data.note + " \n" + $('link[rel="canonical"]').attr('href') : undefined);

      data.specialList = 'movies';

      return data;
    },

    'youtube': function  () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = trim(openGraph.description);
      data.note = (data.note ? data.note + " \n" + openGraph.url : undefined);

      data.specialList = 'movies';

      return data;
    },

    'wikipedia': function  () {

      var data = {};

      var $noteSource = $('#mw-content-text').clone();
      $noteSource.find('.infobox').remove();

      data.title = document.title;
      data.note = trim($noteSource.text());
      data.note = (data.note ? data.note + " ... \n" + window.location.href : undefined);

      data.specialList = 'readLater';

      return data;
    },

    'ebay': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = trim(openGraph.description);
      data.note = data.note ? data.note + " ... \n" + openGraph.url : undefined;

      data.specialList = 'wishlist';

      return data;
    },

    'asos': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = openGraph.title;
      data.note = trim(($('#infoAndCare').text() || openGraph.description));
      data.note = (data.note ? data.note + " ... \n" + openGraph.url : undefined);

      data.specialList = 'wishlist';

      return data;
    },

    'etsy': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.title = ($('.title-module:visible').text() || openGraph.title);
      data.note = trim(($('.description-item:visible .description').text() || openGraph.description));
      data.note = (data.note ? data.note + " ... \n" + (openGraph.url || window.location.href) : undefined);
      data.specialList = 'wishlist';

      return data;
    }
	};

  // scrape something based on the current url
  function scrape () {

    var host = window.location.hostname;
    var hash = window.location.hash;
    var search = window.location.search;

    if (/mail\.google\.com/.test(host) && hash.split('/')[1]) {

      return Scrapers.gmail();
    }
    else if (/mail\.live\.com/.test(host) && (/&mid=/.test(hash) || /&mid=/.test(search))) {

      return Scrapers.outlook();
    }
    else if (/mail\.yahoo\.com/.test(host)) {

      return Scrapers.yahooMail();
    }
    else if (/amazon\./.test(host)) {

      return Scrapers.amazon();
    }
    else if (/imdb\./.test(host)) {

      return Scrapers.imdb();
    }
    else if (/youtube\.com/.test(host)) {

      return Scrapers.youtube();
    }
    else if (/wikipedia\.org/.test(host)) {

      return Scrapers.wikipedia();
    }
    else if (/ebay\./.test(host)) {

      return Scrapers.ebay();
    }
    else if (/\.asos\./.test(host)) {

      return Scrapers.asos();
    }
    else if (/\.etsy\./.test(host)) {

      return Scrapers.etsy();
    }

    // return something as nothing
    return {};
  }

  // exports
  WL.scrape = scrape;

})(window.WL);