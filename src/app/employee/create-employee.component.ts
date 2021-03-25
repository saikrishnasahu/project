import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  // fullNameLength = 0;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters'
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Email Domain should be dell.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email should be same'
    },
    'phone': {
      'required': 'Phone is required',
    }
  };

  formError = {
    'fullName':'',
    'email':'',
    'confirmEmail':'',
    'emailGroup':'',
    'phone':''
  };

  constructor(private fb: FormBuilder) { }

  // ngOnInit(): void {
  //   this.employeeForm = new FormGroup({
  //     fullName: new FormControl(),
  //     email: new FormControl(),
  //     skills: new FormGroup({
  //       skillName: new FormControl(),
  //       experienceInYears: new FormControl(),
  //       proficiency: new FormControl()
  //     })
  //   })
  // }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, { validators: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })

    // this.employeeForm.get('fullName').valueChanges.subscribe((value: string) => {
    //   this.fullNameLength = value.length;
    // })
    // this.employeeForm.valueChanges.subscribe((value: any) => {
    //   console.log(JSON.stringify(value));
    // })

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    })
    this.employeeForm.valueChanges.subscribe((value: any) => {
      this.logValidationErrors(this.employeeForm);
    });

  }

  addSkillbuttonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex);
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      // abstractControl.disable();
      this.formError[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const message = this.validationMessages[key];
        for (const error in abstractControl.errors) {
          this.formError[key] += message[error] + ' ';
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.touched);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.controls.email.touched);
    console.log(this.employeeForm.get('fullName').value);
  }

  onContactPreferenceChange(contactPreference: string) {
    const phoneControl = this.employeeForm.get('phone');
    if ('phone' === contactPreference) {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    // triggers after value is set
    phoneControl.updateValueAndValidity();
  }

  onLoadData(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formError);
    // setValue for all values whereas patchValue is for either all or some
    //   this.employeeForm.patchValue({
    //     fullName: 'Sai Krishna Sahu',
    //     email: 'sai@mail.com  ',
    //     skills: {
    //       skillName: 'Java',
    //       experienceInYears: 5,
    //       proficiency: 'beginner'
    //     }
    //   })

    // const formArray = new FormArray([
    //   new FormControl('John', Validators.required),
    //   new FormGroup({
    //     'country': new FormControl('', Validators.required)
    //   }),
    //   new FormArray([

    //   ])
    // ]);

    const formArray1 = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ])

    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ])

    console.log(formArray1);
    console.log(formGroup);

    // formArray1.push(new FormControl('Mark', Validators.required));
    // console.log(formArray1.at(3));

    // for (const control of formArray.controls) {
    //   if (control instanceof FormArray) {
    //     console.log('Control is FormArray')
    //   }
    //   if (control instanceof FormGroup) {
    //     console.log('Control is FormGroup')
    //   }
    //   if (control instanceof FormControl) {
    //     console.log('Control is FormControl')
    //   }
    // }
  }
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {

  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }

}