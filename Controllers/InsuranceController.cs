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
    public class InsuranceController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;

        private IEmailSender _emailsender;

        public InsuranceController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IEmailSender emailsender)
        {
            _db = db;
            _userManager = userManager;
            _emailsender = emailsender;
        }

        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetInsurance_companiesAsync()
        {
            if (_db.Insurance_Companies.Count() != 0)
            {
                List<Insurance_companyModel> result = new List<Insurance_companyModel>();

                var findInsurance_companies = _db.Insurance_Companies.ToList();

                foreach (Insurance_company ins in findInsurance_companies)
                {
                    var findUser = await _userManager.FindByIdAsync(ins.ins_user_id);

                    Insurance_companyModel insModel = new Insurance_companyModel();
                    insModel.cid = ins.ins_user_id;
                    insModel.ins_name = ins.ins_name;
                    insModel.ins_address = ins.ins_address;
                    insModel.ins_fax = ins.ins_fax;
                    insModel.ins_email = findUser.Email;
                    insModel.ins_phone = findUser.PhoneNumber;
                    insModel.ins_username = findUser.UserName;

                    result.Add(insModel);
                }

                return Ok(result);
            }
            else
                return BadRequest(new JsonResult("No insurance companies to show"));
        }

        [HttpGet("[action]/{id}")]
        [Authorize(Policy = "RequireAdminInsuranceRole")]
        public async Task<IActionResult> GetInsurance_companyById([FromRoute]string id)
        {
            var findUser = await _userManager.FindByIdAsync(id);

            var findInsurance_company = _db.Insurance_Companies.FirstOrDefault(d => d.ins_user_id == id);

            if (findInsurance_company != null && findUser != null)
            {
                Insurance_companyModel insurance_company = new Insurance_companyModel();
                insurance_company.cid = findInsurance_company.ins_user_id;
                insurance_company.ins_name = findInsurance_company.ins_name;
                insurance_company.ins_address = findInsurance_company.ins_address;
                insurance_company.ins_fax = findInsurance_company.ins_fax;
                insurance_company.ins_email = findUser.Email;
                insurance_company.ins_phone = findUser.PhoneNumber;
                insurance_company.ins_username = findUser.UserName;
                insurance_company.ins_password = findUser.PasswordHash;
                insurance_company.ConfirmPassword = findUser.PasswordHash;
                return Ok(new JsonResult(insurance_company));
            }

            else
                return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddInsurance_company([FromBody] Insurance_companyModel insurance_company)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = insurance_company.ins_email,
                UserName = insurance_company.ins_username,
                PhoneNumber = insurance_company.ins_phone,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, insurance_company.ins_password);

            if (result.Succeeded)
            {
                var role = await _userManager.AddToRoleAsync(user, "Insurance_company");

                if (role.Succeeded)
                {
                    //Sending Comfirmation Email

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol: HttpContext.Request.Scheme);

                    await _emailsender.SendEmailAsync(user.Email, "MyClinic.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");

                    var newInsurance_company = new Insurance_company
                    {
                        ins_user_id = user.Id,
                        ins_name = insurance_company.ins_name,
                        ins_fax = insurance_company.ins_fax,
                        ins_address = insurance_company.ins_address
                    };
            

                    var addInsurance_company = await _db.Insurance_Companies.AddAsync(newInsurance_company);
                    if (addInsurance_company != null)
                    {
                        await _db.SaveChangesAsync();

                        return Ok(new { Insurance_companyId = user.Id, Insurance_companyUsername = user.UserName, Insurance_companyEmail = user.Email, status = 1, message = "Registration of insurance_company " + insurance_company.ins_name + " Succeded" });
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
        [Authorize(Policy = "RequireAdminAssistantInsuranceRole")]
        public async Task<IActionResult> UpdateInsurance_company([FromRoute] string id, [FromBody] Insurance_companyModel insurance_company)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var findInsurance_company = _db.Insurance_Companies.FirstOrDefault(d => d.ins_user_id == id);
            

            var findUser = await _userManager.FindByIdAsync(id);

            if (findInsurance_company == null && findUser == null)
            {
                return NotFound();
            }

            // If the insurance_company was found
            findInsurance_company.ins_name = insurance_company.ins_name;
            findInsurance_company.ins_fax = insurance_company.ins_fax;
            findInsurance_company.ins_address = insurance_company.ins_address;

            var updateCompany = _db.Entry(findInsurance_company).State = EntityState.Modified;

            var username = await _userManager.SetUserNameAsync(findUser, insurance_company.ins_username);
            var email = await _userManager.SetEmailAsync(findUser, insurance_company.ins_email);
            var phone = await _userManager.SetPhoneNumberAsync(findUser, insurance_company.ins_phone);

            var updateUser = await _userManager.UpdateAsync(findUser);

            if (updateUser.Succeeded)
            {
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Insurance_company with id " + id + " and name " + findInsurance_company.ins_name + " is updated"));
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
        public async Task<IActionResult> DeleteInsurance_company([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findInsurance_company = _db.Insurance_Companies.FirstOrDefault(d => d.ins_user_id == id);

            if (findInsurance_company != null)
            {
            //find insurance_company's account
            var finduser = await _userManager.FindByIdAsync(id);
            //delete insurance_company's account
            var deleteuser = await _userManager.DeleteAsync(finduser);

            if (deleteuser.Succeeded)
            {
                  _db.Insurance_Companies.Remove(findInsurance_company);

                  await _db.SaveChangesAsync();
            }

                return Ok(new JsonResult("The Insurance_company with username " + finduser.UserName + " is Deleted"));
            }
            return BadRequest(new JsonResult("Can't delete the insurance company"));
        }

    }
}
