﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Models
{
    public class Patient
    {
        [Required]
        [Key]
        public int pat_id { get; set; }

        [Required]
        public string pat_user_id { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_fname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_mname { get; set; }

        [StringLength(50, ErrorMessage = "Maximum length is {1}")]
        [RegularExpression("^[A-Za-z]+$")]
        public String pat_lname { get; set; }

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

        [Required]
        [ForeignKey("pat_insurance_company_name")]
        public Insurance_company insurance_company { get; set; }

        public List<Consultation> consultations { get; set; }

        public List<Date> dates { get; set; }
    }
}