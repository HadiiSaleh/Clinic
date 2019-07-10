export interface Patient {
  pat_user_id?: string;
  pat_username: string;
  pat_fname: string;
  pat_mname: string;
  pat_lname: string;
  pat_email: string;
  pat_phone: string;
  pat_name?: string;
  pat_address: string;
  pat_gender: string;
  pat_password: string;
  ConfirmPassword: string;
  pat_birthday: Date;
  pat_blood_type: string;
  pat_picture: string;
  pat_insurance_company_name: string;
}
