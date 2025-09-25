import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../service/appointment-service';
import { HttpClientModule } from '@angular/common/http';
import Toastify from 'toastify-js';

interface Patient { _id: string; name: string; }
interface Doctor { _id: string; name: string; }
interface Appointment {
  _id?: string;
  patient: string | Patient;
  doctor: string | Doctor;
  date: string;
  time: string;
  reason: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css']
})
export class Appointments implements OnInit {
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];

  newAppointment: Appointment = { patient: '', doctor: '', date: '', time: '', reason: '' };
  editMode: boolean = false;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadAppointments()
  }

  loadPatients() {
    fetch('http://localhost:5000/api/patients')
      .then(res => res.json())
      .then(data => {
        this.patients = data;
        this.loadAppointments(); // load appointments after patients loaded
      })
      .catch(() => this.showToast("⚠️ Failed to load patients", "orange"));
  }

  loadDoctors() {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => this.doctors = data)
      .catch(() => this.showToast("⚠️ Failed to load doctors", "orange"));
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => this.showToast("⚠️ Failed to load appointments", "orange")
    });
  }

addOrUpdateAppointment() {
  const payload = {
    patient: this.newAppointment.patient,
    doctor: this.newAppointment.doctor,
    date: this.newAppointment.date,
    time: this.newAppointment.time,
    reason: this.newAppointment.reason
  };

  if (this.editMode && this.newAppointment._id) {
    // Update
    this.appointmentService.updateAppointment(this.newAppointment._id, payload).subscribe({
      next: (updatedAppt) => {
        // Update appointment in local array by _id
        const index = this.appointments.findIndex(a => a._id === updatedAppt._id);
        if (index !== -1) {
          this.appointments[index] = updatedAppt;
        }
        this.showToast(
          `🔵 Appointment for ${this.getPatientName(updatedAppt.patient)} with ${this.getDoctorName(updatedAppt.doctor)} updated successfully`,
          "blue"
        );
        this.resetForm();
      },
      error: () => this.showToast("⚠️ Error updating appointment", "orange")
    });
  } else {
    // Add
    this.appointmentService.addAppointment(payload).subscribe({
      next: (addedAppt) => {
        this.appointments.push(addedAppt);  // Push newly added appointment with populated fields
        this.showToast(
          `🟢 Appointment for ${this.getPatientName(addedAppt.patient)} with ${this.getDoctorName(addedAppt.doctor)} added successfully`,
          "green"
        );
        this.resetForm();
      },
      error: () => this.showToast("error adding","red")
    });
  }
}

      
  editAppointment(appt: Appointment) {
    this.newAppointment = {
      _id: appt._id,
      patient: typeof appt.patient === 'object' ? appt.patient._id : appt.patient,
      doctor: typeof appt.doctor === 'object' ? appt.doctor._id : appt.doctor,
      date: appt.date,
      time: appt.time,
      reason: appt.reason
    };
    this.editMode = true;
  }

  deleteAppointment(id: string | undefined) {
    if (!id) return;
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a._id !== id);
        this.showToast(
          `🔴 Appointment deleted successfully`,
          "red"
        );
      },
      error: () => this.showToast("⚠️ Error deleting appointment", "orange")
    });
  }

  resetForm() {
    this.newAppointment = { patient: '', doctor: '', date: '', time: '', reason: '' };
    this.editMode = false;
  }

 getPatientName(patient: string | Patient | null) {
  if (!patient) return 'Unknown';
  if (typeof patient === 'object') return patient.name || 'Unknown';
  return this.patients.find(p => p._id === patient)?.name || 'Unknown';
}

getDoctorName(doctor: string | Doctor | null) {
  if (!doctor) return 'Unknown';
  if (typeof doctor === 'object') return doctor.name || 'Unknown';
  return this.doctors.find(d => d._id === doctor)?.name || 'Unknown';
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
