import { TransformNode, Port } from "@hlang-org/runtime";
import Piscina from "piscina";
import path from "node:path";

class CollectAgent extends TransformNode {
  constructor(opt) {
    super(opt);

    Port.I("url").attach(this);
    Port.O("post").attach(this);
  }

  _transform($i: any, $o: any): void {
    console.log('--- 🐝 CollectAgent ---');

    const piscina = new Piscina({
      filename: path.resolve(__dirname, "../workers/read-webpage.js"),
    });

    $i("url").receive(async (url) => {
      // dispatch job to piscina
      // with default thread pool config
      const post = await piscina.run({ url });
      $o("post").send(post);
    });
  }
}

export default CollectAgent;
