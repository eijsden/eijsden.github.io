import {Component, HostListener, OnInit} from '@angular/core';
import {CardInfo} from '../../classes/card-info';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  name = 'Jimmie Van Eijsden';
  title = 'IT-Consultant';

  cards: CardInfo[] = [];
  photoCard = [this.getPhotoCard()];

  constructor() { }

  ngOnInit() {
    //this.cards.push(this.getPhotoCard());
    this.cards.push(this.getInfoCard("About"));
    this.cards.push(this.getEducationCard("Education"));
  }

  getPhotoCard(){
    const photoCard = new CardInfo("Jimmie Van Eijsden");
    photoCard.subtitle = "IT Consultant";
    photoCard.src = "../../assets/img/profile-pic.jpg";
    photoCard.actions = false;
    return photoCard;
  }

  getInfoCard(title){
    const infoCard = new CardInfo(title);
    var d = new Date("1991-03-01");
    var n = d.getFullYear();
    infoCard.content = {
      Title: this.title,
      Age: (2018 - 1991),
      City: "Luleå",
      Country: "Sweden"
    };
    infoCard.actions = true;
    return infoCard;
  }


  getEducationCard(title){
    const eduCard = new CardInfo(title);
    eduCard.content = {
      Elementary:  {
        Name: "Stenkulan",
        Location: "Stenkullen, Gothenburg",
      },
      College: {
        Name: "Lerums Gymnasium",
        Location: "Lerum, Sweden",
        Subject: "Natural Science"
      },
      University: {
        Name: "Luleå University of Technology",
        Location: "Luleå, Sweden",
        Subject: "Md. Computers Science"
      }
    };


    eduCard.actions = true;
    return eduCard;
  }



}
