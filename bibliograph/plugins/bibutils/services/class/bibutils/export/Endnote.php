<?php
/* ************************************************************************

   Bibliograph: Collaborative Online Reference Management

   http://www.bibliograph.org

   Copyright:
     2007-2010 Christian Boulanger

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Chritian Boulanger (cboulanger)

************************************************************************ */

qcl_import("bibliograph_model_export_AbstractExporter");
qcl_import("bibliograph_model_export_Bibtex");
qcl_import("qcl_util_system_Executable");

/**
 *
 */
class bibutils_export_Endnote
  extends bibliograph_model_export_AbstractExporter
{
  /**
   * The id of the format
   * @var string
   */
  protected $id = "endnote";

  /**
   * The name of the format
   * @var string
   */
  protected $name ="Endnote tagged format";

  /**
   * The type of the format
   * @var string
   */
  protected $type = "bibutils";

  /**
   * The file extension of the format
   * @var string
   */
  protected $extension = "end";

  /**
   * The object that converts the native array format into
   * bibtex
   *
   * @var bibliograph_model_export_Bibtex
   */
  protected $bibtexExporter;

  /**
   * The binary that does the conversion from bibtex to MODS
   * @var qcl_util_system_Executable
   */
  protected $modsExporter;

  /**
   * The binary that does the conversion from MODS to the target format
   * @var qcl_util_system_Executable
   */
  protected $exporter;

  /**
   * Construcotr
   */
  public function __construct()
  {
    $this->bibtexExporter = bibliograph_model_export_Bibtex::getInstance();
    $this->modsExporter   = new qcl_util_system_Executable( BIBUTILS_PATH . "bib2xml");
    $this->exporter       = new qcl_util_system_Executable( BIBUTILS_PATH . "xml2end");
  }

  /**
   * Converts an array of bibliograph record data to the endnote format
   *
   * @param array $data
   *     Reference data
   * @param array|null $exclude
   *     If given, exclude the given fields
   * @return string
   *     Endnote tagged format
   */
  function export( $data, $exclude=array() )
  {
    qcl_assert_array( $data, "Invalid data");
    $bibtex = $this->bibtexExporter->export( $data, $exclude );
    $mods   = $this->modsExporter->call("-nl -i unicode", $bibtex );
    $export = $this->exporter->call("-o unicode",$mods);
    return $export;
  }
}
