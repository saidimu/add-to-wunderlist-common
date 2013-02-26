(function (WL) {

  // common config
  var config = {

    // 'host': 'https://www.wunderlist.com'
    'host': 'http://localhost:5000'
  };

  // get it started in here
  if (!WL) {

    window.WL = {};
    WL = window.WL;
  }

  function fetchOpenGraph () {

    var data = {};

    data.url = $('meta[name="og:url"]').attr('content');
    data.title = $('meta[name="og:title"]').attr('content');
    data.description = $('meta[name="og:description"]').attr('content');

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

    // Builds url for passing data to wunderlist.com extension frame.
    // Takes passes in data, or defaults to the tabs title and url or text selection in the frame

    // fetch open graph and twitter card meta data
    var openGraph = fetchOpenGraph();
    var twitterCard = fetchTwitterCard();

    // build main meta datas - left priority
    var title = data.title || openGraph.title || twitterCard.title || document.title || '';
    var description = openGraph.description || twitterCard.description || $('meta[name="description"]').attr('content') || '';
    var url = openGraph.url || twitterCard.url || $('link[rel="canonical"]').attr('href') || window.location.href;

    // start building note
    var note = data.note || url;
    var selection = window.getSelection().toString();
    // if not passed in note data use a default constructor
    if (!data.note) {

      // append desciption after url in note
      // use selection over description if present
      note = note + (selection ? " \n\n" + selection : " \n\n" + description);
    }

    // prepare specialList data if present
    if (data.specialList) {

      note = 'specialList:' + data.specialList + '\u2603' + note;
    }

    // encode
    title = encodeURIComponent(title);
    note = encodeURIComponent(note);

    return data.config.host + '/#/extension/add/' + title + '/' + note;
  }

  // exports
  WL.buildUrl = buildUrl;
  WL.config = config;

})(window.WL);