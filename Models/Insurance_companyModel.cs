using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class Insurance_companyModel
    {
        public string cid { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        public String ins_username { get; set; }

        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.Password)]
        public String ins_password { get; set; }

        [Compare("ins_password", ErrorMessage = "Confirm password doesn't match!")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.PhoneNumber)]
        public String ins_phone { get; set; }

        [Required]
        [StringLength(256, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.EmailAddress)]
        public String ins_email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_name { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_address { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_fax { get; set; }
    }
}
