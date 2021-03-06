<?php
/*
 * qcl - the qooxdoo component library
 *
 * http://qooxdoo.org/contrib/project/qcl/
 *
 * Copyright:
 *   2007-2010 Christian Boulanger
 *
 * License:
 *   LGPL: http://www.gnu.org/licenses/lgpl.html
 *   EPL: http://www.eclipse.org/org/documents/epl-v10.php
 *   See the LICENSE file in the project's top-level directory for details.
 *
 * Authors:
 *  * Christian Boulanger (cboulanger)
 */
 
qcl_import( "qcl_core_Object" );

/**
 * Abstract class for objects which do database queries
 * implemented by subclasses with specific database adapters.
 * @todo
 *    - add abtract methods or create interface for all required methods
 *    - sort methods around db objects (database, table, column, index, ...)
 */
abstract class qcl_data_db_adapter_Abstract
  extends qcl_core_Object
{
  /**
   * @var object database handler
   */
  protected $db;

  /**
   * @var string $dsn database dsn, gets read from configuration file
   */
  protected $dsn;

  /**
   * @var string $type type of database system (mysql, postgres, ...) read from dsn
   */
  protected $type;

  /**
   * The user accessing the database
   * @var string
   */
  protected $user;

  /**
   * The password needed to access the server
   */
  protected $password;

  /**
   * An array of optional data for the connection
   */
  protected $options = array();
  
  
  /**
   * Static methods to create an adapter according to DSN
   * @param string $dsn
   * @return qcl_data_adapter_Abstract Adapter subclass instance configured for DSN
   */
  static public function createAdapter( $dsn )
  {
    $props = self::extractDsnProperties( $dsn );
    $clazz = "qcl_data_db_adapter_Pdo" . ucfirst( $props['type'] );
    qcl_import($clazz);
    return new $clazz( $dsn );
  }

  /**
   * Constructor. Initializes adapter.
   * @param string $dsn
   * @param string $user
   * @param string $pass
   * @param string|null $options Optional options to pass to the driver
   * @throws PDOException
   * @return \qcl_data_db_adapter_Abstract
   */
  function __construct( $dsn, $user=null, $pass=null, $options=null )
  {

    /*
     * initialize parent class
     */
    parent::__construct();

    /*
     * set properties
     */
    $this->setDsn( $dsn );
    $this->setUser( $user );
    $this->setPassword( $pass );

    $defaultOptions = $this->getDefaultOptions();
    $options = $options ? array_merge( $defaultOptions, $options ) : $defaultOptions;
    $this->setOptions( $options );

    /*
     * set properties from dsn
     */
    $this->set( self::extractDsnProperties( $dsn ) );

    /*
     * connect to the database, will throw if unsuccessful
     */
    $this->connect();
  }

  //-------------------------------------------------------------
  // accessors
  //-------------------------------------------------------------

  /**
   * Getter for database handler object
   * @return PDO
   */
  public function db()
  {
    return $this->db;
  }

  /**
   * Getter for DSN
   * @return string
   */
  public function getDsn()
  {
    return $this->dsn;
  }

  /**
   * sets the dsn for this database
   * @param $dsn
   * @internal param \dsn $string
   * @return void
   */
  public function setDsn($dsn)
  {
    $this->dsn = $dsn;
  }

  /**
   * Returns database type, such as "mysql"
   * return string
   */
  public function getType()
  {
    return $this->type;
  }

  /**
   * Setter for type
   * return void
   */
  public function setType( $type )
  {
    $this->type = $type;
  }

  /**
   * Getter for database user
   * return string
   */
  public function getUser()
  {
    return $this->user;
  }

  /**
   * Setter for database user
   * return void
   */
  public function setUser( $user )
  {
    $this->user = $user;
  }

  /**
   * Getter for database user
   * return string
   */
  protected function getPassword()
  {
    return $this->password;
  }

  /**
   * Setter for database user
   * @param string $password
   * return void
   */
  public function setPassword( $password )
  {
    $this->password = $password;
  }

  /**
   * Getter for options
   * return void
   */
  public function getOptions()
  {
    return $this->options;
  }

  /**
   * Setter for options
   * return void
   */
  public function setOptions( $options )
  {
    $this->options = $options;
  }


  /**
   * Disconnects from database
   * @return void
   */
  public function disconnect()
  {
    $this->db = null;
  }

  /**
   * Returns the default options for initiating a PDO connection
   * @throws qcl_core_NotImplementedException
   * @return array
   */
  public function getDefaultOptions()
  {
    throw new qcl_core_NotImplementedException(__METHOD__);
  }

  /**
   * Extracts the values contained in the dsn into an associated array of
   * key-value pairs that can be set as  properties of this object.
   * @param $dsn
   * @return array
   */
  public static function extractDsnProperties( $dsn )
  {
    $dsn = new String( $dsn );
    $dsnprops = array();

    /*
     * the type is the string before the first ":"
     */
    $type = (string) $dsn->substr( 0, $dsn->indexOf(":") );

    /*
     * analyse the rest of the string by splitting it along first
     * the ";" and then the "="
     */
    $rest = explode(";", (string) $dsn->substr( $dsn->indexOf(":") +1 ) );
    foreach( $rest as $part )
    {
      $value = explode("=",$part);
      $dsnprops[trim($value[0])] = trim($value[1]);
    }

    return array(
      'type'     => $type,
      'host'     => either($dsnprops['host'],"localhost"),
      'port'     => either($dsnprops['port'], 3306),
      'database' => $dsnprops['dbname']
    );
  }


  /**
   * internal log function
   * @param string $msg The message to log
   */
  public function log( $msg )
  {
    if ( $this->getLogger()->isFilterEnabled( QCL_LOG_DB ) )
    {
      parent::log( $msg, QCL_LOG_DB );
    }
  }
  
}