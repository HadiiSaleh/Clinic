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
    public class PatientsController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;

        private IEmailSender _emailsender;

        public PatientsController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IEmailSender emailsender)
        {
            _db = db;
            _userManager = userManager;
            _emailsender = emailsender;
        }

        [HttpGet("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]
        public async Task<IActionResult> GetPatientsAsync()
        {
            if (_db.Patients.Count() != 0)
            {
                List<PatientModel> result = new List<PatientModel>();

                var findPatients = _db.Patients.ToList();

                foreach (Patient patient in findPatients)
                {
                    var findUser = await _userManager.FindByIdAsync(patient.pat_user_id);

                    PatientModel patientModel = new PatientModel();
                    patientModel.pat_mname = patient.pat_mname;
                    patientModel.pat_fname = patient.pat_fname;
                    patientModel.pat_lname = patient.pat_lname;
                    patientModel.pat_address = patient.pat_address;
                    patientModel.pat_birthday = patient.pat_birthday;
                    patientModel.pat_blood_type = patient.pat_blood_type;
                    patientModel.pat_gender = patient.pat_gender;
                    patientModel.pat_insurance_company_name = patient.pat_insurance_company_name;
                    patientModel.pat_picture = patient.pat_picture;
                    patientModel.pat_email = findUser.Email;
                    patientModel.pat_phone = findUser.PhoneNumber;
                    patientModel.pat_username = findUser.UserName;

                    result.Add(patientModel);
                }

                return Ok(new JsonResult(result));
            }
            else
                return BadRequest(new JsonResult("No Assistants to show"));
        }

        [HttpGet("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]
        public async Task<IActionResult> GetPatientById([FromRoute]string id)
        {
            var findUser = await _userManager.FindByIdAsync(id);

            var findPatient = _db.Patients.FirstOrDefault(d => d.pat_user_id == id);

            if (findPatient != null && findUser != null)
            {
                PatientModel patient = new PatientModel();
                patient.pat_fname = findPatient.pat_fname;
                patient.pat_mname = findPatient.pat_mname;
                patient.pat_lname = findPatient.pat_lname;
                patient.pat_gender = findPatient.pat_gender;
                patient.pat_picture = findPatient.pat_picture;
                patient.pat_address = findPatient.pat_address;
                patient.pat_blood_type = findPatient.pat_blood_type;
                patient.pat_insurance_company_name = findPatient.pat_insurance_company_name;
                patient.pat_birthday = findPatient.pat_birthday;
                patient.pat_email = findUser.Email;
                patient.pat_phone = findUser.PhoneNumber;
                patient.pat_username = findUser.UserName;
                patient.pat_password = findUser.PasswordHash;
                patient.ConfirmPassword = findUser.PasswordHash;
                return Ok(new JsonResult(patient));
            }

            else
                return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminDoctorPatientRole")]
        public async Task<IActionResult> AddPatient([FromBody] PatientModel patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = patient.pat_email,
                UserName = patient.pat_username,
                PhoneNumber = patient.pat_phone,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, patient.pat_password);

            if (result.Succeeded)
            {
                var role = await _userManager.AddToRoleAsync(user, "Patient");

                if (role.Succeeded)
                {
                    //Sending Comfirmation Email

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                    await _emailsender.SendEmailAsync(user.Email, "MyClinic.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");
                }

                    var newPatient = new Patient
                    {
                        pat_user_id = user.Id,
                        pat_fname = patient.pat_fname,
                        pat_mname = patient.pat_mname,
                        pat_lname = patient.pat_lname,
                        pat_gender = patient.pat_gender,
                        pat_birthday = patient.pat_birthday,
                        pat_address = patient.pat_address,
                        pat_insurance_company_name = patient.pat_insurance_company_name,
                        pat_blood_type = patient.pat_blood_type,
                        pat_picture = patient.pat_picture
                    };

                    var addPatient = await _db.Patients.AddAsync(newPatient);

                    if (addPatient != null)
                    {
                        await _db.SaveChangesAsync();

                        return Ok(new { PatientId = user.Id, PatientUsername = user.UserName, PatientEmail = user.Email, status = 1, message = "Registration of patient " + patient.pat_fname + " Succeded" });
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
        [Authorize(Policy = "RequireAdminDoctorAssistantPatientRole")]
        public async Task<IActionResult> UpdatePatient([FromRoute] string id, [FromBody] PatientModel patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.Patients.FirstOrDefault(d => d.pat_user_id == id);

            var findUser = await _userManager.FindByIdAsync(id);

            if (findPatient == null && findUser == null)
            {
                return NotFound();
            }

            // If the patient was found
            findPatient.pat_fname = patient.pat_fname;
            findPatient.pat_mname = patient.pat_mname;
            findPatient.pat_lname = patient.pat_lname;
            findPatient.pat_gender = patient.pat_gender;
            findPatient.pat_address = patient.pat_address;
            findPatient.pat_birthday = patient.pat_birthday;
            findPatient.pat_blood_type = patient.pat_blood_type;
            findPatient.pat_insurance_company_name = patient.pat_insurance_company_name;
            findPatient.pat_picture = patient.pat_picture;

            _db.Entry(findPatient).State = EntityState.Modified;

            var username = await _userManager.SetUserNameAsync(findUser, patient.pat_username);
            var email = await _userManager.SetEmailAsync(findUser, patient.pat_email);
            var phone = await _userManager.SetPhoneNumberAsync(findUser, patient.pat_phone);

            var updateUser = await _userManager.UpdateAsync(findUser);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Patient with id " + id + " and name " + findPatient.pat_fname + " " + findPatient.pat_mname + " " + findPatient.pat_lname + " is updated"));

        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireAdminDoctorAssistantRole")]
        public async Task<IActionResult> DeletePatient([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find patient's account
            var finduser = await _userManager.FindByIdAsync(id);
            //delete patient's account
            var deleteuser = await _userManager.DeleteAsync(finduser);

            if (deleteuser.Succeeded)
            {
                //find patient
                var findPatient = _db.Patients.FirstOrDefault(d => d.pat_user_id == id);

                if (findPatient != null)
                {
                    _db.Patients.Remove(findPatient);

                    await _db.SaveChangesAsync();
                }

                return Ok(new JsonResult("The Patient with username " + finduser.UserName + " is Deleted"));
            }
            return BadRequest(new JsonResult("can't delete the patient"));
        }
    }
}
