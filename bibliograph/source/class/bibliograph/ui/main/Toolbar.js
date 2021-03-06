/*******************************************************************************
 *
 * Bibliograph: Online Collaborative Reference Management
 *
 * Copyright: 2007-2015 Christian Boulanger
 *
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 *
 * Authors: Christian Boulanger (cboulanger)
 *
 ******************************************************************************/

/*global qx dialog qcl*/

/**
 * @asset(qx/icon/${qx.icontheme}/22/categories/system.png)
 * @asset(qx/icon/${qx.icontheme}/16/status/dialog-password.png)
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-users.png)
 * @asset(bibliograph/icon/16/search.png)
 * @asset(qx/icon/${qx.icontheme}/22/apps/utilities-help.png)
 * @asset(bibliograph/icon/16/help.png)
 * @asset(qx/icon/${qx.icontheme}/16/apps/utilities-archiver.png)
 * @asset(qx/icon/${qx.icontheme}/22/places/network-server.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/application-exit.png)
 * @asset(bibliograph/icon/16/cancel.png)
 * @ignore(qcl.bool2visibility)
 */
qx.Class.define("bibliograph.ui.main.Toolbar",
{
  extend : qx.ui.toolbar.ToolBar,
  construct : function()
  {
    this.base(arguments);
    this.__qxtCreateUI();
  },
  members : {
    __qxtCreateUI : function()
    {

      var app = qx.core.Init.getApplication();
      var permMgr = app.getAccessManager().getPermissionManager();
      var confMgr = app.getConfigManager();
      
      /*
       * Toolbar
       */
      var toolBar = this;
      var toolBarPart = new qx.ui.toolbar.Part();
      toolBar.add(toolBarPart);
      toolBar.setWidgetId("bibliograph/toolbar");

      /*
       * Login Button
       */
      var loginButton = new qx.ui.toolbar.Button(this.tr('Login'), "icon/16/status/dialog-password.png", null);
      loginButton.setLabel(this.tr('Login'));
      loginButton.setVisibility("excluded");
      loginButton.setIcon("icon/16/status/dialog-password.png");
      toolBarPart.add(loginButton);
      this.getApplication().bind("accessManager.authenticatedUser", loginButton, "visibility", {
        converter : function(v) {
          return v ? 'excluded' : 'visible'
        }
      });
      loginButton.addListener("execute", function(e) {
        this.getApplication().login();
      }, this);

      /*
       * Logout Button
       */
      var logoutButton = new qx.ui.toolbar.Button(this.tr('Logout'), "icon/16/actions/application-exit.png", null);
      logoutButton.setLabel(this.tr('Logout'));
      logoutButton.setVisibility("excluded");
      logoutButton.setIcon("icon/16/actions/application-exit.png");
      toolBarPart.add(logoutButton);
      this.getApplication().bind("accessManager.authenticatedUser", logoutButton, "visibility", {
        converter : function(v) {
          return v ? 'visible' : 'excluded'
        }
      });
      logoutButton.addListener("execute", function(e) {
        this.getApplication().logout();
      }, this);

      /*
       * User button
       */
      var qxToolBarButton1 = new qx.ui.toolbar.Button(this.tr('Loading...'), "icon/16/apps/preferences-users.png", null);
      qxToolBarButton1.setLabel(this.tr('Loading...'));
      qxToolBarButton1.setIcon("icon/16/apps/preferences-users.png");
      toolBarPart.add(qxToolBarButton1);
      this.getApplication().bind("accessManager.userManager.activeUser.fullname", qxToolBarButton1, "label", {

      });
      this.getApplication().bind("accessManager.authenticatedUser", qxToolBarButton1, "visibility", {
        converter : function(v) {
          return v ? 'visible' : 'excluded'
        }
      });
      qxToolBarButton1.addListener("execute", function(e) {
        this.getApplication().editUserData();
      }, this);

      var qxToolBarPart2 = new qx.ui.toolbar.Part();
      toolBar.add(qxToolBarPart2);

      /*
       * Datasources
       */
      var dsBtn = new qx.ui.toolbar.Button(this.tr('Datasources'), "icon/16/apps/utilities-archiver.png", null);
      dsBtn.setLabel(this.tr('Datasources'));
      dsBtn.setWidgetId("bibliograph/datasourceButton");
      dsBtn.setVisibility("excluded");
      dsBtn.setIcon("icon/16/apps/utilities-archiver.png");
      qxToolBarPart2.add(dsBtn);
      dsBtn.addListener("execute", function(e) {
        this.getApplication().getWidgetById("bibliograph/datasourceWindow").show();
      }, this);

      /*
       * System
       */
      var systemButton = new qx.ui.toolbar.MenuButton();
      systemButton.setIcon("icon/22/categories/system.png");
      systemButton.setVisibility("excluded");
      systemButton.setLabel(this.tr('System'));
      qxToolBarPart2.add(systemButton);
      permMgr.create("system.menu.view").bind("state", systemButton, "visibility", {
        converter : qcl.bool2visibility
      });
      var systemMenu = new qx.ui.menu.Menu();
      systemButton.setMenu(systemMenu);
      systemMenu.setWidgetId("bibliograph/menu-system");

      // Preferences
      var prefBtn = new qx.ui.menu.Button();
      prefBtn.setLabel(this.tr('Preferences'));
      systemMenu.add(prefBtn);
      permMgr.create("preferences.view").bind("state", prefBtn, "visibility", {
        converter : qcl.bool2visibility
      });
      prefBtn.addListener("execute", function(e) {
        var win = this.getApplication().getWidgetById("bibliograph/preferencesWindow").show();
      }, this);

      // Access management
      var aclBtn = new qx.ui.menu.Button();
      aclBtn.setLabel(this.tr('Access management'));
      systemMenu.add(aclBtn);
      permMgr.create("access.manage").bind("state", aclBtn, "visibility", {
        converter : qcl.bool2visibility
      });
      aclBtn.addListener("execute", function(e) {
        var win = this.getApplication().getWidgetById("bibliograph/accessControlTool").show();
      }, this);

      // Plugins
      var pluginBtn = new qx.ui.menu.Button();
      pluginBtn.setLabel(this.tr('Plugins'));
      systemMenu.add(pluginBtn);
      permMgr.create("plugin.manage").bind("state", pluginBtn, "visibility", {
        converter : qcl.bool2visibility
      });
      pluginBtn.addListener("execute", function(e) {
        this.getApplication().getRpcManager().execute("bibliograph.plugin", "manage");
      }, this);
      
      // Reset
      var resetBtn = new qx.ui.menu.Button();
      resetBtn.setLabel(this.tr('Reset'));
      systemMenu.add(resetBtn);
      permMgr.create("application.reset").bind("state", resetBtn, "visibility", {
        converter : qcl.bool2visibility
      });
      resetBtn.addListener("execute", function(e) {
        dialog.Dialog.confirm(this.tr("This will reset and reload the application"),function(ok){
          if ( !ok ) return;
          this.getApplication().getRpcManager().execute(
          "bibliograph.main", "reset", [], function(){
            document.location.reload();
          }, this);
        }, this);
      }, this);
      

      /*
       * Import Menu
       */
      var importBtn = new qx.ui.toolbar.MenuButton();
      importBtn.setLabel(this.tr('Import'));
      importBtn.setIcon("icon/22/places/network-server.png");
      toolBar.add(importBtn);
      permMgr.create("reference.import").bind("state", importBtn, "visibility", {
        converter : qcl.bool2visibility
      });
      var qxMenu3 = new qx.ui.menu.Menu();
      qxMenu3.setWidgetId("bibliograph/importMenu");
      importBtn.setMenu(qxMenu3);

      /*
       * Import Text file
       */
      var importTxtBtn = new qx.ui.menu.Button(this.tr('Import text file'));
      qxMenu3.add(importTxtBtn);
      importTxtBtn.addListener("execute", function(e) {
        this.getApplication().getWidgetById("bibliograph/importWindow").show();
      }, this);

      /*
       * Help menu
       */
      var helpMenuBtn = new qx.ui.toolbar.MenuButton(this.tr('Help'), "icon/22/apps/utilities-help.png", null);
      helpMenuBtn.setIcon("icon/22/apps/utilities-help.png");
      toolBar.add(helpMenuBtn);
      var helpMenu = new qx.ui.menu.Menu();
      helpMenuBtn.setMenu(helpMenu);
      helpMenu.setWidgetId("bibliograph/helpMenu");

      /*
       * Online help
       */
      var helpBtn = new qx.ui.menu.Button(this.tr('Online Help'));
      helpMenu.add(helpBtn);
      helpBtn.addListener("execute", function(e) {
        this.getApplication().showHelpWindow();
      }, this);
      

      /*
       * Bug report
       */
      var qxMenuButton10 = new qx.ui.menu.Button(this.tr('Report a problem or request a feature'));
      qxMenuButton10.setVisibility("excluded");
      helpMenu.add(qxMenuButton10);
      permMgr.create("application.reportBug").bind("state", qxMenuButton10, "visibility", {
        converter : qcl.bool2visibility
      });
      qxMenuButton10.addListener("execute", function(e) {
        this.getApplication().reportBug();
      }, this);

      /*
       * About
       */
      var qxMenuButton11 = new qx.ui.menu.Button(this.tr('About Bibliograph'), null, null, null);
      qxMenuButton11.setLabel(this.tr('About Bibliograph'));
      helpMenu.add(qxMenuButton11);
      qxMenuButton11.addListener("execute", function(e) {
        this.getApplication().showAboutWindow();
      }, this);

      /*
       * Datasource name
       */
      var qxAtom1 = new qx.ui.basic.Atom(null, null);
      toolBar.add(qxAtom1, {
        flex : 10
      });
      var dsNameLabel = new qx.ui.basic.Label(null);
      this.applicationTitleLabel = dsNameLabel;
      dsNameLabel.setPadding(10);
      dsNameLabel.setWidgetId("bibliograph/datasource-name");
      dsNameLabel.setRich(true);
      dsNameLabel.setTextAlign("right");
      toolBar.add(dsNameLabel);

      /*
       * Label to indicate application mode
       * Disabled, because maintenance mode does not do anything at the moment
       */
      // var qxAtom2 = new qx.ui.basic.Atom(null, null);
      // toolBar.add(qxAtom2, {
      //   flex : 1
      // });
      // qx.event.message.Bus.subscribe("application.setMode",function (e){
      //   var mode= e.getData();
      //   this.info("Switching application mode to '" + mode + "'." );
      //   var label = null;
      //   var toolTipText = null;
      //   var textColor = null;
      //   var visibility = "visible";
      //   switch( mode ){
      //     case "maintenance":
      //       label = this.tr("Maintenance Mode");
      //       toolTipText = this.tr("The application is currently in maintenance mode. You might experience problems. Please come back later.");
      //       textColor = "red";
      //       break;
      //     case "development":
      //       label = this.tr("Development Mode");
      //       toolTipText = this.tr("The application is currently in development mode. This should never be the case on a public server.");
      //       textColor = "green";
      //       break;
      //     default:
      //       visibility="excluded";
      //   };
      //   qxAtom2.set({
      //     "visibility": visibility,
      //     "label" : label,
      //     "toolTipText" : toolTipText,
      //     "textColor" : textColor
      //   });
      // },this);

      /*
       * Search Box
       */
      var searchbox = new qx.ui.form.TextField();
      this.searchbox = searchbox;
      searchbox.setWidgetId("bibliograph/searchbox");
      searchbox.setMarginTop(8);
      searchbox.setPlaceholder(this.tr('Enter search term'));
      toolBar.add(searchbox, {
        flex : 1
      });
      permMgr.create("reference.search").bind("state", searchbox, "visibility", {
        converter : qcl.bool2visibility
      });
      searchbox.addListener("keypress", function(e) {
        if (e.getKeyIdentifier() == "Enter")
        {
          var app = this.getApplication();
          var query = searchbox.getValue();
          app.setFolderId(0);
          app.setQuery(query);
          qx.event.message.Bus.dispatch(new qx.event.message.Message("bibliograph.userquery", query));
          app.getWidgetById("bibliograph/searchHelpWindow").hide();
        }
      }, this);
      searchbox.addListener("dblclick", function(e) {
        e.stopPropagation();
      }, this);
      searchbox.addListener("focus", function(e)
      {
        searchbox.setLayoutProperties( {
          flex : 10
        });
        this.getApplication().setInsertTarget(searchbox);
      }, this);
      searchbox.addListener("blur", function(e)
      {
        var timer = qx.util.TimerManager.getInstance();
        timer.start(function() {
          if (!qx.ui.core.FocusHandler.getInstance().isFocused(searchbox)) {
            searchbox.setLayoutProperties( {
              flex : 1
            });
          }
        }, null, this, null, 5000);
      }, this);

//      /*
//       * Experimental
//       */
////      var tokenfield = new tokenfield.Token();
//      tokenfield
//        .setLabelPath("name")
//        .setHintText(this.tr('Enter search term'));
//      qxToolBar1.add(tokenfield, { flex : 1 });
//      tokenfield.addListener("loadData", function(e)
//      {
//        var str = e.getData();
//        var data = [];
//        for (var i = 0; i < mockdata.length; i++) {
//          if( mockdata[i].name.toLowerCase().indexOf(str.toLowerCase()) !== -1 )
//          {
//            data.push(mockdata[i]);
//          }
//        }
//        qx.util.TimerManager.getInstance().start(function() {
//          t.populateList(str, data);
//        }, null, this, null, 500);
//      }, this);


      /*
       * Buttons
       */
      var qxToolBarButton3 = new qx.ui.toolbar.Button(null, "bibliograph/icon/16/search.png", null);
      qxToolBarButton3.setIcon("bibliograph/icon/16/search.png");
      toolBar.add(qxToolBarButton3);
      permMgr.create("reference.search").bind("state", qxToolBarButton3, "visibility", {
        converter : qcl.bool2visibility
      });
      qxToolBarButton3.addListener("execute", function(e)
      {
        var query = this.searchbox.getValue();
        var app = this.getApplication();
        app.getWidgetById("bibliograph/searchHelpWindow").hide();
        app.setFolderId(0);
        if (app.getQuery() == query)app.setQuery(null);

        app.setQuery(query);
        qx.event.message.Bus.dispatch(new qx.event.message.Message("bibliograph.userquery", query));
      }, this);
      var qxToolBarButton4 = new qx.ui.toolbar.Button(null, "bibliograph/icon/16/cancel.png", null);
      qxToolBarButton4.setIcon("bibliograph/icon/16/cancel.png");
      qxToolBarButton4.setMarginRight(5);
      toolBar.add(qxToolBarButton4);
      permMgr.create("reference.search").bind("state", qxToolBarButton4, "visibility", {
        converter : qcl.bool2visibility
      });
      qxToolBarButton4.addListener("execute", function(e)
      {
        this.searchbox.setValue("");
        this.searchbox.focus();
        this.getApplication().getWidgetById("bibliograph/searchHelpWindow").hide();
      }, this);
      var qxToolBarButton5 = new qx.ui.toolbar.Button(null, "bibliograph/icon/16/help.png", null);
      qxToolBarButton5.setIcon("bibliograph/icon/16/help.png");
      qxToolBarButton5.setMarginRight(5);
      toolBar.add(qxToolBarButton5);
      permMgr.create("reference.search").bind("state", qxToolBarButton5, "visibility", {
        converter : qcl.bool2visibility
      });
      qxToolBarButton5.addListener("execute", function(e)
      {
        var hwin = this.getApplication().getWidgetById("bibliograph/searchHelpWindow");
        hwin.show();
        hwin.center();
      }, this);
    }
  }
});
