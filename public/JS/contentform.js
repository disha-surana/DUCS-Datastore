var files;

$('input[type="file"][multiple]').change(
  function(e){
      files = this.files;
      $('#fileul').empty();
      for (i=0;i<files.length;i++){
          var val=files[i].name;
          $('#fileul').append("<li id='fileli'> " + val + "</li>");
      }
  });  

  