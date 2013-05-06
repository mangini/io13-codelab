/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {

  chrome.app.window.create('index.html', {
    frame: 'none',
    bounds: { 
      top: 0, 
      left: 0,
      width: screen.availWidth,
      height: screen.availHeight}
  }, function(appWin) {
    appWin.fullscreen();
  });
});
        