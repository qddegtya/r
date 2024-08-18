import { TransformNode, Port } from "@hlang-org/runtime";

class CollectAgent extends TransformNode {
  constructor(opt) {
    super(opt);

    Port.I("urls").attach(this);
    Port.O("posts").attach(this);
  }

  _transform($i: any, $o: any): void {
    $i("urls").receive((urls) => {
      
    })
  }
}

export default CollectAgent;
