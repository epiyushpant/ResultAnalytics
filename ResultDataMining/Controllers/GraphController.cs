using ClassLibrary;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace ResultDataMining.Controllers
{
    public class GraphController : Controller
    {
        // GET: Graph
        public ActionResult Index()
        {
            return View();
        }



        public object ConvertJSON()
        {
            DataTable dt = (DataTable)Session["ExamTable"];
            ATTConvert obj = new ATTConvert();             
            return obj.DataTableToJSONWithJSONNet(dt);
        }

    }
}