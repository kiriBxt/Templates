export default {
  async render(HTMLElement) {
    const res = await fetch("/pages/home/index.html");
    const html = await res.text();
    HTMLElement.innerHTML = html;
  },
  async execute(client = null) {
    console.log("hurenoshn");
  },
};
