window.addEventListener('DOMContentLoaded', function() {

  var list = document.getElementById('list');

  function getItemsFromList(list) {
    var result=[];
    var items = list.querySelectorAll('li span');
    for (var i=0; i<items.length; i++) {
      result.push(items[i].innerText);
    }
    return result;
  }

  function init() {
    chrome.storage.local.get({'data': []}, function(storedData) {
      var loadedList = storedData.data;
      result = loadedList;
      loadedList.forEach(function(item) {
        doAdd(null, item);
      });
    });

    checkAlarm(function(hasAlarm) {
      document.getElementById('toggleAlarm').innerText = hasAlarm ? 'Cancel alarm' : 'Activate alarm';
    });
  }

  function doAdd(event, value) {
    var item = document.createElement('li'),
        content = document.createElement('span'),
        remove = document.createElement('a'),
        value = value || 'new task';

    content.setAttribute('contenteditable', true);
    content.innerText = value;

    // add Remove link
    remove.innerText= 'remove';
    remove.href = '#';
    remove.addEventListener('click', function(e) {
      e.preventDefault();
      list.removeChild(item);
      doSave();
    });

    item.appendChild(content);
    item.appendChild(remove);

    list.appendChild(item);

    content.addEventListener('blur', function(e) {
      parseForURLs(e.target);
    });
    parseForURLs(content);

  }


  function doSave() {
    chrome.storage.local.set({'data': getItemsFromList(list)});
  }

  var alarmName = 'remindme';

  function checkAlarm(callback) {
    chrome.alarms.getAll(function(alarms) {

      var hasAlarm = alarms.some(function(a) {
        return a.name === alarmName;
      });

      callback(hasAlarm);
    })
  }

  function createAlarm() {
    chrome.alarms.create(alarmName, {delayInMinutes: 0.1, periodInMinutes: 0.1});
  }

  function cancelAlarm() {
    chrome.alarms.clear(alarmName);
  }


  function doToggleAlarm(e) {
    checkAlarm( function(hasAlarm) {
      if (hasAlarm) {
        cancelAlarm();
      } else {
        createAlarm();
      }
      hasAlarm = !hasAlarm;
      document.getElementById('toggleAlarm').innerText = hasAlarm ? 'Cancel alarm' : 'Activate alarm';
    });
  }

  function doShowUrl(e) {
    e.preventDefault();
    var url = e.target.getAttribute('data-src');
    chrome.app.window.create(
      'webview.html',
      {hidden: true},   // let's open the window hidden first, so we can set the webview source
      function(appWin) {
        appWin.contentWindow.addEventListener('DOMContentLoaded', function(e) {
          var webview = appWin.contentWindow.document.querySelector('webview');
          webview.src = url;
          appWin.show();
        });
      });
  }

  function parseForURLs(el) {
    var text = el.innerText,
        re = /https?:\/\/[^\s"]+/g,
        o,
        anchor,
        parent = el.parentNode;

    // remove old links:
    var oldLinks = parent.querySelectorAll('a[data-src]');
    for (var i = 0; i < oldLinks.length; i++) {
      parent.removeChild(oldLinks[i]);
    }

    // add links:
    while ( o = re.exec(text) ) {
      var url = o[0];
      anchor = document.createElement('a');
      anchor.setAttribute('href', '#');
      anchor.setAttribute('data-src', url);
      anchor.innerText=url;
      anchor.addEventListener('click', doShowUrl);
      parent.insertBefore(anchor, el.nextSibling);
    }

  }

  document.getElementById('add').addEventListener('click', doAdd);
  document.getElementById('toggleAlarm').addEventListener('click', doToggleAlarm);
  list.addEventListener('input', doSave);

  init();

});
