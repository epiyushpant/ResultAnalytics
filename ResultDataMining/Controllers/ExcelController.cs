using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using ClosedXML.Excel;

namespace ResultDataMining.Controllers
{
    public class ExcelController : Controller
    {
        // GET: Excel
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult UploadExcel()
        {
            return View();
        }

        public ActionResult GetExcel()
        {
            DataTable dt = (DataTable)Session["ExamTable"];
            return View(dt);
        }



        [HttpPost]
        public ActionResult UploadExcel(HttpPostedFileBase file)
        {
            DataTable dt = new DataTable();
            //Checking file content length and Extension must be .xlsx
            if (file != null && file.ContentLength > 0 && System.IO.Path.GetExtension(file.FileName).ToLower() == ".xlsx")
            {
                string path = Path.Combine(Server.MapPath("~/UploadFile"), Path.GetFileName(file.FileName));
                //Saving the file
                file.SaveAs(path);
                //Started reading the Excel file.
                using (XLWorkbook workbook = new XLWorkbook(path))
                {
                    IXLWorksheet worksheet = workbook.Worksheet(1);
                    bool FirstRow = true;
                    //Range for reading the cells based on the last cell used.
                    string readRange = "1:1";
                    foreach (IXLRow row in worksheet.RowsUsed())
                    {
                        //If Reading the First Row (used) then add them as column name
                        if (FirstRow)
                        {
                            //Checking the Last cellused for column generation in datatable
                            readRange = string.Format("{0}:{1}", 1, row.LastCellUsed().Address.ColumnNumber);
                            foreach (IXLCell cell in row.Cells(readRange))
                            {
                                dt.Columns.Add(cell.Value.ToString());
                            }
                            FirstRow = false;
                        }
                        else
                        {
                            //Adding a Row in datatable
                            dt.Rows.Add();
                            int cellIndex = 0;
                            //Updating the values of datatable
                            foreach (IXLCell cell in row.Cells(readRange))
                            {
                                dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
                                cellIndex++;
                            }
                        }
                    }
                    //If no data in Excel file
                    if (FirstRow)
                    {
                        ViewBag.Message = "Empty Excel File!";
                    }
                    Session.Add("ExamTable", dt);
                }
            }
            else
            {
                //If file extension of the uploaded file is different then .xlsx
                ViewBag.Message = "Please select file with .xlsx extension!";
            }
            return View(dt);
        }
    }
}