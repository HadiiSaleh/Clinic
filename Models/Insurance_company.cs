using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class Insurance_company
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ins_id { get; set; }

        [Required]
        public string ins_user_id { get; set; }

        [Required]
        [Key]
        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_name { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_address { get; set; }

        [StringLength(100, ErrorMessage = "Maximum length is {1}")]
        public String ins_fax { get; set; }

        public List<Patient> patients { get; set; }

        public List<Report> reports { get; set; }
    }
}
