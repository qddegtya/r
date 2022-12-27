import { Probot } from "probot";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const newFav = context.issue({
      body: "🐝 bee collection action done.",
    });

    // TODO
    
    await context.octokit.issues.createComment(newFav);
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
