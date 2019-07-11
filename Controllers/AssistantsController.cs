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
    public class AssistantsController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;

        private IEmailSender _emailsender;

        public AssistantsController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IEmailSender emailsender)
        {
            _db = db;
            _userManager = userManager;
            _emailsender = emailsender;
        }

        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetAssistantsAsync()
        {
            if (_db.Assistants.Count() != 0)
            {
                List<AssistantModel> result = new List<AssistantModel>();

                var findAssistants = _db.Assistants.ToList();

                foreach (Assistant assistant in findAssistants)
                {
                    var findUser = await _userManager.FindByIdAsync(assistant.as_user_id);

                    AssistantModel assistantModel = new AssistantModel();
                    assistantModel.as_user_id = assistant.as_user_id;
                    assistantModel.as_mname = assistant.as_mname;
                    assistantModel.as_fname = assistant.as_fname;
                    assistantModel.as_lname = assistant.as_lname;
                    assistantModel.as_dr_id = assistant.as_dr_id;
                    assistantModel.as_email = findUser.Email;
                    assistantModel.as_phone = findUser.PhoneNumber;
                    assistantModel.as_username = findUser.UserName;

                    result.Add(assistantModel);
                }

                return Ok(result);
            }
            else
                return BadRequest(new JsonResult("No Assistants to show"));
        }

        [HttpGet("[action]/{id}")]
        [Authorize(Policy = "RequireAdminAssistantPatientRole")]
        public async Task<IActionResult> GetAssistantById([FromRoute]string id)
        {
            var findUser = await _userManager.FindByIdAsync(id);

            var findAssistant = _db.Assistants.FirstOrDefault(d => d.as_user_id == id);

            if (findAssistant != null && findUser != null)
            {
                AssistantModel assistant = new AssistantModel();
                assistant.as_fname = findAssistant.as_fname;
                assistant.as_mname = findAssistant.as_mname;
                assistant.as_lname = findAssistant.as_lname;
                assistant.as_dr_id = findAssistant.as_dr_id;
                assistant.as_email = findUser.Email;
                assistant.as_phone = findUser.PhoneNumber;
                assistant.as_username = findUser.UserName;
                assistant.as_password = findUser.PasswordHash;
                assistant.ConfirmPassword = findUser.PasswordHash;
                return Ok(new JsonResult(assistant));
            }

            else
                return NotFound();
        }

        [HttpGet("[action]/{username}")]
        [Authorize(Policy = "RequireAdminAssistantPatientRole")]
        public async Task<IActionResult> GetDoctorByUsername([FromRoute]string username)
        {
            var findUser = await _userManager.FindByNameAsync(username);

            var findAssistant = _db.Assistants.FirstOrDefault(a => a.as_user_id == findUser.Id);

            if (findAssistant != null && findUser != null)
            {
                var findDoctor = _db.Doctors.FirstOrDefault(d => d.dr_id == findAssistant.as_dr_id);

                if (findDoctor != null && findUser != null)
                {
                    DoctorModel doctor = new DoctorModel();
                    doctor.dr_id = findDoctor.dr_id;
                    doctor.dr_user_id = findDoctor.dr_user_id;
                    doctor.dr_fname = findDoctor.dr_fname;
                    doctor.dr_mname = findDoctor.dr_mname;
                    doctor.dr_lname = findDoctor.dr_lname;
                    doctor.dr_gender = findDoctor.dr_gender;
                    doctor.dr_speciality = findDoctor.dr_speciality;
                    doctor.dr_address = findDoctor.dr_address;
                    doctor.dr_about = findDoctor.dr_about;

                    return Ok(doctor);
                }
                return NotFound();
            }

            else
                return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddAssistant([FromBody] AssistantModel assistant)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = assistant.as_email,
                UserName = assistant.as_username,
                PhoneNumber = assistant.as_phone,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, assistant.as_password);

            if (result.Succeeded)
            {
                var role = await _userManager.AddToRoleAsync(user, "Assistant");

                if (role.Succeeded)
                {
                    //Sending Comfirmation Email

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                    await _emailsender.SendEmailAsync(user.Email, "MyClinic.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");

                    var newAssistant = new Assistant
                    {
                        as_user_id = user.Id,
                        as_fname = assistant.as_fname,
                        as_mname = assistant.as_mname,
                        as_lname = assistant.as_lname,
                        as_dr_id = assistant.as_dr_id
                    };

                    var addAssistant = await _db.Assistants.AddAsync(newAssistant);
                    if (addAssistant != null)
                    {
                        await _db.SaveChangesAsync();

                        return Ok(new { AssistantId = user.Id, AssistantUsername = user.UserName, AssistantEmail = user.Email, status = 1, message = "Registration of assistant " + assistant.as_fname + " Succeded" });
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

        [HttpPut("[action]/{id}")]
        [Authorize(Policy = "RequireAdminAssistantRole")]
        public async Task<IActionResult> UpdateAssistant([FromRoute] string id, [FromBody] AssistantModel assistant)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var findAssistant = _db.Assistants.FirstOrDefault(d => d.as_user_id == id);

            var findUser = await _userManager.FindByIdAsync(id);

            if (findAssistant == null && findUser == null)
            {
                return NotFound();
            }

            // If the assistant was found
            findAssistant.as_fname = assistant.as_fname;
            findAssistant.as_mname = assistant.as_mname;
            findAssistant.as_lname = assistant.as_lname;
            findAssistant.as_dr_id = assistant.as_dr_id;

            _db.Entry(findAssistant).State = EntityState.Modified;

            var username = await _userManager.SetUserNameAsync(findUser, assistant.as_username);
            var email = await _userManager.SetEmailAsync(findUser, assistant.as_email);
            var phone = await _userManager.SetPhoneNumberAsync(findUser, assistant.as_phone);

            var updateUser = await _userManager.UpdateAsync(findUser);

            if (updateUser.Succeeded)
            {
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Assistant with id " + id + " and name " + findAssistant.as_fname + " " + findAssistant.as_mname + " " + findAssistant.as_lname + " is updated"));
            }

            else
            {
                foreach (var error in updateUser.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }

            return BadRequest(new JsonResult(errorList));
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteAssistant([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find assistant's account
            var finduser = await _userManager.FindByIdAsync(id);
            //delete assistant's account
            var deleteuser = await _userManager.DeleteAsync(finduser);

            if (deleteuser.Succeeded)
            {
                //find assistant
                var findAssistant = _db.Assistants.FirstOrDefault(d => d.as_user_id == id);

                if (findAssistant != null)
                {
                    _db.Assistants.Remove(findAssistant);

                    await _db.SaveChangesAsync();
                }

                return Ok(new JsonResult("The Assistant with username " + finduser.UserName + " is Deleted"));
            }
            return BadRequest(new JsonResult("can't delete the assistant"));
        }
    }
}
