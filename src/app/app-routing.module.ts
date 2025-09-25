import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Doctors } from './components/doctors/doctors';
import { Patients } from './components/patients/patients';
import { Appointments } from './components/appointments/appointments';

const routes: Routes = [
  { path: 'doctors', component: Doctors },
  { path: 'patients', component: Patients },
  { path: 'appointments', component: Appointments },
  { path: '', redirectTo: '/doctors', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}



