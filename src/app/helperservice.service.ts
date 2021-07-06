import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor(private db: AngularFireDatabase) { }

  login(email: string, password: string) {
    var loginFlag = false;
    switch(email){
      case "samyadh.jain@gmail.com":
        if(password == "Sam@1234")
          loginFlag = true;
        break;
      case "vinraedutab@gmail.com":
        if(password == "admin@vinraedutab123")
          loginFlag = true;
        break;
      case "testvinraedutab@yopmail.com":
        if(password == "1234")
          loginFlag = true;
        break;
      case "pavanshivaraokulkarni@gmail.com":
        if(password == "admin@vinraedutab123")
          loginFlag = true;
        break;
      case "raajshreevtamhane@gmail.com":
        if(password == "admin@vinraedutab123")
          loginFlag = true;
        break;
      default:
        loginFlag = false;
    }

    if(loginFlag)
    {
      localStorage.setItem('currentUser', JSON.stringify(email));
      return true;
    }
    else
    {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    return true;
  }
}
