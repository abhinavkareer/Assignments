// Snippet to add cross browser utility for adding events
var eventUtility=
{
  addEvent:function(el,type,fn)
  {
    if(typeof addEventListener !="undefined")
    {
      el.addEventListener(type,fn,false);
    }
    else if(typeof attachEvent !="undefined")
    {
      el.attachEvent("on"+type,fn);
    }
    else {
      el["on"+type]=fn;
    }
  },

  // Snippet to add cross browser utility for removing events
  removeEvent:function(el,type,fn)
  {
    if(typeof removeEventListener !="undefined")
    {
      el.removeEventListener(type,fn,false);
    }
    else if(typeof detachEvent !="undefined")
    {
      el.detachEvent("on"+type,fn);
    }
    else {
      el["on"+type]=null;
    }
  },

  // Getting Target Element
  getTarget:function(event)
  {
    if(typeof event.target!="undefined")
    {
      return event.target;
    }
    else {
      return event.srcElement;
    }
  }
  ,
  // preventing the element from performing its default behaviour
  preventDefault:function(event)
  {
    if(typeof event.preventDefault!="undefined")
    {
      event.preventDefault();
    }
    else
    {
      event.returnValue=false;
    }
  }
}
