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

qcl_import( "bibliograph_model_AbstractDatasourceModel" );

/**
 * model for bibliograph datasources based on an sql database
 */
class bibliograph_model_BibliographicDatasourceModel
  extends bibliograph_model_AbstractDatasourceModel
{

  /**
   * The name of the datasource schema
   * @var string
   */
  protected $schemaName = "bibliograph.schema.bibliograph2";

  /**
   * The description of the datasource schema
   * @var string
   */
  protected $description =
    "The schema of Bibliograph 2.0 datasources";


 /**
   * The model properties
   */
  private $properties = array(
    'schema' => array(
      'nullable'  => false,
      'init'      => "bibliograph.schema.bibliograph2"
    )
  );

  /**
   * Constructor, overrides some properties
   */
  function __construct()
  {
    parent::__construct();
    $this->addProperties( $this->properties );
  }

  /**
   * Returns singleton instance of this class.
   * @return bibliograph_model_BibliographicDatasourceModel
   */
  public static function getInstance()
  {
    return qcl_getInstance( __CLASS__ );
  }

  /**
   * @todo
   * @return string
   */
  public function getTableModelType()
  {
    return "reference";
  }

  /**
   * Initialize the datasource, registers the models
   */
  public function init()
  {
    if ( parent::init() )
    {
      $this->registerModels( array(
        'reference'   => array(
          'model' => array(
            'class'   => "bibliograph_model_ReferenceModel"
          ),
          'controller' => array(
            'service' => "bibliograph.reference"
          )
        ),
        'folder'  => array(
          'model'    => array(
            'class'    => "bibliograph_model_FolderModel"
          ),
          'controller' => array(
            'service' => "bibliograph.folder"
          )
        )
      ) );
    }
  }
}
