// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { isPlatformBrowser } from '@angular/common';
// import { environment } from '../environments/environment';
// import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, UserCredential } from 'firebase/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class GoogleAuthService {
//   private apiUrl = `${environment.apiUrl}/auth/google`; // Endpoint-ul din backend
//   private token: string | null = null;

//   constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

//   async signInWithGoogle(): Promise<void> {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();

//     try {
//       await signInWithRedirect(auth, provider);
//     } catch (error) {
//       console.error('Eroare la inițierea autentificării cu Google:', error);
//       throw error;
//     }
//   }

//   async handleRedirectResult(): Promise<void> {
//     const auth = getAuth();
//     try {
//       const result: UserCredential | null = await getRedirectResult(auth);
//       if (result && result.user) {
//         const firebaseToken = await result.user.getIdToken();

//         const response = await this.http
//           .post<any>(
//             this.apiUrl,
//             { firebaseToken },
//             { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
//           )
//           .toPromise();

//         if (response && response.token) {
//           this.saveToken(response.token);
//           console.log('Autentificare Google reușită:', response);
//         } else {
//           console.warn('Nu am primit un token valid de la backend.');
//         }
//       } else {
//         console.log('Nu există niciun rezultat al redirecționării. Utilizatorul nu s-a autentificat încă.');
//       }
//     } catch (error) {
//       console.error('Eroare la obținerea rezultatului de redirecționare:', error);
//     }
//   }

//   saveToken(token: string): void {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.setItem('auth_token', token);
//     }
//     this.token = token;
//   }

//   getToken(): string | null {
//     return this.token || (isPlatformBrowser(this.platformId) ? localStorage.getItem('auth_token') : null);
//   }

//   logout(): void {
//     this.token = null;
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('auth_token');
//     }
//   }

//   isAuthenticated(): boolean {
//     const token = this.getToken();
//     return token != null && !this.isTokenExpired(token);
//   }

//   private isTokenExpired(token: string): boolean {
//     const decodedToken = this.decodeToken(token);
//     if (!decodedToken || !decodedToken.exp) {
//       return true;
//     }
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decodedToken.exp < currentTime;
//   }

//   private decodeToken(token: string): any {
//     try {
//       const payload = token.split('.')[1];
//       return JSON.parse(atob(payload));
//     } catch (error) {
//       return null;
//     }
//   }
// }
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { isPlatformBrowser } from '@angular/common';
// import { environment } from '../environments/environment';
// import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class GoogleAuthService {
//   private apiUrl = `${environment.apiUrl}/auth`; // Endpoint-ul din backend
//   private token: string | null = null;

//   constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

//   // Funcția pentru autentificare cu Google folosind pop-up
//   async signInWithGoogle(): Promise<void> {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();

//     try {
//       // Înlocuim signInWithRedirect cu signInWithPopup
//       const result: UserCredential = await signInWithPopup(auth, provider);

//       // După autentificare, obținem token-ul de la utilizator
//       const firebaseToken = await result.user.getIdToken();
//       console.log('Token-ul Firebase:', firebaseToken); // Adăugați acest log

//       // Trimitem token-ul către backend pentru a obține un token valid
//       const response = await this.http
//         .post<any>(this.apiUrl, { firebaseToken }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
//         .toPromise();

//       if (response && response.token) {
//         this.saveToken(response.token);
//         console.log('Autentificare Google reușită:', response);
//       } else {
//         console.warn('Nu am primit un token valid de la backend.');
//       }
//     } catch (error) {
//       console.error('Eroare la autentificarea cu Google:', error);
//     }
//   }

//   // Funcția pentru salvarea token-ului
//   saveToken(token: string): void {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.setItem('auth_token', token);
//     }
//     this.token = token;
//   }

//   // Funcția pentru obținerea token-ului
//   getToken(): string | null {
//     return this.token;
//   }

//   // Funcția pentru logare
//   logout(): void {
//     this.token = null;
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('auth_token');
//     }
//   }

//   // Verifică dacă utilizatorul este autentificat
//   isAuthenticated(): boolean {
//     const token = this.getToken();
//     return token != null && !this.isTokenExpired(token);
//   }

//   // Verifică dacă token-ul este expirat
//   private isTokenExpired(token: string): boolean {
//     const decodedToken = this.decodeToken(token);
//     if (!decodedToken || !decodedToken.exp) {
//       return true;
//     }
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decodedToken.exp < currentTime;
//   }

