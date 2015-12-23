var srcFileName="rawData/agriRaw.csv";
var targetFile1="finalData/file1.json";
var fs=require('fs');
var oilseed=[];
var foodgrain=[];
var commercial={};
var areaWise=[];
var southStates=["Andhra Pradesh","Karnataka","Kerala","Tamil Nadu"];
var lineReader = require('readline').createInterface({
  input: fs.createReadStream(srcFileName)
});
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
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

  var populateSingleObj=function(name,prod)
  {
    this.name=name;
    this.prod=prod;

  }
  var populateSingleObjAreaWise=function(year,state,prod)
  {

    this.year=year.substring(year.indexOf("-")+1);
    this.state=state;
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
              // areaWise[headers[i-1]]=areaWise[headers[i-1]]||{};
              // areaWise[headers[i-1]][state]=parseFloat(areaWise[headers[i-1]][state]||0)+parseFloat(checkForNA(rawArr[i]));
              //  areaWise.push(new populateSingleObjAreaWise(headers[i-1],state,checkForNA(rawArr[i])));
              if(checkForNA(rawArr[i])!=0)
              {
              year=headers[i-1];
              arr=areaWise[i-4];
              arr=arr||{year:year.substring(year.indexOf("-")+1)};
              arr[state]=parseFloat(checkForNA(rawArr[i]));
              areaWise[i-4]=arr;
              }
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
  finalObj.foodgrain=sortArray(foodgrain,"prod");
  finalObj.oilseed=sortArray(oilseed,"prod");
  myKey=Object.keys(commercial);
  tempObj=[];
  for(i=0;i<myKey.length;i++)
  {
    tempObj.push({name:myKey[i],data:commercial[myKey[i]]});
  }
  finalObj.commercial=tempObj;

  areaWise.clean(null);
  areaWise.clean(undefined);
  finalObj.areaWise=areaWise;
  fs.writeFile(targetFile1,JSON.stringify(finalObj));

});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//implementations
createJsonForFirstAssignment();
console.log("done!");
