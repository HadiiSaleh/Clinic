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
    public class DoctorsController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;

        private IEmailSender _emailsender;

        public DoctorsController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IEmailSender emailsender)
        {
            _db = db;
            _userManager = userManager;
            _emailsender = emailsender;
        }
        
        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAdminPatientRole")]
        public async Task<IActionResult> GetDoctorsAsync()
        {
            if (_db.Doctors.Count() != 0)
            {
                List<DoctorModel> result = new List<DoctorModel>();

                 var findDoctors = _db.Doctors.ToList();

                    foreach (Doctor doctor in findDoctors)
                    {
                    var findUser = await _userManager.FindByIdAsync(doctor.dr_user_id);

                    DoctorModel doctorModel = new DoctorModel();
                    doctorModel.dr_mname = doctor.dr_mname;
                    doctorModel.dr_fname = doctor.dr_fname;
                    doctorModel.dr_lname = doctor.dr_lname;
                    doctorModel.dr_speciality = doctor.dr_speciality;
                    doctorModel.dr_about = doctor.dr_about;
                    doctorModel.dr_address = doctor.dr_address;
                    doctorModel.dr_gender = doctor.dr_gender;
                    doctorModel.dr_email = findUser.Email;
                    doctorModel.dr_phone = findUser.PhoneNumber;
                    doctorModel.dr_username = findUser.UserName;

                    result.Add(doctorModel);
                    }

                    return Ok(new JsonResult(result)); 
            }
             else 
                 return BadRequest(new JsonResult("No Doctors to show"));
    }

        [HttpGet("[action]/{id}")]
        [Authorize(Policy = "RequireAdminDoctorPatientRole")]
        public async Task<IActionResult> GetDoctorById([FromRoute]string id)
        {
            var findUser = await _userManager.FindByIdAsync(id);
           
            var findDoctor = _db.Doctors.FirstOrDefault(d => d.dr_user_id == id);

            if (findDoctor!=null && findUser != null)
            {
                DoctorModel doctor = new DoctorModel();
                doctor.dr_fname = findDoctor.dr_fname;
                doctor.dr_mname = findDoctor.dr_mname;
                doctor.dr_lname = findDoctor.dr_lname;
                doctor.dr_gender = findDoctor.dr_gender;
                doctor.dr_speciality = findDoctor.dr_speciality;
                doctor.dr_address = findDoctor.dr_address;
                doctor.dr_about = findDoctor.dr_about;
                doctor.dr_email = findUser.Email;
                doctor.dr_phone = findUser.PhoneNumber;
                doctor.dr_username = findUser.UserName;
                doctor.dr_password = findUser.PasswordHash;
                doctor.ConfirmPassword = findUser.PasswordHash;
                return Ok(new JsonResult(doctor));
            }
                
            else
                return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddDoctor([FromBody] DoctorModel doctor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = doctor.dr_email,
                UserName = doctor.dr_username,
                PhoneNumber = doctor.dr_phone,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, doctor.dr_password);

            if (result.Succeeded)
            {
                var role=await _userManager.AddToRoleAsync(user, "Doctor");

                if (role.Succeeded)
                {

                    //Sending Comfirmation Email

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    
                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                    await _emailsender.SendEmailAsync(user.Email, "MyClinic.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");
                    
                    var newDoctor = new Doctor
                    {
                        dr_user_id = user.Id,
                        dr_fname = doctor.dr_fname,
                        dr_mname = doctor.dr_mname,
                        dr_lname = doctor.dr_lname,
                        dr_gender = doctor.dr_gender,
                        dr_speciality = doctor.dr_speciality,
                        dr_address = doctor.dr_address,
                        dr_about = doctor.dr_about
                    };

                    var addDoctor = await _db.Doctors.AddAsync(newDoctor);

                    if (addDoctor != null)
                    {

                        await _db.SaveChangesAsync();

                        return Ok(new { DoctorId = user.Id, DoctorUsername = user.UserName, DoctorEmail = user.Email, status = 1, message = "Registration of doctor " + doctor.dr_fname + " Succeded" });

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
        [Authorize(Policy = "RequireAdminDoctorRole")]
        public async Task<IActionResult> UpdateDoctor([FromRoute] string id, [FromBody] DoctorModel doctor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findDoctor = _db.Doctors.FirstOrDefault(d => d.dr_user_id == id);

            var findUser = await _userManager.FindByIdAsync(id);

            if (findDoctor == null && findUser == null)
            {
                return NotFound();
            }

            // If the doctor was found
            findDoctor.dr_fname = doctor.dr_fname;
            findDoctor.dr_mname = doctor.dr_mname;
            findDoctor.dr_lname = doctor.dr_lname;
            findDoctor.dr_gender = doctor.dr_gender;
            findDoctor.dr_speciality = doctor.dr_speciality;
            findDoctor.dr_address = doctor.dr_address;
            findDoctor.dr_about = doctor.dr_about;

            _db.Entry(findDoctor).State = EntityState.Modified;

            var username = await _userManager.SetUserNameAsync(findUser, doctor.dr_username);
            var email = await _userManager.SetEmailAsync(findUser, doctor.dr_email);
            var phone = await _userManager.SetPhoneNumberAsync(findUser, doctor.dr_phone);
            
            var updateUser = await _userManager.UpdateAsync(findUser);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Doctor with id " + id + " and name "+findDoctor.dr_fname+" " + findDoctor.dr_mname + " " + findDoctor.dr_lname + " is updated"));

        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteDoctor([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find doctor's account
            var finduser = await _userManager.FindByIdAsync(id);

            if (finduser == null) return NotFound();
            //delete doctor's account
            var deleteuser = await _userManager.DeleteAsync(finduser);

            if (deleteuser.Succeeded)
            {
                //find doctor
                var findDoctor = _db.Doctors.FirstOrDefault(d => d.dr_user_id == id);

                if (findDoctor != null)
                {
                    _db.Doctors.Remove(findDoctor);

                    await _db.SaveChangesAsync();
                }

                return Ok(new JsonResult("The Doctor with username " + finduser.UserName + " is Deleted"));
            }
            return BadRequest("Delete Failed!");
        }

    }
}
