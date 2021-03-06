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

/*global qx qcl mdbackup*/

/**
 * Plugin Initializer Class
 */
qx.Class.define("mdbackup.Plugin",
{
  extend : qx.core.Object,
  include : [qx.locale.MTranslation],
  type : "singleton",
  members : {
    init : function()
    {
      // vars
      var app         = this.getApplication();
      var systemMenu  = app.getWidgetById("bibliograph/menu-system");
      var permMgr     = app.getAccessManager().getPermissionManager();
      var rpcMgr      = app.getRpcManager();
      
      // add backup menu
      var qxMenuButton4 = new qx.ui.menu.Button();
      qxMenuButton4.setLabel(this.tr('Backup (Mysqldump)'));
      systemMenu.add(qxMenuButton4);
      permMgr.create("mdbackup.create").bind("state", qxMenuButton4, "visibility", {
        converter : qcl.bool2visibility
      });
      var qxMenu2 = new qx.ui.menu.Menu();
      qxMenuButton4.setMenu(qxMenu2);
      var qxMenuButton5 = new qx.ui.menu.Button(this.tr('Create Backup'), null, null, null);
      qxMenuButton5.setLabel(this.tr('Create Backup'));
      qxMenu2.add(qxMenuButton5);
      qxMenuButton5.addListener("execute", function(e) {
        rpcMgr.execute("mdbackup.backup", "dialogCreateBackup", 
          [this.getApplication().getDatasource()]
        );
      }, this);
      var qxMenuButton6 = new qx.ui.menu.Button(this.tr('Restore Backup'), null, null, null);
      qxMenuButton6.setLabel(this.tr('Restore Backup'));
      qxMenu2.add(qxMenuButton6);
      qxMenuButton6.addListener("execute", function(e) {
        rpcMgr.execute("mdbackup.backup", "dialogRestoreBackup", 
          [this.getApplication().getDatasource()]
        );
      }, this);
      var qxMenuButton7 = new qx.ui.menu.Button(this.tr('Delete old backups'), null, null, null);
      permMgr.create("mdbackup.delete").bind("state", qxMenuButton7, "visibility", {
        converter : qcl.bool2visibility
      });      
      qxMenuButton7.setLabel(this.tr('Delete old backups'));
      qxMenu2.add(qxMenuButton7);
      qxMenuButton7.addListener("execute", function(e) {
        rpcMgr.execute("mdbackup.backup", "dialogDeleteBackups", 
          [this.getApplication().getDatasource()]
        );
      }, this);
    }
  }
});

