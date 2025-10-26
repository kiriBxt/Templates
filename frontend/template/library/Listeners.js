export default class Listeners {
  events = [];
  timeouts = [];
  addEvent(element, action, func) {
    if (!element || !action || !func) return;
    element.addEventListener(action, func);
    this.events.push({ element, action, func });
  }

  clearEvents() {
    for (const { element, action, func } of this.events) {
      element.removeEventListener(action, func);
    }
    this.events = [];
  }
  addTimout() {}
}
