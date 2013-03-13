(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  // common config
  var config = {
    'host': 'https://www.wunderlist.com'
  };

  // modules can be imported individually for different extensions, but all will export onto window.WL
  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  // trims whitespace, reduces inner newlines and spaces
  // and keeps string below 500 chars
  function trim (string, length) {

    // default length to trim by is 500 chars
    length = length || 500;

    // get rid of stacked newlines
    string = (string || '').replace(/\n{3,}/g, '\n\n');

    // get rid of redonk spaces
    string = string.replace(/\s{3,}/g, ' ');
    string = $.trim(string);

    // only trim string length if it's
    if (string.length > length) {
      string = string.substring(0, length) + '...';
    }

    return string;
  }

  function fetchOpenGraph () {

    var data = {};

    data.url = $('meta[name="og:url"]').attr('content') || $('meta[property="og:url"]').attr('content');
    data.title = $('meta[name="og:title"]').attr('content') || $('meta[property="og:title"]').attr('content');
    data.description = $('meta[name="og:description"]').attr('content') || $('meta[property="og:description"]').attr('content');

    return data;
  }

  function fetchTwitterCard () {

    var data = {};

    data.url = $('meta[name="twitter:url"]').attr('content');
    data.title = $('meta[name="twitter:title"]').attr('content');
    data.description = $('meta[name="twitter:description"]').attr('content');

    return data;
  }

  function buildUrl (data) {

    data = data || {};

    // Builds url for passing data to wunderlist.com extension frame.
    // Takes passes in data, or defaults to the tabs title and url or text selection in the frame

    // Scrape predefined data
    var scrapeData = WL.scrape(data);

    // fetch open graph and twitter card meta data
    var openGraph = fetchOpenGraph();
    var twitterCard = fetchTwitterCard();

    // build main meta datas - left priority
    var title = scrapeData.title || data.title || openGraph.title || twitterCard.title || document.title || '';
    var description = trim(openGraph.description || twitterCard.description || $('meta[name="description"]').attr('content') || '');
    var url = scrapeData.url || data.url || openGraph.url || twitterCard.url || $('link[rel="canonical"]').attr('href') || window.location.href;

    // start building note from passed in data
    // and make sure it doesn't exceed the max length
    var note = trim(data.note || scrapeData.note, 1000);

    // grab user selection and trim to max 5000 characters
    var selection = trim(window.getSelection().toString() || '', 5000);

    // if not passed in note data use a default note constructor
    if (!data.note && !scrapeData.note) {

      // use selection over description if present
      // append url after description in note
      note = (selection ? selection : description) + " \n" + url;
    }
    else {

      // use selection over note if present and allow scraper exclude url
      note = (selection ? selection : note) + " \n" + url;
    }

    // prepare specialList data if present
    if (scrapeData.specialList) {

      note = 'specialList:' + scrapeData.specialList + '\u2603' + note;
    }

    // save scraper type/name for in-app analytics
    if (scrapeData.scraper) {

      note = 'scraper:' + scrapeData.scraper + '\u2603' + note;
    }

    // encode
    title = encodeURIComponent(title);
    note = encodeURIComponent(note);

    return config.host + '/#/extension/add/' + title + '/' + note;
  }

  function buildCss (options) {

    // Create styles for overlay
    var transitionSpeed = options && options.transitionSpeed || 500;
    var opacity = options && options.opacity || 0;

    return 'opacity:' + opacity + ';-webkit-transition:opacity ' + transitionSpeed + 'ms linear;';
  }

  // exports
  WL.fetchOpenGraph = fetchOpenGraph;
  WL.fetchTwitterCard = fetchTwitterCard;
  WL.buildUrl = buildUrl;
  WL.buildCss = buildCss;
  WL.config = config;

})(window.WL);