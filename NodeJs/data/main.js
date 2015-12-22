var srcFileName="rawData/agriRaw.csv";
var targetFile1="finalData/file1.json";
var fs=require('fs');
var oilseed=[];
var foodgrain=[];
var commercial={};
var areaWise={};
var southStates=["Andhra Pradesh","Karnataka","Kerala","Tamil Nadu"];
var lineReader = require('readline').createInterface({
  input: fs.createReadStream(srcFileName)
});

var sortArray=function(arr,prop)
{
  arr.sort(function (a, b) {
    aVal=parseFloat(a[prop]);
    bVal=parseFloat(b[prop]);
  if (parseFloat(aVal) < bVal) {
    return 1;
  }
  if (aVal > bVal) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
return arr;
}

// checks for NA values and truns them to 0
var checkForNA=function(x)
{
  if(x=="NA" || x==NaN)
  {
    return 0;
  }
  return x;
}
// checkForKeywords(true/false,comma SeparatedKeywords)
var checkForKeywords=function(req,str,line)
{
  str=str.toLowerCase();
  line=line.toLowerCase();
  strs=str.split(",");
  for(i=0;i<strs.length;i++)
  {
    flag=false;
    if(line.indexOf(strs[i])>=0)
    {
      flag=true;
    }

    if( ( req && flag ) || ( !req && !flag ) ) {

    }
    else {
      return false;
    }
  }

  return true;
}
var fetchCropName=function(fullName){
  fullnames=fullName.split(" ");
  if(fullnames.length==4)
  {
    return fullnames[3];
  }
  else if (fullnames.length>4){
    return fullnames[3]+" "+fullnames[4]
  }
  else {
    return "Total";
  }
}

////////////////////////////////////////// filtrations based on requirements////////////////////////////////////
// snippet used for First graph
var createJsonForFirstAssignment=function()
{
  console.log("initiating first Assignment transformation!!");
  var rawArr=[];

  var populateSingleObj=function(name,prod,unit)
  {
    this.name=name;
    this.prod=prod;

  }
  headers=[];
  var flag=true;
  lineReader.on('line', function (line,err) {
    if(flag)
    {
      headers=line.split(",");
      flag=false;
    }
    if (checkForKeywords(true,"Ton mn",line) && checkForKeywords(false,"volume,Foodgrains Production",line))
    {
      if(checkForKeywords(true,"Production foodgrains",line) )
      {
        rawArr=line.split(",");
        name=fetchCropName(rawArr[0]);
        foodgrain.push(new populateSingleObj(name,checkForNA(rawArr[24])));
      }
      else if(checkForKeywords(true,"Production oilseed",line) )
      {
        rawArr=line.split(",");
        name=fetchCropName(rawArr[0]);
        oilseed.push(new populateSingleObj(name,checkForNA(rawArr[24])));
      }
  }
    else   if (checkForKeywords(true,"Commercial",line))
    {
      rawArr=line.split(",");
      for (i=4;i<rawArr.length;i++)
      {
        if(checkForNA(rawArr[i]))
        commercial[headers[i-1]]=parseFloat(commercial[headers[i-1]]||0)+parseFloat(checkForNA(rawArr[i]));

      }

    }
    else if(checkForKeywords(true,"rice area",line)) {
      rawArr=line.split(",");
      fullName=rawArr[0].split(" ");
      state="";
      if(fullName.length==6)
      {
        state=fullName[5];

        }
        else if(fullName.length>6)
        {

          state=fullName[5]+" "+fullName[6];
        }
          if(southStates.indexOf(state)>=0)
          {
            // console.log(state);
            for (i=4;i<rawArr.length;i++)
            {
              areaWise[headers[i-1]]=areaWise[headers[i-1]]||{};
              areaWise[headers[i-1]][state]=parseFloat(areaWise[headers[i-1]][state]||0)+parseFloat(checkForNA(rawArr[i]));
            }

          }




    }


  if (err) {
    throw err;
  }
  else {

  }
});

lineReader.on('close', function () {
  finalObj={};
  finalObj.foodgrains=sortArray(foodgrain,"prod");
  finalObj.oilseed=sortArray(oilseed,"prod");
  finalObj.commercial=commercial;
  finalObj.areaWise=areaWise;
  fs.writeFile(targetFile1,JSON.stringify(finalObj));

});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//implementations
createJsonForFirstAssignment();
console.log("done!");
