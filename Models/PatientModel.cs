using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class PatientModel
    {
        public string pat_user_id { get; set; }

        public int pat_id;

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_fname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_mname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_lname { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        public String pat_username { get; set; }

        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.Password)]
        public String pat_password { get; set; }

        [Compare("pat_password", ErrorMessage = "Confirm password doesn't match!")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(4000, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.PhoneNumber)]
        public String pat_phone { get; set; }

        [Required]
        [StringLength(256, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.EmailAddress)]
        public String pat_email { get; set; }

        [StringLength(10, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_gender { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String pat_address { get; set; }

        [DataType(DataType.Date)]
        public DateTime? pat_birthday { get; set; }

        [StringLength(4, ErrorMessage = "Maximum length is {1}")]
        public String pat_blood_type { get; set; }

        [StringLength(500, ErrorMessage = "Maximum length is {1}")]
        public String pat_picture { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String pat_insurance_company_name { get; set; }
    }
}
