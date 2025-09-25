import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, // <-- make sure this is here
  ],
  bootstrap: [App]
})
export class AppModule { }
