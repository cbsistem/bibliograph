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

qcl_import( "qcl_ui_dialog_Dialog" );

class qcl_ui_dialog_Alert
  extends qcl_ui_dialog_Dialog
{

  /**
   * Returns a message to the client which prompts the user with an alert message
   * @param string $message The message text
   * @param string $callbackService Optional service that will be called when the user clicks on the OK button
   * @param string $callbackMethod Optional service method
   * @param array $callbackParams Optional service params
   * @return \qcl_ui_dialog_Alert
   */
  function __construct( $message, $callbackService=null, $callbackMethod=null, $callbackParams=null )
  {
    $this->dispatchDialogMessage( array(
     'type' => "alert",
     'properties' => array(
        'message' => $message
      ),
     'service' => $callbackService,
     'method'  => $callbackMethod,
     'params'  => $callbackParams
    ));
  }
}
