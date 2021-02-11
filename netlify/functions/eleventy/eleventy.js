const Eleventy = require("@11ty/eleventy");
const fs = require("fs");

exports.handler = async (event, context) => {
  let {} = event.queryStringParameters;
  let pageContent;

  try {
    process.env.ELEVENTY_CLOUD = process.env.DEPLOY_PRIME_URL || "";
    process.env.ELEVENTY_EXPERIMENTAL = true;
    
    process.chdir("./src/netlify/functions/eleventy/");

    let src = "./view.vue";
    console.log( src, "exists:", fs.existsSync(src) );

    let elev = new Eleventy(src);
    await elev.init();

    let json = await elev.toJSON();
    if(!json.length) {
      throw new Error(`Couldn’t find any generated output from Eleventy: ${JSON.stringify(json)}`);
    }

    pageContent = json[0].content;
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    }
  }

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=UTF-8"
    },
    body: pageContent,
    isBase64Encoded: false
  }
}