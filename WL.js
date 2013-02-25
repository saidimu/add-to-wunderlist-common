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

  function buildUrl (data) {

    // Builds url for passing data to wunderlist.com extension frame.
    // Takes passes in data, or defaults to the tabs title and url or text selection in the frame

    var title = data.title || encodeURIComponent(document.title);
    var note = data.note || window.location.href;
    var selection = window.getSelection().toString();

    if (!data.note) {

      note = note + (selection ? " \n\n" + selection : " \n\n" + $('meta[name="description"]').attr('content'));
    }

    if (data.specialList) {

      note = 'specialList:' + data.specialList + '\u2603' + note;
    }

    note = encodeURIComponent(note);

    return data.config.host + '/#/extension/add/' + title + '/' + note;
  }

  // exports
  WL.buildUrl = buildUrl;
  WL.config = config;

})(window.WL);