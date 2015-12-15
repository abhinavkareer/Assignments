$(function()
{
  //  method to minimize messenger bar and change the icon
  $('#minMessenger').click(function(e)
  {
    e.preventDefault();
    if($('#messengerBody').is(':visible'))
    {
      $('#minMessenger').html('<span class="glyphicon glyphicon-chevron-up"></span>');
    }
    else {
      $('#minMessenger').html('<span class="glyphicon glyphicon-chevron-down"></span>');

    }
    $('#messengerBody').toggle('slow');


  });



});
