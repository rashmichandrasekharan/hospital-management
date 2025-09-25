import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../service/patient-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Toastify from 'toastify-js';

interface Patient {
  _id?: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
  contact: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class Patients implements OnInit {
  patients: Patient[] = [];
  newPatient: Patient = { name: '', age:0, gender: '', medicalHistory: '', contact: '' };
  editMode: boolean = false;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.showToast("⚠️ Failed to load patients", "orange")
    });
  }

  addOrUpdatePatient() {
    if (this.editMode && this.newPatient._id) {
      this.patientService.updatePatient(this.newPatient._id, this.newPatient).subscribe({
        next: (updatedPatient) => {
          const index = this.patients.findIndex(p => p._id === this.newPatient._id);
          if (index !== -1) this.patients[index] = { ...updatedPatient };

          this.resetForm();
          this.showToast("🔵 Patient updated successfully", "blue");
        },
        error: () => this.showToast("⚠️ Error updating patient", "orange")
      });
    } else {
      this.patientService.addPatient(this.newPatient).subscribe({
        next: (addedPatient) => {
          this.patients.push(addedPatient);
          this.resetForm();
          this.showToast("🟢 Patient added successfully", "green");
        },
        error: () => this.showToast("⚠️ Error adding patient", "orange")
      });
    }
  }

  editPatient(patient: Patient) {
    this.newPatient = { ...patient };
    this.editMode = true;
  }

  deletePatient(id?: string) {
    if (!id) return;
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.patients = this.patients.filter(p => p._id !== id);
        this.showToast("🔴 Patient deleted successfully", "red");
      },
      error: () => this.showToast("⚠️ Error deleting patient", "orange")
    });
  }

  resetForm() {
    this.newPatient = { name: '', age: 0, gender: '', medicalHistory: '', contact: '' };
    this.editMode = false;
  }

  private showToast(message: string, type: "green" | "blue" | "red" | "orange") {
    const colors: Record<string, string> = {
      green: "linear-gradient(to right, #00b09b, #96c93d)",
      blue: "linear-gradient(to right, #2193b0, #6dd5ed)",
      red: "linear-gradient(to right, #ff5f6d, #ffc371)",
      orange: "linear-gradient(to right, #f7971e, #ffd200)"
    };

    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: colors[type]
    }).showToast();
  }
}
