describe("desktopNotificator", function() {

	beforeEach(function() {
		desktopNotificator.clear();
	});

	it("is defined", function() {
		expect(desktopNotificator).toBeDefined();
	});

	it("has working config method", function() {
		desktopNotificator.config({
			defaultIcon: 'http://dummyimage.com/64x64/000/fff.gif',
			pageVisibility: false,
			minimumNotificationsTimeout: 20000,
			autoStart: false,
			interval: 2000,
			autoClose: 10000
		});
		expect(desktopNotificator.defaultIcon).toEqual('http://dummyimage.com/64x64/000/fff.gif');
		expect(desktopNotificator.pageVisibility).toEqual(false);
		expect(desktopNotificator.minimumNotificationsTimeout).toEqual(20000);
		expect(desktopNotificator.autoStart).toEqual(false);
		expect(desktopNotificator.interval).toEqual(2000);
		expect(desktopNotificator.autoClose).toEqual(10000);
	});

	it("is ready for a new item", function() {
		expect(desktopNotificator.addItem).toBeDefined();
		desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.stack).toBeDefined();
		expect(desktopNotificator.unreadCount()).toEqual(1);
		expect(desktopNotificator.count()).toEqual(1);
		desktopNotificator.addItem('title2', 'desc2', 'url2');
		expect(desktopNotificator.unreadCount()).toEqual(2);
		expect(desktopNotificator.count()).toEqual(2);
	});

	it("can mark item as unread", function() {
		var id = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(1);
		desktopNotificator.markItemAsRead(id);
		expect(desktopNotificator.unreadCount()).toEqual(0);
		expect(desktopNotificator.count()).toEqual(1);
		var id2 = desktopNotificator.addItem('title', 'desc', 'url');
		var id3 = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(2);
		expect(desktopNotificator.count()).toEqual(3);
		desktopNotificator.markItemAsRead(id2);
		expect(desktopNotificator.unreadCount()).toEqual(1);
		expect(desktopNotificator.count()).toEqual(3);
		desktopNotificator.markItemAsRead(id3);
		expect(desktopNotificator.unreadCount()).toEqual(0);
		expect(desktopNotificator.count()).toEqual(3);
	});

	it("can remove item", function() {
		var id = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(1);
		expect(desktopNotificator.count()).toEqual(1);
		desktopNotificator.removeItem(id);
		expect(desktopNotificator.unreadCount()).toEqual(0);
		expect(desktopNotificator.count()).toEqual(0);
		var id2 = desktopNotificator.addItem('title', 'desc', 'url');
		var id3 = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(2);
		expect(desktopNotificator.count()).toEqual(2);
		desktopNotificator.removeItem(id2);
		expect(desktopNotificator.unreadCount()).toEqual(1);
		expect(desktopNotificator.count()).toEqual(1);
		desktopNotificator.removeItem(id3);
		expect(desktopNotificator.unreadCount()).toEqual(0);
		expect(desktopNotificator.count()).toEqual(0);
	});

	it("has working getNotRead method", function() {
		var id = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(1);
		var notRead = desktopNotificator.getNotRead();
		expect(notRead.length).toEqual(1);
		expect(notRead[0].id).toEqual(id);
		desktopNotificator.markItemAsRead(id);
		var notRead = desktopNotificator.getNotRead();
		expect(desktopNotificator.unreadCount()).toEqual(0);
		expect(notRead.length).toEqual(0);
		var id2 = desktopNotificator.addItem('title', 'desc', 'url');
		var id3 = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(2);
		var notRead = desktopNotificator.getNotRead();
		expect(notRead.length).toEqual(2);
		desktopNotificator.markItemAsRead(id2);
		expect(desktopNotificator.unreadCount()).toEqual(1);
		var notRead = desktopNotificator.getNotRead();
		expect(notRead.length).toEqual(1);
	});

	it("has working getItemById method", function() {
		var id = desktopNotificator.addItem('title', 'desc', 'url');
		expect(desktopNotificator.unreadCount()).toEqual(1);
		var found = desktopNotificator.getItemById(id);
		expect(found.id).toEqual(id);
	});





});
