
(function(){
  alert("yo");
  var filePath="./finalData/file1.json";
  loadJSON(function(response) {
    // Parse JSON string into object
      var actual_JSON = JSON.parse(response);
      console.log(actual_JSON);
   },filePath);


}());
