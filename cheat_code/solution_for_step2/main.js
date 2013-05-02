
window.addEventListener('DOMContentLoaded', function() {

  var list = document.getElementById('list'),
      storage=[];

  function getItemsFromList(list) {
    var result=[];
    var items = list.querySelectorAll('li span');
    for (var i=0; i<items.length; i++) {
      result.push(items[i].innerText);
    }
    return result;
  }

  function doAdd() {
    var item = document.createElement('li'),
        content = document.createElement('span'),
        remove = document.createElement('a');

    content.setAttribute('contenteditable', true);
    content.innerText = 'new task';

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
  }

  function doSave() {
    storage = getItemsFromList(list);
  }

  document.getElementById('add').addEventListener('click', doAdd);
  list.addEventListener('input', doSave);
});