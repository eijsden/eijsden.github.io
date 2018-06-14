/**
 * Created by Jaam on 2018-06-12.
 */
export class CardInfo {
  private _title: string;
  private _subtitle: string;
  private _content: any;
  private _src: string;
  private _avatarsSrc: string;
  private _actions: boolean;

  constructor(title: string){
    this._title = title;
  }


  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get subtitle(): string {
    return this._subtitle;
  }

  set subtitle(value: string) {
    this._subtitle = value;
  }

  get content(): any {
    return this._content;
  }

  set content(value: any) {
    this._content = value;
  }

  get src(): string {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
  }

  get avatarsSrc(): string {
    return this._avatarsSrc;
  }

  set avatarsSrc(value: string) {
    this._avatarsSrc = value;
  }


  get actions(): boolean {
    return this._actions;
  }

  set actions(value: boolean) {
    this._actions = value;
  }
}
