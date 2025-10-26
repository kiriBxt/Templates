import Listeners from "./Listeners.js";
import Router from "./Router.js";

export default class Client {
  user = null;
  constructor() {
    this.HTMLElement = document.querySelector("#root");

    this.listeners = new Listeners();
    this.router = new Router(this);
  }

  print() {
    console.log(this);
  }
}
