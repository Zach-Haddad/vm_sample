$(document).ready(function(){
  var root = 'https://jsonplaceholder.typicode.com';
  var dragSourceEl, dragSourceId, dragSourceText, sourceParent, sourceParentId,
    targetParent, targetParentId;

  function fetchUserName( userId ){
    var $label = $(`#user${userId}Label`);
    $.ajax({
      url: root + `/users/${userId}`,
      method: 'GET'
    }).then(function(data){
      var name = data.name;
      $label.text(`${name}'s collection`);
    });
  }

  function fetchAlbums( userId ){
    var $table = $(`#user${userId}Table`);
    $table.append(`<div class="header-wrap row">
      <div class="header column id">Album Id</div>
      <div class="header column title">Album Title</div>
      </div>`);

    $.ajax({
      url: root + `/users/${userId}/albums`,
      method: 'GET'
    }).then(function(data) {
      data.forEach(function(album){
        var title = album.title;
        var id = album.id;
        $table.append(`<div class="row table-row" draggable="true">
          <div class="column id">${id}</div>
          <div class="column title">${title}</div>
          </div>`);
      });
    }).then(function(){
      installListeners();
    });
  }

  function installListeners(){
    var $rows = $(".table-row");
    $rows.on('dragstart', handleDragStart);
    $rows.on('dragenter', handleDragEnter);
    $rows.on('dragover', handleDragOver);
    $rows.on('dragleave', handleDragLeave);
    $rows.on('drop', handleDrop);
    $rows.on('dragend', handleDragEnd);
  }

  function handleDragStart(e){
    this.style.opacity = '0.4';
    dragSourceEl = this;
    dragSourceId = parseInt(dragSourceEl.childNodes[1].textContent);
    dragSourceText = dragSourceEl.childNodes[3].textContent;
    sourceParent = dragSourceEl.parentElement;
    sourceParentId = parseInt(sourceParent.id[4]);
  }

  function handleDragOver(e){
    e.preventDefault();
    // e.dataTransfer.dropEffect = 'move';
  }

  function handleDragEnter(e){
    this.classList.add('over');
  }

  function handleDragLeave(e){
    this.classList.remove('over');
  }

  function handleDrop(e){
    // e.preventDefault();
    // e.stopPropagation();
    var target = this;
    targetParent = this.parentElement;
    targetParentId = parseInt(targetParent.id[4]);

    if (sourceParentId !== targetParentId) {
      $.ajax({
        url: root + `/albums/${dragSourceId}`,
        method: 'PATCH',
        data: {
          "userId": `${targetParentId}`,
          "id": `${dragSourceId}`,
          "title":`${dragSourceText}`
        }
      }).then(function(data){
        moveRow(target);
      });
    } else {
      moveRow(this);
    }

  }

  function moveRow(targetEl){
    if (targetEl.nextSibling) {
      targetParent.insertBefore(dragSourceEl, targetEl);
    } else {
      targetParent.insertBefore(dragSourceEl, targetEl.nextSibling);
    }

    targetEl.classList.remove('over');
  }


  function handleDragEnd(e){
    this.style.opacity = '1';
  }

  function populate(){
    fetchUserName(1);
    fetchUserName(2);
    fetchAlbums(1);
    fetchAlbums(2);
  }

  populate();
});
