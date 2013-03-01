(function (WL) {

  if (window.top !== window.top) {

    return;
  }

  // common config
  var config = {

    // 'host': 'https://next.wunderlist.com'
    // 'host': 'https://www.wunderlist.com'
    'host': 'http://localhost:5000'
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

    console.log(data);

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
    var url = openGraph.url || twitterCard.url || $('link[rel="canonical"]').attr('href') || window.location.href;

    console.log(data.note, scrapeData.note, url);

    // start building note
    var note = data.note || scrapeData.note || url;
    var selection = window.getSelection().toString();

    // if not passed in note data use a default constructor
    if (!data.note && !scrapeData.note) {

      // append url after description in note
      // use selection over description if present
      note = (selection ? selection : description) + " \n" + note;
    }
    else {

      note = (selection ? selection : note) + " \n" + url;
    }

    // prepare specialList data if present
    if (scrapeData.specialList) {

      note = 'specialList:' + scrapeData.specialList + '\u2603' + note;
    }

    // encode
    title = encodeURIComponent(title);
    note = encodeURIComponent(note);

    console.log(title);
    console.log(note);

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