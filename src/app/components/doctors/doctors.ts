import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../service/doctor-service';
import { HttpClientModule } from '@angular/common/http';
import Toastify from 'toastify-js';

interface Doctor {
  _id?: string;
  name: string;
  specialization: string;
  availability: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css']
})
export class Doctors implements OnInit {
  doctors: Doctor[] = [];
  newDoctor: Doctor = { name: '', specialization: '', availability: '' };
  editMode: boolean = false;
  editDoctorId: string | null = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => this.showToast("⚠️ Failed to load doctors", "orange")
    });
  }

  addOrUpdateDoctor() {
    if (this.editMode && this.editDoctorId) {
      this.doctorService.updateDoctor(this.editDoctorId, this.newDoctor).subscribe({
        next: (updatedDoctor) => {
          // Update the doctor in the array directly
          const index = this.doctors.findIndex(d => d._id === this.editDoctorId);
          if (index !== -1) this.doctors[index] = { ...updatedDoctor };
          
          this.resetForm();
          this.showToast("🔵 Doctor updated successfully", "blue");
        },
        error: () => this.showToast("⚠️ Error updating doctor", "orange")
      });
    } else {
      this.doctorService.addDoctor(this.newDoctor).subscribe({
        next: (addedDoctor) => {
          this.doctors.push(addedDoctor); // Add directly to array
          this.resetForm();
          this.showToast("🟢 Doctor added successfully", "green");
        },
        error: () => this.showToast("⚠️ Error adding doctor", "orange")
      });
    }
  }

  editDoctor(doctor: Doctor) {
    this.newDoctor = { ...doctor };
    this.editDoctorId = doctor._id || null;
    this.editMode = true;
  }

  deleteDoctor(id: string) {
    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        // Remove doctor directly from array
        this.doctors = this.doctors.filter(d => d._id !== id);
        this.showToast("🔴 Doctor deleted successfully", "red");
      },
      error: () => this.showToast("⚠️ Error deleting doctor", "orange")
    });
  }

  resetForm() {
    this.newDoctor = { name: '', specialization: '', availability: '' };
    this.editMode = false;
    this.editDoctorId = null;
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
