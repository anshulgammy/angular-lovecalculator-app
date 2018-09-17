import { Component } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


//declare var calculate:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  firstFullName;
  secondFullName;
  finalResult: string = "";
  serverURL = "http://10.236.148.47:9999";
  ip: string = "NA";

  constructor(private http: HttpClient) {

  }

  calculateLove = function() {
    this.calc(this.firstFullName, this.secondFullName);
  }  

  calc = function(cnameone, cnametwo) {
    if (cnameone.length < 1 || cnametwo.length < 1) {
      console.log("Please provide proper inputs!");
      return;
    }
    cnameone = cnameone.toLowerCase();
    cnametwo = cnametwo.toLowerCase();
    var totalNum = this.getNum(cnameone) * this.getNum(cnametwo);
    var finalScore = totalNum % 100;
        if(finalScore <= 15) {
          finalScore=43;
        }
        if(finalScore==0) {
          finalScore=10;
        }
        if(finalScore==28) {
          finalScore=80;
        }
    this.finalResult = finalScore + "%";
    this.sendDataToServer(cnameone, cnametwo, this.finalResult);
  };

  trimAll = function(A)  {
    while (A.substring(0, 1) == " ") {
      A = A.substring(1, A.length);
    }
    while (A.substring(A.length - 1, A.length) == " ") {
      A = A.substring(0, A.length - 1);
    }
    return A;
  }

  getNum = function(A) {
		var outputNum = 0;
		for (var i = 0; i < A.length; i++) {
			outputNum += A.charCodeAt(i);
		}
		return outputNum;
  };
  
  sendDataToServer = function(fName, sName, result) {
    this.socket = io.connect(this.serverURL);
    var machineInfo = this.getIpAddress();
    machineInfo.subscribe( data => {
      this.socket.emit('user_ip', data);
    })
    var emittedMessage = "Application used for : fName : " + fName + " sName : " + sName + " result is : " + result + " IP is : " + machineInfo;
    this.socket.emit('user_data', emittedMessage);
  }

  getIpAddress() {
    return this.http
          .get('http://freegeoip.net/json/?callback')
          .map(response => response || {});
  }
}
