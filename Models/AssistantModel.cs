using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class AssistantModel
    {
        public string as_user_id { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String as_fname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String as_mname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String as_lname { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        public String as_username { get; set; }

        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.Password)]
        public String as_password { get; set; }

        [Compare("as_password", ErrorMessage = "Confirm password doesn't match!")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.PhoneNumber)]
        public String as_phone { get; set; }

        [Required]
        [StringLength(256, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.EmailAddress)]
        public String as_email { get; set; }

        [Required]
        public int as_dr_id { get; set; }
    }
}
