using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class ResetPasswordViewModel
    {
        public String id { get; set; }

        public String code { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        [DataType(DataType.Password)]
        public String password { get; set; }

        [Compare("password", ErrorMessage = "Confirm password doesn't match!")]
        [DataType(DataType.Password)]
        public String ConfirmPassword { get; set; }

        public ResetPasswordViewModel() { }

        public ResetPasswordViewModel (string id,
        string code,
        string password,
        string ConfirmPassword)
        {
            this.id = id;
            this.code = code;
            this.password = password;
            this.ConfirmPassword = ConfirmPassword;
        }
    }
}
