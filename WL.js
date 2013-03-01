(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  // common config
  var config = {

    'host': 'https://next.wunderlist.com'
    // 'host': 'https://www.wunderlist.com'
    // 'host': 'http://localhost:5000'
  };

  // modules can be imported individually for different extensions, but all will export onto window.WL
  if (!WL) {

    window.WL = {};
    WL = window.WL;
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
    var scrapeData = WL.scrape();

    // fetch open graph and twitter card meta data
    var openGraph = fetchOpenGraph();
    var twitterCard = fetchTwitterCard();

    // build main meta datas - left priority
    var title = scrapeData.title || data.title || openGraph.title || twitterCard.title || document.title || '';
    var description = openGraph.description || twitterCard.description || $('meta[name="description"]').attr('content') || '';
    var url = scrapeData.url || data.url || openGraph.url || twitterCard.url || $('link[rel="canonical"]').attr('href') || window.location.href;

    // start building note from passed in data
    var note = data.note || scrapeData.note;
    // grab user selection
    var selection = window.getSelection().toString();

    // if not passed in note data use a default note constructor
    if (!data.note && !scrapeData.note) {

      // use selection over description if present
      // append url after description in note
      note = (selection ? selection : description) + " \n" + url;
    }
    else {

      // use selection over note if present and allow scraper exclude url
      note = (selection ? selection : note) + (selection && url !== 'none' ? " \n" + url : '');
    }

    // prepare specialList data if present
    if (scrapeData.specialList) {

      note = 'specialList:' + scrapeData.specialList + '\u2603' + note;
    }

    // console.log(title, note);

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