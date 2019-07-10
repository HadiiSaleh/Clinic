using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class DoctorModel
    {
        public int dr_id;
        public string dr_user_id { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String dr_fname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String dr_mname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String dr_lname { get; set; }

        [StringLength(10, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String dr_gender { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        public String dr_username { get; set; }

        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.Password)]
        public String dr_password { get; set; }

        [Compare("dr_password", ErrorMessage = "Confirm password doesn't match!")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.PhoneNumber)]
        public String dr_phone { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String dr_speciality { get; set; }

        [Required]
        [StringLength(256, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.EmailAddress)]
        public String dr_email { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String dr_address { get; set; }

        [StringLength(400, ErrorMessage = "Maximum length is {1}")]
        public String dr_about { get; set; }
        
    }
}
