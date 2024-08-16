import { TransformNode, Port } from "@hlang-org/runtime";

// TODO
class Inference extends TransformNode {
  constructor(opt) {
    super(opt);

    Port.O("o").attach(this);
  }

  _transform($i: any, $o: any): void {
      
  }
}