//   // Decodează token-ul JWT
//   private decodeToken(token: string): any {
//     try {
//       const payload = token.split('.')[1];
//       return JSON.parse(atob(payload));
//     } catch (error) {
//       return null;
//     }
//   }

//   // Funcția pentru a obține datele utilizatorului din Firebase pe baza token-ului
//   async getFirebaseUserData(): Promise<any> {
//     const token = this.getToken();
//     if (!token) {
//       console.warn('Token-ul nu există. Utilizatorul nu este autentificat.');
//       return null;
//     }

//     try {
//       // Obține detaliile utilizatorului de la Firebase utilizând token-ul
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (!user) {
//         console.warn('Utilizatorul nu este autentificat.');
//         return null;
//       }

//       // Datele utilizatorului
//       const userData = {
//         uid: user.uid,
//         displayName: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL,
//       };

//       console.log('Datele utilizatorului din Firebase:', userData);
//       return userData;
//     } catch (error) {
//       console.error('Eroare la obținerea datelor utilizatorului din Firebase:', error);
//       return null;
//     }
//   }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { initializeFirebase, firebaseAuth } from '../../app/firebase-config'; // Asigură-te că această cale este corectă
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // Endpoint-ul backend
  private token: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private http: HttpClient) {
    // Asigură-te că Firebase a fost inițializat corect
    initializeFirebase().then(() => {
      console.log('Firebase has been initialized in GoogleAuthService');
    });
  }

  // Funcția pentru autentificarea utilizatorului cu Google folosind pop-up
  async signInWithGoogle(): Promise<void> {
    const auth = firebaseAuth;
    const provider = new GoogleAuthProvider();

    try {
      // Autentificare cu Google folosind pop-up
      const result: UserCredential = await signInWithPopup(auth, provider);

      // Obținem detaliile utilizatorului
      const user = result.user;
      console.log('User authenticated with Google!');
      console.log('User details:');
      console.log('Display Name:', user.displayName);
      console.log('Email:', user.email);
      console.log('UID:', user.uid);
      console.log('Photo URL:', user.photoURL);

      // Obținem token-ul Firebase
      const firebaseToken = await user.getIdToken();
      console.log('Token-ul Firebase:', firebaseToken);

      // Trimitem token-ul către backend pentru a obține un token valid
      const response = await this.http
        .post<any>(this.apiUrl, { firebaseToken }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
        .toPromise();

      if (response && response.token) {
        this.saveToken(response.token);

        // Wait for the result of login
        const response1 = await this.login(response.token).toPromise();

        // Check if the response contains the token
        if (response1.token) {
          localStorage.setItem('auth_token', response1.token);
          console.log('Token-ul backend:', response1.token);
        }

        console.log('Autentificare Google reușită:', response);
      } else {
        console.warn('Nu am primit un token valid de la backend.');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  }
  login(firebaseToken: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { firebaseToken });
  }

  // Funcția pentru salvarea token-ului
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('firebase-token', token);
    }
    this.token = token;
  }

  // Funcția pentru obținerea token-ului
  getToken(): string | null {
    return this.token;
  }

  // Funcție pentru deconectare
  async logout(): Promise<void> {
    const auth = firebaseAuth;
    try {
      await auth.signOut();
      console.log('User signed out successfully!');
      this.token = null;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('firebase-token');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }

  // Verifică dacă utilizatorul este autentificat
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }

  // Verifică dacă token-ul este expirat
  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  // Decodează token-ul JWT
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

  // Funcția pentru a obține datele utilizatorului din Firebase pe baza token-ului
  async getFirebaseUserData(): Promise<any> {
    const token = this.getToken();
    if (!token) {
      console.warn('Token-ul nu există. Utilizatorul nu este autentificat.');
      return null;
    }

    try {
      // Obține detaliile utilizatorului de la Firebase utilizând token-ul
      const auth = firebaseAuth;
      const user = auth.currentUser;

      if (!user) {
        console.warn('Utilizatorul nu este autentificat.');
        return null;
      }

      // Datele utilizatorului
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      console.log('Datele utilizatorului din Firebase:', userData);
      return userData;
    } catch (error) {
      console.error('Eroare la obținerea datelor utilizatorului din Firebase:', error);
      return null;
    }
  }
}
