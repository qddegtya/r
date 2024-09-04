import { Port, WriteableNode } from "@hlang-org/runtime";
import Piscina from "piscina";
import path from "node:path";

class PublishAgent extends WriteableNode {
  constructor(opt) {
    super(opt);

    Port.I("post").attach(this);
  }

  _write($i) {
    $i("post").receive(async (post) => {
      const piscina = new Piscina({
        filename: path.resolve(__dirname, "../workers/publish-post.js"),
      });

      // dispatch job to piscina
      // with default thread pool config
      await piscina.run({ post });
    });
  }
}

export default PublishAgent;
