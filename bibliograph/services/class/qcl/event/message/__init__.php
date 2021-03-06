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

/*
 * the message lifetime in seconds
 */
if ( ! defined("QCL_EVENT_MESSAGE_LIFETIME") )
{
  define( "QCL_EVENT_MESSAGE_LIFETIME" , 60 );
}

/*
 * The interval in milliseconds in which the client polls for messages and events
 */
if ( ! defined("QCL_EVENT_MESSAGE_POLLING_INTERVAL") )
{
  define( "QCL_EVENT_MESSAGE_POLLING_INTERVAL" , 10000 );
}

/*
 * The delay that is added per session, in milliseconds
 */
if ( ! defined("QCL_EVENT_MESSAGE_POLLING_DELAYPERSESSION") )
{
  define( "QCL_EVENT_MESSAGE_POLLING_DELAYPERSESSION" , 100 );
}

/*
 * log filters
 */
define( "QCL_LOG_MESSAGE", "message" );
qcl_log_Logger::getInstance()->registerFilter( QCL_LOG_MESSAGE, "Message system-related log messages", false);