import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { touchAllFormFields } from '../angular-helpers/validation';
import { AuthUsecase } from '../auth/auth.usecase';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
  name: string = '';
  role!: string | null | undefined;
  closeResult: string = '';
  headerMenu: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authUsecase: AuthUsecase,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal) { 
    this.createLoginFormBuilder();
    this.createRegisterFormBuilder();
  }

  ngOnInit(): void {
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    this.name = firstname + "  " + lastname + "     ";
  }

  openModal(content: any) {
    this.headerMenu = 'Login'
    if(this.loginForm)
        this.loginForm.reset();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isAdmin() {
    this.role = localStorage.getItem('role');
    if(this.role === "Admin")
        return true;
      
    return false;
  }

  isInternalUser() {
    this.role = localStorage.getItem('role');
    if(this.role === "Internal_User")
        return true;
      
    return false;
  }

  async login(): Promise<void> {
    if (this.loginForm !== null && !this.loginForm.valid) {
      touchAllFormFields(this.loginForm);
      return;
    }
    this.authUsecase.login(this.loginForm?.value);
  }

  logout() {
    this.authUsecase.logout('/home');
  }

  register() {
    debugger;
    this.setFormValue();
    if (this.registerForm !== null && !this.registerForm.valid) {
      touchAllFormFields(this.registerForm);
      return;
    }
    this.authUsecase.register(this.registerForm?.value).subscribe((resp) => {
      if(resp) {
        this.toastr.info('user register successfully, Please goto login');
      } else {
        this.toastr.error('registion was not successfully, please try again or contact our admin');
      }
    });
  }

  registrationModal(content: any) {
    this.headerMenu = 'Registration'
    this.registerForm?.reset();        
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private setFormValue() {
    this.registerForm.controls['createdAt'].setValue(new Date());
    this.registerForm.controls['userId'].setValue(this.EMPTY_GUID);
    this.registerForm.controls['onlineUserTypeId'].setValue(this.EMPTY_GUID);
    this.registerForm.controls['isDeleted'].setValue(false);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private createLoginFormBuilder() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  private createRegisterFormBuilder() {
    this.registerForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      password: [''],
      createdAt: [new Date()],
      isDeleted: [false],
      userId: [this.EMPTY_GUID],
      onlineUserTypeId: [this.EMPTY_GUID]
    });
  }
}
