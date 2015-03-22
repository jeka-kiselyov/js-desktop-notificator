# js-desktop-notificator
Javascript Library for Managing Desktop Notifications Stack

Demo Application
-------

[Demo Application](http://jeka-kiselyov.github.io/js-desktop-notificator/)

Installation
-------


**manual**

Download both [js-desktop-notificator](https://github.com/jeka-kiselyov/js-desktop-notificator) and [html5-desktop-notifications libraries](https://github.com/ttsvetko/HTML5-Desktop-Notifications) to your `vendors` folder. Add:

    <script src="vendors/html5-desktop-notifications/desktop-notify.js"></script>
    <script src="vendors/js-desktop-notificator/desktop-notificator.js"></script>

to `head` tag.

**bower**

Coming soon.

Usage
-------

    if (!desktopNotificator.hasPermission())
        desktopNotificator.requestPermission(function(){
            /// permissions updated
        });
    desktopNotificator.addItem('New notification', 'Some text for description');

Documentation
-------

- desktopNotificator.config()
Set desktopNotificator config variables
    
        desktopNotificator.config({
            minimumNotificationsTimeout: 120000,  
            /// minimum delay between notifications popups, 
            /// default: 120 seconds (120000 microseconds)
            autoStart: true,                      
            /// auto start loop when item is added to stack, 
            /// default true
            interval: 1000,                       
            /// check if there're new items in stack every microseconds
            /// default: 1 second (1000 microseconds)
            pageVisibility: true,                 
            /// show notifications when window is not active
            /// default: true
            autoClose: 5000,                      
            /// display notification for X microseconds 
            /// (may not work in all browsers)
            /// default: 5 seconds
            defaultIcon: 'http://dummyimage.com/32x32/000/fff.gif' 
            /// default icon image URL
        });
- desktopNotificator.addItem(title, description, url, data)
Add item to notifications stack. Returns item unique ID
- desktopNotificator.getItemById(id)
Get item by ID from notifications stack
- desktopNotificator.removeItem(id)
Remove item from notifications stack
- desktopNotificator.markItemAsRead(id)
Mark item as read. desktopNotificator shows notification only for unread items.
- desktopNotificator.clear()
Clear items stack
- desktopNotificator.getNotRead()
Get array of not read items
- desktopNotificator.count()
Get total count of items
- desktopNotificator.unreadCount()
Get count of not read items
- desktopNotificator.hasPermission()
Returns true if desktopNotificator has permissons to show desktop notifications. False otherwise.
- desktopNotificator.hasPermission(true)
Returns raw permission value from [html5-desktop-notifications libraries](https://github.com/ttsvetko/HTML5-Desktop-Notifications) library.
- desktopNotificator.requestPermission(callbackFunction)
Request user for permissions to show notifications. Calls callbackFunction when user do his choice.
- desktopNotificator.start()
Starts showing desktop notifications. No need to call this, if config.autoStart == true (default)
- desktopNotificator.stop()
Stop showing desktop notifications


License
-------

Apache 2.0