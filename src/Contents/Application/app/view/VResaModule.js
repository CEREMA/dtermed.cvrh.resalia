App.view.define('VResaModule', {
    extend: "Ext.Panel",
    alias: 'widget.VResaModule',
	
    initComponent: function() {

        this.layout = {
            type: 'vbox'
        };
		
		this.title = 'Module 1';
		this.width = "100%";
			
        this.items = [
				{
					layout: "hbox",
					padding: 10,
					border: false,
					width: "100%",
					height: 60,
					items: [
					{
						xtype: "datefield",
						renderer: Ext.util.Format.dateRenderer('d/m/Y'),
						itemId: "debutModule",
						allowBlank: false,
						startDay: 1,
						editable: false,
						fieldLabel: 'Début',
						labelAlign: "top",
						flex: 1,
						labelWidth: 50
					}, 
					{
						xtype: "datefield",
						margin: {
							left: 10
						},
						renderer: Ext.util.Format.dateRenderer('d/m/Y'),
						itemId: "finModule",
						startDay: 1,
						allowBlank: false,
						editable: false,
						fieldLabel: 'Fin',
						labelAlign: "top",
						flex: 1,
						labelWidth: 50
					},
					{
						xtype: 'numberfield',
						margin: {
							left: 10
						},
						itemId: "insert_numGeff",
						fieldLabel: "GEFF",
						labelAlign: "top",
						minValue: 0,
						width: 70,
						labelWidth: 50
					},
					{
						xtype: "numberfield",
						margin: {
							left: 10
						},							
						itemId: "participant",
						labelAlign: "top",
						allowBlank: false,
						minValue: 0,
						width: 100,
						labelWidth: 100,
						fieldLabel: "Nb participants"
					}
					]
				},
				{ 				
					xtype: 'radiogroup',
					fieldLabel: 'Avis de parution',
					width: 400,
					padding: 10,
					itemId: "rdAvis",
					columns: 5,
					vertical: false,
					items: [
					{
						boxLabel: 'Non',
						itemId: "RA1",
						name: 'ra',
						inputValue: '1',
						checked: true
					},
					{
						boxLabel: 'Oui',
						itemId: "RA0",
						name: 'ra',
						inputValue: '0'
					}
					]
				}, 
				{
					xtype: "grid",
					border: false,
					tbar: [
					{
						text: "Nouvelle ressource",
						iconCls: "plus_res",
						handler: function() {
							App.view.create('VResNew',{
								modal: true
							}).show();
						}
					}
					],
					columns: [
					{
						header: "Site",
						width: 100,
						dataIndex: "id_site",
						editor: {
							xtype: 'combobox',
							typeAhead: true,
							triggerAction: 'all',
							selectOnTab: true,
							displayField: "nomsalle",
							valueField: "id_site",
							store: App.store.create("reservation_salles://site"),
							lazyRender: true,
							listClass: 'x-combo-list-small',
							listeners: {
								select: function(combo, recs, opts){
									combo.fireEvent('blur');
								}								
							}
						}							
					},
					{
						header: "Salle",
						width: 150,
						field: {
							xtype: 'combobox',
							typeAhead: true,
							triggerAction: 'all',
							selectOnTab: true,
							displayField: "salle",
							valueField: "id_salle",
							store: App.store.create("reservation_salles://salle{id_salle,nomSalle+' ('+lieu+')'=salle}?id_site=1"),
							lazyRender: true,
							listClass: 'x-combo-list-small'
						}							
					}
					],
					plugins: [
						Ext.create('Ext.grid.plugin.CellEditing',{clicksToEdit: 1})
					],
					store: App.store.create({
					fields:[
						"id_site"
					],
					data:[
						{
							id_site: ""
						}
					]}),
					flex: 1,
					width: "100%"
				}	
		];

        this.callParent();
    }
});