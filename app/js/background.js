chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app/index.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});