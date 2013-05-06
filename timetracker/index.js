
window.addEventListener('DOMContentLoaded', function() {

  var timedata,
      start,
      currentStep;

  function getTimeData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'timedata.json');
    xhr.onload = processTimeData;
    xhr.send();
  }

  function processTimeData() {
    timedata = JSON.parse(this.response);
  }

  function checkCurrentStep() {
    var checkTime = Date.now(),
        accTime = start,
        remainingTime;

    timedata.forEach(function(step, i) {
      var stepEndTime = accTime + step.timeInMinutes * 60 * 1000;

      if ( checkTime >= accTime ) {
        currentStep = step;
        remainingTime = Math.round(( stepEndTime - checkTime ) / (60 * 1000));
      }

      accTime = stepEndTime ;
    });

    setCurrentStep(currentStep, remainingTime);
  }

  function setStart(s) {
    start = s;
    chrome.storage.local.set({'start': s});
  }

  function setCurrentStep(step, remainingTime) {
    document.querySelector('.current-step').innerText = step.title;
    document.querySelector('.current-step-remaining').innerText = remainingTime;
  }

  function startCounter() {
    document.body.classList.add('running');
    document.querySelector('button').innerText = 'Restart';
    if (start == null) {
      setStart(Date.now());
    }
    chrome.alarms.create('updateStep', { delayInMinutes:0, periodInMinutes: 0.5 } );
  }

  function stopCounter() {
    document.body.classList.remove('running');
    document.querySelector('button').innerText = 'Start';
    setStart(null);
    chrome.alarms.clear('updateStep');
  }

  document.querySelector('button').addEventListener('click', function() {
    if (document.body.classList.contains('running')) {
      stopCounter();
    } else {
      startCounter();
    }
  });

  function init() {
    chrome.alarms.clearAll();

    getTimeData();

    chrome.storage.local.get({'start': null}, function(data) {
      if (data.start != null) {
        start = data.start;
        startCounter();
      }
    });
  }

  chrome.alarms.onAlarm.addListener(function( alarm ) {
    checkCurrentStep();  
  });

  init();
  
});