import { Injectable } from '@angular/core';

@Injectable()
export class LifeService {

 constructor() { }

  public life = 3;

  get() {
    return this.life;
  }

  increment() {
    this.life++;
  }

  decrement() {
    this.life--;
  }

  set(life) {
    this.life = life;
  }

}
