import { Component } from '@angular/core';
import { App, MenuController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

// Referência:
// https://www.djamware.com/post/59924f9080aca768e4d2b12e/ionic-3-consuming-rest-api-using-new-angular-43-httpclient
// e declarar no app.module.ts:
//  import { HttpClientModule } from '@angular/common/http';
//  imports: ... HttpClientModule ...
//  providers: ... HttpClientModule...

// Versão GitHub com Fellype Cazorino
// para gerar www novamente :
//  npm install
//  ionic serve
//  ionic cordova prepare
//


@Component({
 selector: 'page-home',
 templateUrl: 'home.html'
})

export class HomePage 
{

  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage, public alertCtrl: AlertController) 
  {
    console.log('\r\n > ***** Start App Ok !! *****\r\n');

   // console.log(this.get_Url('https://jsonplaceholder.typicode.com/users'));
   // console.log(this.txt = this.getUsers());

   this.Storage_Load( 'ip' );

  }

  apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
  users: any;
  txt: any;
 // _deviceIp = '192.168.1.10';
  _deviceOn = '/rele_on';
  _deviceOff = '/rele_off';  
  _deviceIpSet : string;
  _dataMater : string;

Storage_Save(dataToSave : string)  
{ 
   // set a key/value
  this.storage.set( dataToSave.split(',')[0], dataToSave.split(',')[1] );
  console.log('Salvo valor: ', dataToSave);

  return;
}
 
Storage_Load(keySearch : string)  
{
  // Or to get a key/value pair
  this.storage.get(keySearch).then((val) => { this._deviceIpSet = val; console.log('O valor recuperado foi: ', this._deviceIpSet); });
  
  return;
}


get_Url(_url : string )
{ 
  console.log( '> get_Url(): ' +'http://' + this._deviceIpSet.trim()  + _url);

  return new Promise(resolve => {
    this.http.get( 'http://' + this._deviceIpSet.trim() + _url).subscribe(data => {
      resolve(data); 
    }, err => {
      console.log(err);
    });
  });
}

getUsers() {

  console.log( '> getUsers(): ' + this.apiUrl);

  return new Promise(resolve => {
    this.http.get(this.apiUrl).subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}

getTxt() {
  return new Promise(resolve => {
    this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}

addUser(data) {
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'/users', JSON.stringify(data))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
}

showPrompt() 
{
  const prompt = this.alertCtrl.create({
    title: 'Configura IP',
    message: "Entre com o Ip da Controladora",
    inputs: [
      {
        name: 'AlertBoxInputData',
        placeholder: 'Ex: 192.168.100.155'
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        handler: data => {
          console.log('Cancelado ...');
        }
      },
      {
        text: 'Salvar',
        handler: data => {
          this._dataMater = data.AlertBoxInputData.trim();
          this.Storage_Save('ip,' + this._dataMater );
          console.log('Salvar ...' + this._dataMater ) ;
          this._deviceIpSet = this._dataMater ;
        }
      }
    ]
  });
  prompt.present();
}
}


