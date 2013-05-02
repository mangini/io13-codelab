/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */

function launch() {
  chrome.app.window.create('main.html', {
    id: 'main',
    bounds: { width: 300, height: 300 }
  });
}

function showNotification(storedData) {

    if (storedData.data.length>0) {

      // When the user clicks on the notification, we want to open the To Do list
      chrome.notifications.onClicked.addListener(function( notificationId ) {
        launch();
        chrome.notifications.clear(notificationId, function() {});
      });

      // Now we can create the notification
      chrome.notifications.create('reminder', {
          type: 'basic',
          iconUrl: 'icon_128.png',
          title: 'Don\'t forget!',
          message: 'You have '+storedData.data.length+' things to do. Wake up, dude!'
       }, function(notificationId) {})
    }
}

chrome.app.runtime.onLaunched.addListener(launch);

chrome.alarms.onAlarm.addListener(function( alarm ) {
  chrome.storage.local.get({'data': []}, showNotification);
});