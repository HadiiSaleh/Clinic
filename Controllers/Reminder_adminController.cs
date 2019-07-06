using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Clinic.Data;
using Clinic.Models;

namespace Clinic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Reminder_adminController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public Reminder_adminController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/Reminder_admin
        [HttpGet]
        public IActionResult GetReminder_Admins()
        {
            if (_db.Reminder_Admins.Count() != 0)
                return Ok(_db.Reminder_Admins.ToList());

            return BadRequest(new JsonResult("No Reminders to show"));
        }

        // GET: api/Reminder_admin/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReminder_admin(int id)
        {
            var reminder_admin = await _db.Reminder_Admins.FindAsync(id);

            if (reminder_admin == null)
            {
                return NotFound();
            }

            return Ok(reminder_admin);
        }

        // POST: api/Reminder_admin
        [HttpPost]
        public async Task<ActionResult<Reminder_admin>> PostReminder_admin(Reminder_admin reminder_admin)
        {
            _db.Reminder_Admins.Add(reminder_admin);
            await _db.SaveChangesAsync();

            return Ok(new { id = reminder_admin.reminder_id });
        }

        // DELETE: api/Reminder_admin/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reminder_admin>> DeleteReminder_admin(int id)
        {
            var reminder_admin = await _db.Reminder_Admins.FindAsync(id);
            if (reminder_admin == null)
            {
                return NotFound();
            }

            _db.Reminder_Admins.Remove(reminder_admin);
            await _db.SaveChangesAsync();

            return Ok("Deleted Successfully");
        }
    }
}
