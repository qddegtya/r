import { TransformNode, Port } from "@hlang-org/runtime";
import Piscina from "piscina";
import path from "node:path";

class TransformAgent extends TransformNode {
  constructor(opt) {
    super(opt);

    Port.I("post").attach(this);
    Port.O("post").attach(this);
  }

  _transform($i: any, $o: any): void {
    $i("post").receive(async (post) => {
      console.log("--- 🐝 TransformAgent receive one task ---");
      
      const piscina = new Piscina({
        filename: path.resolve(__dirname, "../workers/to-zh-cn.js"),
      });

      // dispatch job to piscina
      // with default thread pool config
      const zhCnPost = await piscina.run({ post });
      $o("post").send(zhCnPost);
    });
  }
}

export default TransformAgent;
