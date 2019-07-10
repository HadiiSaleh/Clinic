using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clinic.Data;
using Clinic.Email;
using Clinic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Clinic.Controllers
{
    [Route("api/[controller]")]
    public class AdminsController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;

        private IEmailSender _emailsender;

        public AdminsController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IEmailSender emailsender)
        {
            _db = db;
            _userManager = userManager;
            _emailsender = emailsender;
        }

        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetAdmin()
        {
            var findAdmin = _db.Admins.FirstOrDefault(a => a.admin_id == 1);
            
            var findUser = await _userManager.FindByIdAsync("35b94237-2c02-4f7a-8f63-f720a762dca6");

            if (findAdmin != null && findUser != null)
            {
                AdminModel admin = new AdminModel();
                admin.admin_fname = findAdmin.admin_fname;
                admin.admin_mname = findAdmin.admin_mname;
                admin.admin_lname = findAdmin.admin_lname;
                admin.admin_email = findUser.Email;
                admin.admin_phone = findUser.PhoneNumber;
                admin.admin_username = findUser.UserName;
                
                return Ok(new JsonResult(admin));
            }

            else
                return NotFound();   
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> addAdmin([FromBody] AdminModel admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = admin.admin_email,
                UserName = admin.admin_username,
                PhoneNumber = admin.admin_phone,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, admin.admin_password);

            if (result.Succeeded)
            {
                var role = await _userManager.AddToRoleAsync(user, "Admin");

                if (role.Succeeded)
                {
                    //Sending Comfirmation Email

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                    await _emailsender.SendEmailAsync(user.Email, "MyClinic.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");

                    var newAdmin = new Admin
                    {
                        admin_fname = admin.admin_fname,
                        admin_mname = admin.admin_mname,
                        admin_lname = admin.admin_lname
                    };

                    var addAdmin = await _db.Admins.AddAsync(newAdmin);

                    if (addAdmin != null)
                    {

                        await _db.SaveChangesAsync();

                        return Ok(new { AdminId = user.Id, AdminUsername = user.UserName, AdminEmail = user.Email, status = 1, message = "Registration of the admin Succeded" });
                    }
                }
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }

            return BadRequest(new JsonResult(errorList));
        }

        [HttpPut("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> updateAdmin([FromBody] AdminModel admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findAdmin = _db.Admins.FirstOrDefault(a => a.admin_id == 1);

            var findUser = await _userManager.FindByIdAsync("35b94237-2c02-4f7a-8f63-f720a762dca6");

            if (findAdmin == null && findUser == null)
            {
                return NotFound();
            }

            // If the doctor was found
            findAdmin.admin_fname = admin.admin_fname;
            findAdmin.admin_mname = admin.admin_mname;
            findAdmin.admin_lname = admin.admin_lname;

            _db.Entry(findAdmin).State = EntityState.Modified;

            var username = await _userManager.SetUserNameAsync(findUser, admin.admin_username);
            var email = await _userManager.SetEmailAsync(findUser, admin.admin_email);
            var phone = await _userManager.SetPhoneNumberAsync(findUser, admin.admin_phone);

            var updateUser = await _userManager.UpdateAsync(findUser);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Admin is updated"));

        }
    }
}
