var EVT_CURRENT="";

App.controller.define('CMain', {

	views: [
		"VMain"
	],
	
	models: [
		"TreeModel"
	],
	
	init: function()
	{

		this.control({
			"menu>menuitem": {
				click: "Menu_onClick"
			},
			"mainform": {
				render: "onShow"
			}
		});
		
		App.init('VMain',this.onLoad);
		
	},
	Menu_onClick: function(p)
	{
		if (p.itemId) {
			Ext.Msg.alert('Status', 'Click event on '+p.itemId);
		};			
	},
	onAuth: function(p,user) {
		EVT_CURRENT.user = user.mail;
		if (user.profiles.indexOf('ADMIN')>-1) Ext.getCmp('MNU_ADMIN').setVisible(true);		
		App.get('Menu#MenuPanel').update();
		
		var o = {
			Mail: EVT_CURRENT.user,
		};
		
		var store=App.store.create("reservation_salles://agents{Id,prenom+' '+nom=agent+}",{
			listeners: {
				load: function() {
					alert('x');
					var rec = { Id: 0, agent: '-----------' };
					store.insert(0,rec);				
				}
			}
		});
		store.load();
		App.get("mainform combo#selectAgent").bindStore(store);		
		
			
		App.reservation.getInfo(o, function(err, result) {	
			numLogin = result.result.data[0].Id;
			EVT_CURRENT.numLogin = numLogin;
			App.get('schedulergrid#schedule').getEventStore().load();
		});

		var now = new Date();
		App.get('schedulergrid#schedule').getResourceStore().getProxy().extraParams._cfg = 0;
		App.get('schedulergrid#schedule').getResourceStore().load();	
		var mm = ((now.getMonth() + 1) >= 10) ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
		
		App.get('combo#selectMonth').setValue(parseInt(mm)-1);

		function isWeekend(d) {
			return (d.getDay() == 6);
		};

		var year = now.getFullYear();
		var month = App.get('combo#selectMonth').getValue();

		function days_in_month(month, year) {
			var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			if (month != 2) return m[month - 1]; //tout sauf février
			if (year % 4 != 0) return m[1]; //février normal non bissextile
			if (year % 100 == 0 && year % 400 != 0) return m[1]; //février bissextile siècle non divisible par 400
			return m[1] + 1; //tous les autres févriers = 29 jours
		}

		days_in_month(mm, new Date().getFullYear());
		var resultat = days_in_month(mm, new Date().getFullYear()) + 1;
		EVT_CURRENT.resultat = resultat - 1;

		App.get('schedulergrid#schedule').setStart(new Date(year, month, 1));
		App.get('schedulergrid#schedule').setEnd(new Date(year, month, resultat));
		
		var tab=[];
		
		for (var i=-3;i<=3;i++) tab.push({year:year+i});
		
		var store = App.store.create({
			fields: [
				"year"
			],
			data: tab
		});

		App.get('mainform combo#selectAnnee').bindStore(store);
		App.get('mainform combo#selectAnnee').setValue(now.getFullYear());		
		
		// load "off" day
		App.DB.get('reservation_salles://off', function(p,r) {
			// add weekends to off day
			var weekends = [];
			for (var i=0;i<r.result.data.length;i++) {
				r.result.data[i].StartDate=r.result.data[i].StartDate.toDate();
				r.result.data[i].EndDate=r.result.data[i].EndDate.toDate();
			};
			for (var i = 1; i < resultat; i++) {
				var d = new Date(year, month, i);
				if (isWeekend(d)) r.result.data.push({
					StartDate: new Date(year, month, i),
					EndDate: new Date(year, month, i + 2),
					Type: "Week-end"
				});
			};
			App.get('schedulergrid#schedule').plugins[0].store.loadData(r.result.data);
		});
		
		// resize scheduler column
		App.get('schedulergrid#schedule').setTimeColumnWidth(70);
		
	},
	onShow: function(p)
	{
		var me=this;
		Auth.login(function(user) {
			me.onAuth(p, user);
		});	
	},
	onLoad: function(p)
	{
				
	}
	
	
});
