import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';

import { ProfileComponent } from './profile/profile.component';
import { ChanelComponent } from './chanel/chanel.component';

import { VideoPageComponent } from './video-page/video-page.component';
import { VideoItemComponent } from './video-item/video-item.component';

import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthInterceptor } from "./Authinterceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {JwtService} from "./services/jwt.service";
import { MenuConditionService } from "./services/menu-condition.service";
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { LikedVideosComponent } from './liked-videos/liked-videos.component';


@NgModule({
  declarations: [
    AppComponent,
    VideoPageComponent,
    HomeComponent,
    ProfileComponent,
    ChanelComponent,
    VideoItemComponent,
    SignUpComponent,
    SignInComponent,
    VideoUploadComponent,
    SettingsComponent,
    HistoryComponent,
    SubscriptionsComponent,
    LikedVideosComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    JwtService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
