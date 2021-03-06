<?php
/*
 * qcl - the qooxdoo component library
 *
 * http://qooxdoo.org/contrib/project/qcl/
 *
 * Copyright:
 *   2007-2015 Christian Boulanger
 *
 * License:
 *   LGPL: http://www.gnu.org/licenses/lgpl.html
 *   EPL: http://www.eclipse.org/org/documents/epl-v10.php
 *   See the LICENSE file in the project's top-level directory for details.
 *
 * Authors:
 *  * Christian Boulanger (cboulanger)
 */

/**
 * Class that generates a "chunked" http response with javascript 
 * script fragments. The output of this method must be loaded into an
 * invisible IFRAME. Each time the ::setProgress method is called,
 * the progress bar on the server is updated. 
 */
class qcl_ui_dialog_ServerProgress
  extends qcl_core_Object
{
  /**
   * The id of the progress widget
   */
  protected $widgetId;

  /**
   * If true, newlines will be inserted into the generated javascript code
   * @var bool
   */
  public $insertNewlines = false;

  /**
   * Constructor
   * @param string $widgetId The id of the progress widget
   */
  function __construct($widgetId)
  {
    $this->widgetId = $widgetId;
    header("Cache-Control: no-cache, must-revalidate");
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Pragma:");
    //header("Transfer-encoding: chunked"); // doesn't work with build version
    flush();
    @apache_setenv('no-gzip', 1);
    @ini_set('output_buffering', 0);
    @ini_set('zlib.output_compression', 0);
    @ini_set('implicit_flush', 1);
    flush();
  }
  
  /**
   * Internal function to send a chunk of data 
   */
  protected function send($chunk)
  {
    // add padding to force Safari and IE to render
    if( strlen($chunk) < 1024)
    {
      $chunk = str_repeat(" ", 1024 - strlen($chunk)) . "\r\n" . $chunk;
    }
    echo sprintf("%x\r\n", strlen($chunk));
    echo $chunk;
    echo "\r\n";
    flush();
    ob_flush();
  }

  /**
   * Returns new line character or empty string depending on insertNewlines property
   * @return string
   */
  protected function getNewlineChar()
  {
    return $this->insertNewlines ? "\n" : "";
  }
  
  /**
   * API function to set the state of the progress par 
   * @param integer $value The valeu of the progress, in percent
   */
  public function setProgress($value, $message=null, $newLogText=null)
  {
    $nl = $this->getNewlineChar();
    $js = '<script type="text/javascript">';
    //$js .= $nl . sprintf('console.log("%d, %s, %s");',$value, $message, $newLogText);
    $js .= $nl . "window.top.qcl.__{$this->widgetId}.set({";
    $js .= $nl . sprintf( 'progress:%d',$value);            
    if( $message )    $js .= sprintf(',message:"%s"', $message);
    if( $newLogText)  $js .= sprintf(',newLogText:"%s"', $newLogText);
    $js .= $nl . '});</script>' . $nl;
    $this->send( $js );
  }

  /**
   * API function to dispatch a client message
   * @param string $name Name of message
   * @param mixed|null $data Message data
   *
   */
  public function dispatchClientMessage($name,$data=null)
  {
    $nl = $this->getNewlineChar();
    $js = '<script type="text/javascript">';
    $js .= $nl . 'window.top.qx.event.message.Bus.getInstance().dispatchByName("' . $name . '",';
    $js .= $nl . json_encode($data);
    $js .= $nl . ');</script>' . $nl;
    $this->send( $js );
  }

  /**
   * API function to trigger an error alert
   * @param string $message
   */
  public function error($message)
  {
    $nl = $this->getNewlineChar();
    $js = '<script type="text/javascript">';
    $js .= $nl . 'window.top.dialog.Dialog.error("' . $message . '");';
    $js .= $nl . "window.top.qcl.__{$this->widgetId}.hide();";
    $js .= $nl . '</script>' . $nl;
    $this->send( $js );
    $this->send("");
    exit;
  }

  /**
   * Must be called on completion of the script
   * @param string|null Optional message that will be shown in an alert dialog
   */
  public function complete($message=null)
  {
    $this->setProgress(100);
    if ( $message )
    {
      $nl = $this->getNewlineChar();
      $js = '<script type="text/javascript">';
      $js .= $nl . 'window.top.dialog.Dialog.alert("' . $message . '");';
      $js .= $nl . '</script>' . $nl;
      $this->send( $js );      
    }
    $this->send("");
    exit(); // necessary to not mess up the http response
  }
}