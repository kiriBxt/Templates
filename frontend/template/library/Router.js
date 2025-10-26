export default class Router {
  currPath = null;
  currModule = null;

  constructor(client) {
    this.client = client;
    this.initialize();
  }

  async getModule(path) {
    try {
      this.currModule = (await import(`../pages${path}/index.js`)).default;
    } catch (error) {
      console.error("Module load error:", error);
      this.route("/");
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

    this.client.listeners.clearEvents();

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
    window.addEventListener("click", async (e) => {
      if (e.target.matches("[link]") && e.target.closest("a")) {
        e.preventDefault();
        const path = e.target.getAttribute("href");
        await this.route(path);
      }
    });

    this.popstateHandler();
    if (!this.currPath) await this.route(location.pathname);
  }
}
