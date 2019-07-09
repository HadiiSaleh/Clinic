using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Clinic.Controllers
{
    public class NotificationsController : Controller
    {
        public IActionResult EmailConfirmed (string userId,string code)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            {
                return Redirect("/login");

            }

            return View();
        }

        public IActionResult PassReset(string id, string code)
        {
            if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(code))
            {
                return Redirect("/login");

            }

            return View();
        }
        
    }
}
