using Clinic.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Clinic.Data
{
    public class ApplicationDbContext:IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        //Creating Roles for our Application

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                new { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                new { Id = "2", Name = "Doctor", NormalizedName = "DOCTOR" },
                new { Id = "3", Name = "Assistant", NormalizedName = "ASSISTANT" },
                new { Id = "4", Name = "Patient", NormalizedName = "PATIENT" },
                new { Id = "5", Name = "Insurance_company", NormalizedName = "INSURANCE_COMPANY" }
                );

            builder.Entity<Insurance_company>()
                .HasKey(o => new { o.ins_id, o.ins_name });

            builder.Entity<Patient>()
            .HasOne(s => s.insurance_company)
            .WithMany(c => c.patients)
            .HasForeignKey(s => s.pat_insurance_company_name)
            .HasPrincipalKey(c => c.ins_name);

            builder.Entity("Clinic.Models.Patient", b =>
            {
                b.Property<DateTime?>("pat_birthday")
                       .HasColumnType("date");
            });
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Assistant> Assistants { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Insurance_company> Insurance_Companies { get; set; }
        public DbSet<Consultation> Consultations { get; set; }
        public DbSet<Date> Dates { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Reminder_admin> Reminder_Admins { get; set; }
        public DbSet<Reminder_assistant> Reminder_Assistants { get; set; }
        public DbSet<Reminder_doctor> reminder_Doctors { get; set; }
        public DbSet<Reminder_patient> reminder_Patients { get; set; }
        public DbSet<Reminder_insurance> Reminder_Insurances { get; set; }
        public DbSet<Clinic.Models.ResetPasswordViewModel> ResetPasswordViewModel { get; set; }
    }
}
