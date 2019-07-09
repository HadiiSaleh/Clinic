using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Clinic.Migrations
{
    public partial class Migration1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    admin_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    admin_fname = table.Column<string>(maxLength: 50, nullable: true),
                    admin_mname = table.Column<string>(maxLength: 50, nullable: true),
                    admin_lname = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.admin_id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    dr_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    dr_user_id = table.Column<string>(nullable: false),
                    dr_fname = table.Column<string>(maxLength: 50, nullable: true),
                    dr_mname = table.Column<string>(maxLength: 50, nullable: true),
                    dr_lname = table.Column<string>(maxLength: 50, nullable: true),
                    dr_gender = table.Column<string>(maxLength: 10, nullable: true),
                    dr_speciality = table.Column<string>(maxLength: 100, nullable: true),
                    dr_address = table.Column<string>(maxLength: 100, nullable: true),
                    dr_about = table.Column<string>(maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.dr_id);
                });

            migrationBuilder.CreateTable(
                name: "Insurance_Companies",
                columns: table => new
                {
                    ins_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ins_name = table.Column<string>(maxLength: 100, nullable: false),
                    ins_user_id = table.Column<string>(nullable: false),
                    ins_address = table.Column<string>(maxLength: 100, nullable: true),
                    ins_fax = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Insurance_Companies", x => new { x.ins_id, x.ins_name });
                    table.UniqueConstraint("AK_Insurance_Companies_ins_name", x => x.ins_name);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    m_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    m_sender_id = table.Column<string>(nullable: false),
                    m_subject = table.Column<string>(nullable: false),
                    m_message = table.Column<string>(maxLength: 500, nullable: false),
                    m_date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.m_id);
                });

            migrationBuilder.CreateTable(
                name: "Reminder_Admins",
                columns: table => new
                {
                    reminder_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    reminder_date = table.Column<DateTime>(nullable: false),
                    reminder_content = table.Column<string>(maxLength: 300, nullable: false),
                    reminder_priority = table.Column<int>(nullable: false),
                    reminder_title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminder_Admins", x => x.reminder_id);
                });

            migrationBuilder.CreateTable(
                name: "Reminder_Assistants",
                columns: table => new
                {
                    reminder_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    reminder_date = table.Column<DateTime>(nullable: false),
                    reminder_content = table.Column<string>(maxLength: 300, nullable: false),
                    reminder_priority = table.Column<int>(nullable: false),
                    reminder_title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminder_Assistants", x => x.reminder_id);
                });

            migrationBuilder.CreateTable(
                name: "reminder_Doctors",
                columns: table => new
                {
                    reminder_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    reminder_date = table.Column<DateTime>(nullable: false),
                    reminder_content = table.Column<string>(maxLength: 300, nullable: false),
                    reminder_priority = table.Column<int>(nullable: false),
                    reminder_title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reminder_Doctors", x => x.reminder_id);
                });

            migrationBuilder.CreateTable(
                name: "Reminder_Insurances",
                columns: table => new
                {
                    reminder_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    reminder_date = table.Column<DateTime>(nullable: false),
                    reminder_content = table.Column<string>(maxLength: 300, nullable: false),
                    reminder_priority = table.Column<int>(nullable: false),
                    reminder_title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminder_Insurances", x => x.reminder_id);
                });

            migrationBuilder.CreateTable(
                name: "reminder_Patients",
                columns: table => new
                {
                    reminder_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    reminder_date = table.Column<DateTime>(nullable: false),
                    reminder_content = table.Column<string>(maxLength: 300, nullable: false),
                    reminder_priority = table.Column<int>(nullable: false),
                    reminder_title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reminder_Patients", x => x.reminder_id);
                });

            migrationBuilder.CreateTable(
                name: "ResetPasswordViewModel",
                columns: table => new
                {
                    id = table.Column<string>(nullable: false),
                    code = table.Column<string>(nullable: true),
                    password = table.Column<string>(maxLength: 100, nullable: true),
                    ConfirmPassword = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResetPasswordViewModel", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Assistants",
                columns: table => new
                {
                    as_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    as_user_id = table.Column<string>(nullable: false),
                    as_fname = table.Column<string>(maxLength: 50, nullable: true),
                    as_mname = table.Column<string>(maxLength: 50, nullable: true),
                    as_lname = table.Column<string>(maxLength: 50, nullable: true),
                    as_dr_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assistants", x => x.as_id);
                    table.ForeignKey(
                        name: "FK_Assistants_Doctors_as_dr_id",
                        column: x => x.as_dr_id,
                        principalTable: "Doctors",
                        principalColumn: "dr_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    pat_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    pat_user_id = table.Column<string>(nullable: false),
                    pat_fname = table.Column<string>(maxLength: 50, nullable: true),
                    pat_mname = table.Column<string>(maxLength: 50, nullable: true),
                    pat_lname = table.Column<string>(maxLength: 50, nullable: true),
                    pat_gender = table.Column<string>(maxLength: 10, nullable: true),
                    pat_address = table.Column<string>(maxLength: 100, nullable: true),
                    pat_birthday = table.Column<DateTime>(type: "date", nullable: true),
                    pat_blood_type = table.Column<string>(maxLength: 4, nullable: true),
                    pat_picture = table.Column<string>(maxLength: 500, nullable: true),
                    pat_insurance_company_name = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.pat_id);
                    table.ForeignKey(
                        name: "FK_Patients_Insurance_Companies_pat_insurance_company_name",
                        column: x => x.pat_insurance_company_name,
                        principalTable: "Insurance_Companies",
                        principalColumn: "ins_name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Consultations",
                columns: table => new
                {
                    cons_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    cons_pat_id = table.Column<int>(nullable: false),
                    cons_dr_id = table.Column<int>(nullable: false),
                    cons_title = table.Column<string>(maxLength: 100, nullable: true),
                    cons_type = table.Column<string>(maxLength: 50, nullable: true),
                    cons_date = table.Column<DateTime>(nullable: false),
                    cons_symptoms = table.Column<string>(maxLength: 500, nullable: false),
                    cons_diagnosis = table.Column<string>(maxLength: 500, nullable: true),
                    cons_temp = table.Column<string>(maxLength: 5, nullable: true),
                    cons_blood_pressure = table.Column<string>(maxLength: 5, nullable: true),
                    cons_cost = table.Column<int>(nullable: false),
                    cons_treatment = table.Column<string>(maxLength: 500, nullable: true),
                    cons_insurance_confirmation = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultations", x => x.cons_id);
                    table.ForeignKey(
                        name: "FK_Consultations_Doctors_cons_dr_id",
                        column: x => x.cons_dr_id,
                        principalTable: "Doctors",
                        principalColumn: "dr_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Consultations_Patients_cons_pat_id",
                        column: x => x.cons_pat_id,
                        principalTable: "Patients",
                        principalColumn: "pat_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dates",
                columns: table => new
                {
                    date_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    date_pat_id = table.Column<int>(nullable: false),
                    date_dr_id = table.Column<int>(nullable: false),
                    date_dateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dates", x => x.date_id);
                    table.ForeignKey(
                        name: "FK_Dates_Doctors_date_dr_id",
                        column: x => x.date_dr_id,
                        principalTable: "Doctors",
                        principalColumn: "dr_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dates_Patients_date_pat_id",
                        column: x => x.date_pat_id,
                        principalTable: "Patients",
                        principalColumn: "pat_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    report_id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    report_cons_id = table.Column<int>(nullable: false),
                    report_ins_name = table.Column<string>(nullable: false),
                    Consultationcons_id = table.Column<int>(nullable: true),
                    Insurance_companyins_id = table.Column<int>(nullable: true),
                    Insurance_companyins_name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.report_id);
                    table.ForeignKey(
                        name: "FK_Reports_Consultations_Consultationcons_id",
                        column: x => x.Consultationcons_id,
                        principalTable: "Consultations",
                        principalColumn: "cons_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reports_Insurance_Companies_Insurance_companyins_id_Insurance_companyins_name",
                        columns: x => new { x.Insurance_companyins_id, x.Insurance_companyins_name },
                        principalTable: "Insurance_Companies",
                        principalColumns: new[] { "ins_id", "ins_name" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1", null, "Admin", "ADMIN" },
                    { "2", null, "Doctor", "DOCTOR" },
                    { "3", null, "Assistant", "ASSISTANT" },
                    { "4", null, "Patient", "PATIENT" },
                    { "5", null, "Insurance_company", "INSURANCE_COMPANY" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Assistants_as_dr_id",
                table: "Assistants",
                column: "as_dr_id");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_cons_dr_id",
                table: "Consultations",
                column: "cons_dr_id");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_cons_pat_id",
                table: "Consultations",
                column: "cons_pat_id");

            migrationBuilder.CreateIndex(
                name: "IX_Dates_date_dr_id",
                table: "Dates",
                column: "date_dr_id");

            migrationBuilder.CreateIndex(
                name: "IX_Dates_date_pat_id",
                table: "Dates",
                column: "date_pat_id");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_pat_insurance_company_name",
                table: "Patients",
                column: "pat_insurance_company_name");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Consultationcons_id",
                table: "Reports",
                column: "Consultationcons_id");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Insurance_companyins_id_Insurance_companyins_name",
                table: "Reports",
                columns: new[] { "Insurance_companyins_id", "Insurance_companyins_name" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Assistants");

            migrationBuilder.DropTable(
                name: "Dates");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Reminder_Admins");

            migrationBuilder.DropTable(
                name: "Reminder_Assistants");

            migrationBuilder.DropTable(
                name: "reminder_Doctors");

            migrationBuilder.DropTable(
                name: "Reminder_Insurances");

            migrationBuilder.DropTable(
                name: "reminder_Patients");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "ResetPasswordViewModel");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Consultations");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Insurance_Companies");
        }
    }
}
