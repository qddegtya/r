import { TransformNode, Port } from "@hlang-org/runtime";
import Piscina from "piscina";
import path from "node:path";

class Hitl extends TransformNode {
  constructor(opt) {
    super(opt);

    Port.I("article").attach(this);
    Port.O("reviewedArticle").attach(this);
  }

  _transform($i: any, $o: any): void {
    $i("article").receive(async (post) => {
      // TODO
    });
  }
}

export default Hitl;
