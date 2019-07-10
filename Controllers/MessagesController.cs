using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clinic.Data;
using Clinic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Clinic.Controllers
{
    [Route("api/[controller]")]
    public class MessagesController : Controller
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<IdentityUser> _userManager;
        public MessagesController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        
        [HttpGet("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetMessages()
        {
            if (_db.Messages.Count() != 0)
            {
                List<MessageModel> result = new List<MessageModel>();

                var findMessages = _db.Messages.ToList();

                foreach (Message message in findMessages)
                {
                    var findUser = await _userManager.FindByIdAsync(message.m_sender_id);

                    MessageModel messageModel = new MessageModel();
                    messageModel.m_id = message.m_id;
                    messageModel.m_date = message.m_date;
                    messageModel.m_message = message.m_message;
                    messageModel.m_subject = message.m_subject;
                    messageModel.m_sender_id = message.m_sender_id;
                    messageModel.sender_username = findUser.UserName;
                    messageModel.Email = findUser.Email;
                    
                    result.Add(messageModel);
                }

                return Ok(result);
            }

            return BadRequest(new JsonResult("No Messages to show"));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMessageById(int id)
        {
            var message = await _db.Messages.FindAsync(id);
            if (message != null) return Ok(message);
            return NotFound();
        }

        [HttpPost("[action]")]
        [Authorize(Policy ="RequireLoggedIn")]
        public async Task<IActionResult> AddMessage([FromBody] MessageModel messageModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //here we will hold all the errors of registration
            List<string> errorList = new List<string>();

            var m_sender = await _userManager.FindByEmailAsync(messageModel.Email);

            if (m_sender != null)
            {
                var newMessage = new Message
                {
                    m_date = DateTime.Now,
                    m_message = messageModel.m_message,
                    m_subject = messageModel.m_subject,
                    m_sender_id = m_sender.Id
                };

                var addMessage = await _db.Messages.AddAsync(newMessage);

                if (addMessage != null)
                {
                    await _db.SaveChangesAsync();

                    return Ok(new { messageId = newMessage.m_id, SenderId = newMessage.m_sender_id, status = 1, message = "Message Added Successfuly" });
                }

                else
                {
                    errorList.Add("Can't add this Message");
                }
            }

            else
            {
                errorList.Add("Email '"+ messageModel.Email+ "' not Found!");

                foreach (var error in errorList)
                {
                    ModelState.AddModelError("", error);
                }
            }

            return BadRequest(new JsonResult(errorList));
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteMessage([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //find message
            var findMesssage = await _db.Messages.FindAsync(id);

            if (findMesssage == null)
            {
                return NotFound();
            }

            _db.Messages.Remove(findMesssage);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The message with id "+id+" is Deleted"));
        }

    }
}
