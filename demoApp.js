      var app = {};

      app.permissionRequestCallback = function()
      {
        $('#permission_alert_error').hide();
        $('#permission_alert_wrong').hide();
        $('#permission_alert_ok').hide();
        $('#permission_alert_disabled').hide();

        var p = desktopNotificator.hasPermission(true);

        if (p === false)
          $('#permission_alert_error').show();
        else if (p == notify.PERMISSION_GRANTED)
          $('#permission_alert_ok').show();
        else if (p == notify.PERMISSION_DENIED)
          $('#permission_alert_disabled').show();
        else if (p == notify.PERMISSION_DEFAULT)
          $('#permission_alert_wrong').show();
      }

      app.addItem = function(title, body)
      {
        var id = desktopNotificator.addItem(title, body);

        var html = "<li class='list-group-item' id='item_"+id+"'>"+title.split('<').join('&lt;')+"</li>";
        $('#items_container').prepend(html);

        $('#item_'+id).mouseenter(function(){
          var id = $(this).attr('id').split('item_')[1];
          desktopNotificator.markItemAsRead(id);
          $(this).addClass('disabled');
        });
      }

      app.updateStatus = function()
      {
        $('#status_no_unread_hide').show();

        if (desktopNotificator.lastNotificationTime)
        {
          var diff = Date.now() - desktopNotificator.lastNotificationTime;
          diff = diff / 1000;
          $('#last_notification_seconds').html(diff.toFixed(1));
        } else {
          $('#last_notification_seconds').html("&infin;");          
        }

        if (desktopNotificator.unreadCount() > 0)
        {
          var diff = desktopNotificator.lastNotificationTime + desktopNotificator.minimumNotificationsTimeout - Date.now();
          diff = diff / 1000;
          $('#next_notification_seconds').html(diff.toFixed(1));
          $('#status_next_one').show();
          $('#status_no_unread_items').hide();

        } else {
          $('#status_next_one').hide();
          $('#status_no_unread_items').show();
        }
      }
      

      $(function(){
        setInterval(app.updateStatus, 100);
        app.permissionRequestCallback();


        $('#minimumNotificationsTimeout').val(desktopNotificator.minimumNotificationsTimeout).change(function(){
          desktopNotificator.config({minimumNotificationsTimeout: $(this).val()});
          $('#minimumNotificationsTimeout').val(desktopNotificator.minimumNotificationsTimeout);
        });
        $('#autoClose').val(desktopNotificator.autoClose).change(function(){
          desktopNotificator.config({autoClose: $(this).val()});
          $('#autoClose').val(desktopNotificator.autoClose);
        });
      });
