class Client {
  constructor() {
    this.HTMLElement = document.querySelector("main");
    this.listeners = new Listeners();
    this.router = new Router(this);
  }

  print() {
    console.log(this);
  }
}

class Router {
  currPath = null;
  currModule = null;

  constructor(client) {
    this.client = client;
    this.initialize();
  }

  async getModule(path) {
    try {
      this.currModule = (await import(`./pages${path}.js`)).default;
    } catch (error) {
      console.error("Module load error:", error);
    }
  }

  async middleware() {
    console.log("middleware check");
    return true;
  }

  async setModule() {
    if (!(await this.middleware())) return;
    await this.currModule.render(this.client.HTMLElement);
    await this.currModule.execute(this.client);
  }

  async route(path, { popstate = false } = {}) {
    if (path === this.currPath) return;
    if (path === "/") path = "/home";

    await this.getModule(path);
    await this.setModule();

    this.currPath = path;

    if (!popstate) {
      history.pushState({}, "", path);
    } else {
      history.replaceState({}, "", path);
    }
  }

  popstateHandler() {
    window.addEventListener("popstate", async () => {
      await this.route(location.pathname, { popstate: true });
    });
  }

  async initialize() {
    document.addEventListener("click", async (e) => {
      if (e.target.matches("[link]") && e.target.tagName === "A") {
        e.preventDefault();
        const path = e.target.getAttribute("href");
        await this.route(path);
      }
    });

    this.popstateHandler();
    if (!this.currPath) await this.route(location.pathname);
  }
}

class Listeners {
  list = [];
  add(action, element, func) {}
  clear() {}
}

const client = new Client();
