(function() {

  var dbName = 'todos-vanillajs';

  var savedFileEntry, fileDisplayPath;

  function getTodosAsText(callback) {
    chrome.storage.local.get(dbName, function(storedData) {
      var text = '';

      if ( storedData[dbName].todos ) {
        storedData[dbName].todos.forEach(function(todo) {
            text += '- ';
            if ( todo.completed ) {
              text += '[DONE] ';
            }
            text += todo.title;
            text += '\n';
          }, '');
      }

      callback(text);

    }.bind(this));
  }

  function exportToFileEntry(fileEntry) {
    savedFileEntry = fileEntry;

    var status = document.getElementById('status');

    // Use this to get a file path appropriate for displaying
    chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
      fileDisplayPath = path;
      status.innerText = 'Exporting to '+path;
    });

    getTodosAsText( function(contents) {

      fileEntry.createWriter(function(fileWriter) {

        var truncated = false;
        var blob = new Blob([contents]);

        fileWriter.onwriteend = function(e) {
          if (!truncated) {
            truncated = true;
            // You need to explicitly set the file size to truncate
            // any content that might have been there before
            this.truncate(blob.size);
            return;
          }
          status.innerText = 'Export to '+fileDisplayPath+' completed';
        };

        fileWriter.onerror = function(e) {
          status.innerText = 'Export failed: '+e.toString();
        };

        fileWriter.write(blob);

      });
    });
  }

  function doExportToDisk() {

    if (savedFileEntry) {

      exportToFileEntry(savedFileEntry);

    } else {

      chrome.fileSystem.chooseEntry( {
        type: 'saveFile',
        suggestedName: 'todos.txt',
        accepts: [ { description: 'Text files (*.txt)',
                     extensions: ['txt']} ],
        acceptsAllTypes: true
      }, exportToFileEntry);

    }
  }

  document.getElementById('exportToDisk').addEventListener('click', doExportToDisk);

})();