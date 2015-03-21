(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.desktopNotificator = factory();
    }
}(this, function () {

    var desktopNotificator = {
      version: '0.0.1',
      isNotificationLibraryAvailiable: false,
      running: false,
      lastNotificationTime: 0,
      lastNotification: null,
      minimumNotificationsTimeout: 120000,  /// minimum delay between notifications popups
      autoStart: true,                      /// auto start loop when item is added to stack
      interval: 1000,                       /// check if there're new items in stack every microseconds
      pageVisibility: true,                 /// show notifications when window is not active
      autoClose: 5000,                      /// display notification for X microseconds (may not work in all browsers)
      defaultIcon: 'http://dummyimage.com/32x32/000/fff.gif', /// default icon image URL
      stack: []

    };

    if (typeof(notify) !== 'undefined')
    {
      desktopNotificator.isNotificationLibraryAvailiable = true;
    } else {
      console.error('Notification library(https://github.com/ttsvetko/HTML5-Desktop-Notifications) '+
        'is not availiable. Please check dependencies.');
      desktopNotificator.isNotificationLibraryAvailiable = false;
    }


    (function (window, document, desktopNotificator) {
      'use strict';

      /**
       * Has permission to show desktop notifications?
       * @param  {Boolean}  raw Return raw value from notify library?
       * @return {*}        true if permission granted, false otherwise. String value from notify library if raw == true
       */
      desktopNotificator.hasPermission = function(raw) {
        if (!notify.isSupported)
          return false;

        if (typeof(raw) !== 'undefined' && raw)
          return notify.permissionLevel();

        if (notify.permissionLevel() == notify.PERMISSION_GRANTED)
          return true;
        else
          return false;
      }

      /**
       * Request permission to show desktop notifications
       * @param  {Function} callback callback function
       * @return {Boolean}           false if permission is denied
       */
      desktopNotificator.requestPermission = function(callback) {
        if (notify.permissionLevel() == notify.PERMISSION_GRANTED)
          return true;
        if (notify.permissionLevel() == notify.PERMISSION_DENIED)
          return false;

        if (typeof(callback) == 'function')
          notify.requestPermission(callback);
        else
          notify.requestPermission();

        return true;
      }

      /**
       * Check if there're not read items and display notification. Async loop function.
       * @return {Boolean} true if there's notification
       */
      desktopNotificator.process = function() {
        if (desktopNotificator.unreadCount() && 
          desktopNotificator.lastNotificationTime < Date.now() - desktopNotificator.minimumNotificationsTimeout)
        {
          /// need to show.
          var items = desktopNotificator.getNotRead();
          var title = items[0].title;
          var text = items[0].description;
          if (items.length > 1)
          {
            title = "There're "+items.length+" not read notifications";
            text = "There're "+items.length+" not read notifications";
          }

          desktopNotificator.show(title, text);

          return true;
        }

        return false;
      }

      /**
       * Start notification loop
       * @return {Boolean} Success
       */
      desktopNotificator.start = function() {
        return desktopNotificator.run();
      }

      /**
       * Start notification loop
       * @return {Boolean} Success
       */
      desktopNotificator.run = function() {
        if (desktopNotificator.running)
          return true;

        desktopNotificator.running = true;
        desktopNotificator.process();
        desktopNotificator.runningInterval = setInterval(desktopNotificator.process, desktopNotificator.interval);

        return true;
      }

      /**
       * Stop notification loop
       * @return {Boolean} Success
       */
      desktopNotificator.stop = function() {
        if (!desktopNotificator.running)
          return true;

        desktopNotificator.running = false;
        clearInterval(desktopNotificator.runningInterval);

        return true;
      }

      /**
       * Show desktop notification. Close previous one if it's active
       * @param  {String} title Title
       * @param  {String} text  Description
       * @return {Boolean}      Success
       */
      desktopNotificator.show = function(title, text) {
        desktopNotificator.lastNotificationTime = Date.now();

        if (desktopNotificator.lastNotification && typeof(desktopNotificator.lastNotification.close) !== 'undefined')
          desktopNotificator.lastNotification.close();

        notify.config({pageVisibility: desktopNotificator.pageVisibility, autoClose: desktopNotificator.autoClose});

        var icon = desktopNotificator.defaultIcon;
        desktopNotificator.lastNotification = notify.createNotification(title, {
          body: text,
          icon: icon,
          tag: Date.now()
        }); 

        return true;
      }

      /**
       * Set desktopNotificator config variables
       *
       * desktopNotificator.config({
       *   minimumNotificationsTimeout: 120000,  /// minimum delay between notifications popups
       *   autoStart: true,                      /// auto start loop when item is added to stack
       *   interval: 1000,                       /// check if there're new items in stack every microseconds
       *   pageVisibility: true,                 /// show notifications when window is not active
       *   autoClose: 5000,                      /// display notification for X microseconds (may not work in all browsers)
       *   defaultIcon: 'http://dummyimage.com/32x32/000/fff.gif' /// default icon image URL
       * });
       * 
       * @param  {Object} options Options hash
       * @return {Boolean}        Success
       */
      desktopNotificator.config = function(options) {
        for (var k in options)
          if (typeof(desktopNotificator[k]) !== 'undefined' && typeof(desktopNotificator[k]) !== 'function')
            desktopNotificator[k] = options[k];

        desktopNotificator.autoClose = parseInt(desktopNotificator.autoClose, 10);
        if (desktopNotificator.autoClose < 0)
          desktopNotificator.autoClose = 0;

        desktopNotificator.minimumNotificationsTimeout = parseInt(desktopNotificator.minimumNotificationsTimeout, 10);
        if (desktopNotificator.minimumNotificationsTimeout < desktopNotificator.autoClose)
          desktopNotificator.minimumNotificationsTimeout = desktopNotificator.autoClose;

        if (typeof(options.interval) !== 'undefined' && desktopNotificator.running)
        {
          desktopNotificator.stop();
          desktopNotificator.start();
        }
        if (typeof(options.autoStart) !== 'undefined' && options.autoStart && desktopNotificator.unreadCount() > 0)
          desktopNotificator.start();

        return true;
      }

      /**
       * Add item to stack
       * @param {String} title       Title
       * @param {String} description Description text
       * @param {String} url         URL for more information about item
       * @param {*} data        Any data you want to save
       */
      desktopNotificator.addItem = function(title, description, url, data) {
        var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        });

        desktopNotificator.stack.push({
          id: id,
          title: title,
          description: description,
          url: url,
          data: data,
          isRead: false,
          isShown: false
        });

        if (desktopNotificator.autoStart)
          desktopNotificator.start();

        return id;
      }

      /**
       * Get item from stack by item id
       * @param  {Number} id Item id
       * @return {Object}    Item object or null if item is not found
       */
      desktopNotificator.getItemById = function(id) {
        var found = null;
        desktopNotificator.stack.map(function(i){
          if (i.id == id)
            found = i;
        });        

        return found;
      }

      /**
       * Remove item from stack
       * @param  {Number} id Item id
       * @return {Boolean}   Success
       */
      desktopNotificator.removeItem = function(id) {
        desktopNotificator.stack = desktopNotificator.stack.filter(function(i) {
          return i.id != id;
        });

        return true;
      }

      /**
       * Mark item as read
       * @param  {Number} id Item id
       * @return {Boolean}   Success
       */
      desktopNotificator.markItemAsRead = function(id) {
        desktopNotificator.stack.map(function(i){
          if (i.id == id)
            i.isRead = true;
        });

        return true;
      }

      /**
       * Mark item as shown
       * @param  {Number} id Item id
       * @return {Boolean}   Success
       */
      desktopNotificator.markItemAsShown = function(id) {
        desktopNotificator.stack.map(function(i){
          if (i.id == id)
            i.isShown = true;
        });

        return true;
      }

      /**
       * Empty stack
       * @return {Boolean} Success
       */
      desktopNotificator.clear = function() {
        desktopNotificator.stack = [];

        return true;
      }

      /**
       * Returns array of not read items
       * @return {Array} Returns filtered array of items
       */
      desktopNotificator.getNotRead = function() {
        return desktopNotificator.stack.filter(function(i) {
          return !i.isRead;
        });
      }

      /**
       * Returns array of items with not yet shown notifications
       * @return {Array} Returns filtered array of items
       */
      desktopNotificator.getNotShown = function() {
        return desktopNotificator.stack.filter(function(i) {
          return !i.isShown;
        });
      }

      /**
       * Get count of items in stack
       * @return {Number} Returns items count
       */
      desktopNotificator.count = function() {
        return desktopNotificator.stack.length;
      }

      /**
       * Get count of unread items
       * @return {Number} Returns count of unread items
       */
      desktopNotificator.unreadCount = function() {
        var cnt = 0;
        desktopNotificator.stack.map(function(i){
          if (!i.isRead)
            cnt++;
        });

        return cnt;
      }

      /**
       * Get count of items with not yet shown notifications
       * @return {Number} Returns count of not shown items
       */
      desktopNotificator.notShownCount = function() {
        var cnt = 0;
        desktopNotificator.stack.map(function(i){
          if (!i.isShown)
            cnt++;
        });

        return cnt;
      }

    }(window, document, desktopNotificator));

    return desktopNotificator;

}));