using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class MessageModel
    {
        public int m_id;

        public string m_sender_id;

        public string sender_username;

        public DateTime m_date;

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string m_subject { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Maximum length is {1}")]
        public string m_message { get; set; }
    }
}
