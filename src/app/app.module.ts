import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { PlayComponent } from './play/play.component';
import { QuestionComponent } from './question/question.component';
import { JokersComponent } from './jokers/jokers.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    PlayComponent,
    QuestionComponent,
    JokersComponent
  ],
  providers: [provideHttpClient()],
  bootstrap: [PlayComponent]
})
export class AppModule { }
