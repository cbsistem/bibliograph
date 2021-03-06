<?php
/* ************************************************************************

   Bibliograph: Collaborative Online Reference Management

   http://www.bibliograph.org

   Copyright:
     2004-2015 Christian Boulanger

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   *  Christian Boulanger (cboulanger)

************************************************************************ */

qcl_import("qcl_application_plugin_AbstractPlugin");
qcl_import("z3950_DatasourceModel");

/**
 * Plugin initializer for z3950 plugin
 */
class z3950_plugin
  extends qcl_application_plugin_AbstractPlugin
{

  /**
   * The descriptive name of the plugin
   * @var string
   */
  protected $name = "Z39.50 Plugin";

  /**
   * The detailed description of the plugin
   * @var string
   */
  protected $description  = "A plugin providing models for a Z39.50 connection";

  /**
   * An associative array containing data on the plugin that is saved when
   * the plugin is installed and that is sent to the client during application 
   * startup.
   * @var array
   */
  protected $data = array(
    'part'      => 'plugin_z3950'
  );

  /**
   * Installs the plugin. If an error occurs, a qcl_application_plugin_Exception
   * must be thrown.
   * @return void
   * @throws qcl_application_plugin_Exception
   */
  public function install()
  {
    /*
     * check prerequisites
     */
    $error = "";
    if (  ! function_exists("yaz_connect" ) )
    {
      $error = "Plugin needs PHP-YAZ extension. ";
    }

    if ( ! class_exists( "XSLTProcessor" ) )
    {
      $error .= "Plugin needs XSL extension. ";
    }

    qcl_import("qcl_util_system_Executable");
    $xml2bib = new qcl_util_system_Executable( BIBUTILS_PATH . "xml2bib");
    $xml2bib->exec("-v");
    if ( ! strstr( $xml2bib->getStdErr(), "bibutils" ) )
    {
      $this->warn( "Error installing plugin: " . $xml2bib->getStdErr() );
      $error .= "Could not call bibutis through the shell. Please check your setup.";
    }
    if ( $error !== "" )
    {
      throw new qcl_application_plugin_Exception($error);
    }

    $z3950dsModel = z3950_DatasourceModel::getInstance();

    /*
     * register datasource
     */
    qcl_import("z3950_DatasourceModel");
    try
    {
      $z3950dsModel->registerSchema();
    }
    catch( qcl_data_model_RecordExistsException $e) {}
    
    // preferences and permissions
    $app = $this->getApplication();
    $app->addPreference( "z3950.lastDatasource", "z3950_voyager", true );
    $app->addPermission( array(
      "z3950.manage"
    ) );
    foreach( array("admin", "manager" ) as $role )
    {
      $app->giveRolePermission( $role, array(
        "z3950.manage"
      ) );
    }

    // create datasources
    $this->createDatasourcesFromExplainFiles();
  }

  /**
   * Re-installs the plugin.
   * @override
   * @throws qcl_application_plugin_Exception
   * @return void|string Can return a message that will be displayed after reinstallation.
   */
  public function reinstall()
  {
    // TODO: reinstall datasources only.
    parent::reinstall();
  }

  /**
   * Uninstalls the plugin. Throws qcl_application_plugin_Exception if something
   * goes wrong
   * @throws qcl_application_plugin_Exception
   */
  public function uninstall()
  {
    try
    {
      z3950_DatasourceModel::getInstance()->unregisterSchema();
    }
    catch( Exception $e ){}
    // TODO delete datasources
    
    // remove permissions
    $this->getApplication()->removePermission(array(
      "z3950.manage"
    ));
  }

  /**
   * Creates a datasource for each Z39.50 server
   */
  protected function createDatasourcesFromExplainFiles()
  {
    z3950_DatasourceModel::getInstance()->createFromExplainFiles();
  }
}

