using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clinic.Data;
using Clinic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Clinic.Controllers
{
    [Route("api/[controller]")]
    public class DatesController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;
        public DatesController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAssistantRole")]
        public IActionResult GetDates()
        {
            if (_db.Dates.Count() != 0)
            {
                List<DateModel> result = new List<DateModel>();
                var findDate = _db.Dates.ToList();

                foreach (Date date in findDate)
                {
                    var findDoctor = _db.Doctors.FirstOrDefault(d => d.dr_id == date.date_dr_id);

                    var findPatient = _db.Patients.FirstOrDefault(p => p.pat_id == date.date_pat_id);

                    DateModel dateModel = new DateModel();
                    dateModel.date_id = date.date_id;
                    dateModel.date_pat_id = date.date_pat_id;
                    dateModel.date_dr_id = date.date_dr_id;
                    dateModel.date_dateTime = date.date_dateTime;
                    dateModel.dr_name = findDoctor.dr_fname+" "+ findDoctor.dr_mname+" "+ findDoctor.dr_lname;
                    dateModel.pat_name = findPatient.pat_fname+" "+ findPatient.pat_mname+" "+ findPatient.pat_lname;

                    result.Add(dateModel);

                }
                return Ok(result);
            }

            else
                return BadRequest(new JsonResult("No Dates to show"));
        }

        [HttpGet("[action]/{id}")]
        [Authorize(Policy = "RequireAssistantRole")]
        public IActionResult GetDateById([FromRoute]int id)
        {
            var findDate = _db.Dates.FirstOrDefault(c => c.date_id == id);

            if (findDate != null)
            {
                DateModel date = new DateModel();
                date.date_dr_id = findDate.date_dr_id;
                date.date_pat_id = findDate.date_pat_id;
                date.date_dateTime = findDate.date_dateTime;

                return Ok(new JsonResult(date));
            }

            else
                return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAssistantRole")]
        public async Task<IActionResult> AddDate([FromBody] DateModel date)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string id = _userManager.GetUserId(HttpContext.User);

            var findAssistant = _db.Assistants.FirstOrDefault(a => a.as_user_id == id);

            var newDate = new Date
            {
                date_dateTime=date.date_dateTime,
                date_dr_id=date.date_dr_id,
                date_pat_id=date.date_pat_id
            };

            var addDate = await _db.Dates.AddAsync(newDate);

            if (addDate != null)
            {
                await _db.SaveChangesAsync();

                return Ok(new { DateId = newDate.date_id, Doctorid = newDate.date_dr_id, Patientid = newDate.date_pat_id, status = 1, message = "Registration of date Succeded on " + newDate.date_dateTime });
            }
            return BadRequest(new JsonResult("Can't add this date"));
        }

        [HttpPut("[action]/{id}")]
        [Authorize(Policy = "RequireAssistantRole")]
        public async Task<IActionResult> UpdateDate([FromRoute] int id, [FromBody] DateModel date)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findDate = _db.Dates.FirstOrDefault(d => d.date_id == id);

            if (findDate == null)
            {
                return NotFound();
            }

            // If the date was found
            findDate.date_dateTime = date.date_dateTime;
            findDate.date_pat_id = date.date_pat_id;

            _db.Entry(findDate).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Date with id " + id + " is updated"));

        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireAssistantRole")]
        public async Task<IActionResult> DeleteDate([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find date
            var findDate = _db.Dates.FirstOrDefault(c => c.date_id == id);

            if (findDate != null)
            {
                _db.Dates.Remove(findDate);

                await _db.SaveChangesAsync();
                return Ok(new JsonResult("The Date with id " + findDate.date_id + " is Deleted"));
            }

            return BadRequest(new JsonResult("Can't delete this date"));
        }
    }
}
