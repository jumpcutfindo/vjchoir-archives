import { Component, OnInit } from '@angular/core';
import { ContributeService } from './contribute.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';
import { Toast, ToastrService } from 'ngx-toastr';

const CONTRIBUTE_TITLE = "Contribute";
const FORM_URL = "formspree.io";

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit {

  contributeInfo;
  contributeForm: FormGroup;

  isSubmitting: boolean = false;

  formInfo = {
    "name": "",
    "batch": "",
    "email": "",
    "type": "",
    "text": ""
  }

  constructor(private contributeService: ContributeService, 
    private formBuilder: FormBuilder,
    private titleService: Title,
    private loadingService: LoadingService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.contributeService.getContent().subscribe(content => this.contributeInfo = content);
  
    this.contributeForm = this.formBuilder.group({
      "name": new FormControl(this.formInfo.name, [Validators.required]),
      "batch": new FormControl(this.formInfo.batch, [Validators.required]),
      "email": new FormControl(this.formInfo.email, [Validators.required, Validators.email]),
      "type": new FormControl(this.formInfo.type, [Validators.required]),
      "text": new FormControl(this.formInfo.text, [Validators.required])
    })

    this.titleService.setTitle(CONTRIBUTE_TITLE);
    this.loadingService.setLoading(false);
  }

  validateForm() {
    console.log(this.contributeForm.valid);
  }

  getName() {
    return this.contributeForm.get("name");
  }

  getBatch() {
    return this.contributeForm.get("batch");
  }

  getEmail() {
    return this.contributeForm.get("email");
  }

  getType() {
    return this.contributeForm.get("type");
  }

  getFeedback() {
    return this.contributeForm.get("text");
  }

  submitForm() {

    if(this.contributeForm.invalid) {
      Object.keys(this.contributeForm.controls).forEach(field => {
        const control = this.contributeForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      this.isSubmitting = true;
      this.contributeService.sendFormToServer({
          name: this.getName().value,
          batch: this.getBatch().value,
          email: this.getEmail().value,
          type: this.getType().value,
          text: this.getFeedback().value
      }).subscribe(response => {
            this.isSubmitting = false;
            this.toaster.success("Form has been submitted!");
      });
    }
    
  }
}
