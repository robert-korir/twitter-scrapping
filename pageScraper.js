const { WEB_PERMISSION_TO_PROTOCOL_PERMISSION } = require("puppeteer");
// Save images to local storage
const saveImageLocally = async (imageUrl, imageName) => {
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
    const imagePath = path.join(__dirname, "images", imageName); // Save the image in the 'images' directory
    const imageStream = fs.createWriteStream(imagePath);
    imageResponse.data.pipe(imageStream);
    await new Promise((resolve, reject) => {
      imageStream.on("finish", resolve);
      imageStream.on("error", reject);
    });
    console.log("Image downloaded and saved locally:", imageName);
    return imagePath;
  } catch (error) {
    console.error("Error downloading and saving image:", error);
    throw error;
  }
};
// scrapper object
const scraperObject = {
  url: "https://twitter.com/coindesk",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    // Wait for the page to load completely
    try {
      await page.waitForSelector(
        'a[href="/CoinDesk"][aria-selected="true"].css-175oi2r',
        { timeout: 5000 }
      );
      console.log("Selector found!");
    } catch (error) {
      console.error("Selector not found within 5 seconds.");
    }
    console.log("------------------------");

    // tests
    // Wait for the posts to load completely (assuming they are dynamically loaded)
    try {
      await page.waitForSelector('[data-testid="tweet"]', { timeout: 10000 });
      console.log("Tweet elements found!");
    } catch (error) {
      console.error("Tweet elements not found within 10 seconds.");
    }
    // teste
    // Extract data from the page
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('[data-testid="tweet"]');
      let data = [];
      postElements.forEach((postElement) => {
        let postContent = postElement
          .querySelector('[data-testid="tweetText"]')
          .textContent.trim(); //   selector for post content
        console.log("==>>> ", postContent);
        let postVideo = postElement
          .querySelector(".r-1p0dtai")
          .textContent.trim(); //   selector for post video

        const postImageElement = postElement.querySelector("img");
        console.log("==>>> ", postImageElement);
        let postImage = null;

        if (postImageElement) {
          postImage = postImageElement.getAttribute("src");
        }
        // save image locally
        data.push({ content: postContent, image: postImage, video: postVideo });
      });
      return data;
    });

    console.log("=> ", posts);

    // Close the browser
    await browser.close();
    console.log("THE END! ");
  },
};

module.exports = scraperObject;
