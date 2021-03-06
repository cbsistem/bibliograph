/* ************************************************************************

 Bibliograph: Online Collaborative Reference Management

 Copyright:
 2007-2015 Christian Boulanger

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Christian Boulanger (cboulanger)

 ************************************************************************ */

/*global qx qcl z3950*/

/**
 * UI for Library Import Plugin
 */
qx.Class.define("z3950.ImportWindowUi",
{
  extend : z3950.ImportWindow,
  construct : function()
  {
    this.base(arguments);
    this.__qxtCreateUI();
  },
  members : {
    __qxtCreateUI : function()
    {

      var app = this.getApplication();

      // window
      var importWindow = this;
      importWindow.setWidth(700);
      importWindow.setCaption(this.tr('Import from library catalog'));
      importWindow.setShowMinimize(false);
      importWindow.setVisibility("excluded");
      importWindow.setHeight(500);

      // events
      qx.event.message.Bus.getInstance().subscribe("logout", function(e) {
        importWindow.close()
      }, this)
      importWindow.addListener("appear", function(e) {
        importWindow.center();
      }, this);

      // layout
      var qxVbox1 = new qx.ui.layout.VBox(5, null, null);
      qxVbox1.setSpacing(5);
      importWindow.setLayout(qxVbox1);

      // toolbar
      var qxToolBar1 = new qx.ui.toolbar.ToolBar();
      importWindow.add(qxToolBar1);

      // datasource select box
      var selectBox = new qx.ui.form.VirtualSelectBox();
      selectBox.setLabelPath("label");
      this.datasourceSelectBox = selectBox;
      selectBox.setWidth(300);
      selectBox.setMaxHeight(25);
      qxToolBar1.add(selectBox);
      
      // bindings
      var delegate = {
        bindItem : function(controller, item, id) {
          var selection = new qx.data.Array();
          controller.bindProperty("label", "label", null, item, id);
          controller.bindProperty("selected", "selection", { 
            converter: function(selected){
              if (selected) {
                selection.push(item.getModel());
              }
              return selection;
            }
          }, selectBox, id);    
        }
      };
      //selectBox.setDelegate(delegate);
      selectBox.bind("selection[0].label", selectBox, "toolTipText", null);

      // store
      var store = new qcl.data.store.JsonRpc(null,"z3950.Service");
      var model = qx.data.marshal.Json.createModel([]);
      store.setModel( model );
      store.bind("model",selectBox,"model");
      store.load("getServerListItems");
      
      // reload datassources 
      qx.event.message.Bus.getInstance().subscribe("z3950.reloadDatasources", function(e) {
        store.load("getServerListItems");
      }, this);
      
      qxToolBar1.addSpacer();

      // searchbox
      var qxHbox1 = new qx.ui.layout.HBox(null, null, null);
      qxHbox1.setSpacing(5);
      var qxComposite1 = new qx.ui.container.Composite();
      qxComposite1.setLayout(qxHbox1)
      qxComposite1.setPadding(4);
      qxToolBar1.add(qxComposite1, { flex : 1 });
      var searchBox = new qx.ui.form.TextField(null);
      this.searchBox = searchBox;
      searchBox.setPadding(2);
      searchBox.setPlaceholder(this.tr('Enter search terms'));
      searchBox.setHeight(26);
      qxComposite1.add(searchBox, { flex : 1 });
      searchBox.addListener("keypress", this._on_keypress, this);
      searchBox.addListener("dblclick", function(e) {
        e.stopPropagation();
      }, this);

      // search button
      this.searchButton = new qx.ui.form.Button(this.tr('Search'));
      this.searchButton.addListener("execute", function(e) {
        this.startSearch();
      }, this);
      qxComposite1.add(this.searchButton);
      
      // help button
      var helpButton = new qx.ui.toolbar.Button(this.tr('Help'));
      qxComposite1.add(helpButton);
      helpButton.addListener("execute", function(e){
        this.getApplication().showHelpWindow("plugin/z3950/search");
      }, this);      

      // listview
      var listView = new bibliograph.ui.reference.ListView();
      this.listView = listView;
      listView.setDecorator("main");
      listView.setModelType("record");
      listView.setServiceName("z3950.Service");
      importWindow.add(listView, { flex : 1 });

      // footer
      var qxHbox2 = new qx.ui.layout.HBox(5, null, null);
      var qxComposite2 = new qx.ui.container.Composite();
      qxComposite2.setLayout(qxHbox2)
      importWindow.add(qxComposite2);
      qxHbox2.setSpacing(5);

      // status label
      this.statusTextLabel = new qx.ui.basic.Label(null);
      this.statusTextLabel.setTextColor("#808080");
      qxComposite2.add(this.statusTextLabel);
      this.listView.bind("store.model.statusText", this.statusTextLabel, "value");

      // spacer
      var qxSpacer2 = new qx.ui.core.Spacer(null, null);
      qxComposite2.add(qxSpacer2, {
        flex : 10
      });

      // import button
      var importButton = new qx.ui.form.Button(this.tr('Import selected records'));
      this.importButton = importButton;
      importButton.setEnabled(false);
      qxComposite2.add(importButton);
      importButton.addListener("execute", function(e) {
        this.importSelected()
      }, this);

      // close button
      var qxButton1 = new qx.ui.form.Button(this.tr('Close'));
      qxComposite2.add(qxButton1);
      qxButton1.addListener("execute", function(e) {
        this.close()
      }, this);
    }
  }
});


