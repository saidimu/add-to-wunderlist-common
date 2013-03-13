(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  // note/url separator
  var nL = " ... \n";

  // get the datas we really want
  var Scrapers = {

		'gmail': function  () {

			var data = {};

      data.scraper = 'gmail';
      data.title = window.title;
      data.url = window.location.href;

      var note = '';

      $('.ii').each(function (index, element) {

        var text = $(element).text();

        if (!text) {
          return;
        }

        if (note) {
          note = note + '\n\n';
        }

        note = note + text;
      });

      data.note = note;

      return data;
    },

    'outlook': function  () {

      var data = {};

      data.scraper = 'outlook';
      data.title = $('.ReadMsgSubject').text();
      data.url = 'none';
      data.note = $('.ReadMsgBody').text();

      return data;
    },

    'yahooMail': function  () {

      var data = {};

      var $titleClone = $('.info:visible > h3').clone();
      $titleClone.find('style').remove();

      var $msgClone = $('.msg-body.inner:visible').clone();
      $msgClone.find('style, script, meta').remove();

      data.scraper = 'yahooMail';
      data.title = $.trim($titleClone.text());
      data.url = 'none';
      data.note = $msgClone.text();

      return data;
    },

    'amazon': function  () {

      var data = {};

      data.scraper = 'amazon';

      data.title = $('meta[name="title"]').attr('content');
      var price = $('.priceLarge').text();

      if (price) {
        data.title = data.title + ' (' + price + ')';
      }

      data.url = $('link[rel="canonical"]').attr('href');
      data.note = $('meta[name="description"]').attr('content');
      data.specialList = 'wishlist';

      return data;
    },

    'imdb': function  () {

      var data = {};

      var stars = $.trim($('.star-box-giga-star').text());
      stars = stars.length ? ' [' + stars + ']' : '';

      data.scraper = 'imdb';
      data.title = $('h1 .itemprop').text();
      data.title = (data.title ? data.title + stars : undefined);
      data.url = $('link[rel="canonical"]').attr('href');

      data.note = $('p[itemprop="description"]').text();

      data.specialList = 'movies';

      return data;
    },

    'youtube': function  () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'youtube';
      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = openGraph.description;

      data.specialList = 'movies';

      return data;
    },

    'wikipedia': function  () {

      var data = {};

      data.scraper = 'wikipedia';

      var $noteSource = $('#mw-content-text').clone();
      $noteSource.find('.infobox').remove();

      data.title = document.title;
      data.url = window.location.href;
      data.note = $noteSource.text();
      data.specialList = 'readLater';

      return data;
    },

    'ebay': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'ebay';
      data.title = openGraph.title;
      data.url = openGraph.url;
      data.note = openGraph.description;
      data.specialList = 'wishlist';

      return data;
    },

    'asos': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      data.scraper = 'asos';

      data.title = openGraph.title;

      var price = $.trim($('.product_price_details').text());
      if (price) {
        data.title = data.title + ' (' + price + ')';
      }

      data.url = openGraph.url;

      var mainDescription = $('.product-description').html().replace(/<br>/g, '\n').replace(/<(?:.|\n)*?>/gm, '');
      var careDescription = $('#infoAndCare').html().replace(/<br>/g, '\n').replace(/<(?:.|\n)*?>/gm, '');

      data.note = $.trim(mainDescription + '\n\n' + careDescription);
      data.specialList = 'wishlist';

      return data;
    },

    'etsy': function () {

      var data = {};
      var openGraph = WL.fetchOpenGraph();

      var price = $.trim($('.item-amount').first().text());

      data.scraper = 'etsy';

      data.title = ($('.title-module:visible').text() || openGraph.title);

      if (price) {
        data.title = data.title + ' (' + price + ')';
      }

      data.url = (openGraph.url || window.location.href);
      data.note = ($('.description-item:visible .description').text() || openGraph.description);
      data.specialList = 'wishlist';

      return data;
    },

    'hackerNews': function () {

      var data = {};

      data.scraper = 'hackerNews';
      data.title = window.title;
      data.url = window.location.href;

      var $bodyRow = $('.subtext').closest('tbody').find('tr').eq(3);
      var bodyText = $bodyRow.find('td').eq(1).text();

      if (bodyText) {
        data.note = bodyText;
      }

      data.specialList = 'readLater';

      return data;
    },

    'hackerNewsIndex': function (targetElement) {

      var data = {};

      var $element = $(targetElement);
      var $row = $element.closest('tr');
      var $titleRow = $row.prev('tr');
      var $title = $titleRow.find('.title').eq(1);

      data.title = $title.text();
      data.url = window.location.protocol + '//' + window.location.host + '/' + $element.find('a').last().attr('href');

      data.specialList = 'readLater';

      return data;
    },

    'twitterIndex': function (targetElement) {

      var data = {};

      var $element = $(targetElement);
      var $tweet = $element.closest('.content');

      data.title = $tweet.find('.js-tweet-text').text();
      data.url = window.location.protocol + '//' + window.location.host + $tweet.find('a.details').attr('href');

      return data;
    }
	};

  // scrape something based on the current url
  function scrape (data) {

    var hash = window.location.hash;
    var host = window.location.hostname;
    var path = window.location.pathname;
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
    else if (/news\.ycombinator\.com/.test(host) && path === '/item') {

      return Scrapers.hackerNews();
    }
    else if (/news\.ycombinator\.com/.test(host) && data.scraperTarget) {

      return Scrapers.hackerNewsIndex(data.scraperTarget);
    }
    else if (/twitter\.com/.test(host)) {

        return Scrapers.twitterIndex(data.scraperTarget);
    }

    // return something as nothing
    return {};
  }

  // exports
  WL.scrape = scrape;

})(window.WL);