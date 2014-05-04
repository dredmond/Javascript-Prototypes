using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace UnitCommand.Controllers
{
    public class UnitLogicController : ApiController
    {
        [HttpGet]
        public string TestController(string testVar)
        {
            return "Test Successful: " + testVar;
        }
    }
}
