using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class ForgotPasswordEmail
    {
        [Required]
        [StringLength(256, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.EmailAddress)]
        public string email { get; set; }
    }
}
