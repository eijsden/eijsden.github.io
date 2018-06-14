import {Component, HostListener, OnInit} from '@angular/core';
import {CardInfo} from '../classes/card-info';

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
    photoCard.src = "https://lh3.googleusercontent.com/OiJr4taSQgx4f3L9CLzg-p-veZidZ7X7WvV7Zew87JrX4zVGWso4PYQnzl6V_3CKG_MDQEqWzvKUSir1Qcp1TP3j74Hg9ljGusACMQRI6O-juTL7iP2IRSsh1_PolpXOFC4ltfz0HholX1bYb2XgzmFwmFJRq_sdq3TMldR5stGIs_Bd-uhwuCNO_jponu-GuYCrLtw5TIiobanLHmH5z8Ucyg9RnE-VYVD_xFsrhOvwF8HTyuC-LlLfifszZAoCcLZ7vckudmAv_Q4KcV0izWlgbk64o6y2HKbZVxQ2JnvWZ9lhlq0DNqWk3SOW2g4YzfZztdC6_zBnJZED8EMVp_NL6QnhkiK3XhanuaVv_qcEORYwVJDYjUTI4FYQdm-EgKns6h29IlHBl9iVySitOyYzouFhb12SklF_Sa6ufrfBT38SXFo8PitmwOd08OP7x7cABzcNW0ew9Jh-sAfRj0E-eXPED_Ba2viiqulKkAuPcjp5vaBRH52-VdC5DtUW5WCgRv1izSrav2ZyNwO7rFVz9CLB7-P3BHhSu1biOsuGf1lYRhL9KSWNbSvDG-eBi1-iSNvRaS-T0dutpXAoIQo-XVQoD9hMipzOT_0=w828-h1103-no"
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
