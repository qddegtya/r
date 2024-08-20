// TODO
import { ReadableNode, WriteableNode, Port, Flow } from '@hlang-org/runtime';
import C from '../../packages/mas/src/nodes/C';
import T from '../../packages/mas/src/nodes/T';
import P from '../../packages/mas/src/nodes/P';

// Start
class StartNode extends ReadableNode {
  constructor(opt) {
    super(opt)
  }

  _read($o: any): void {
      
  }
}

// End
class EndNode extends WriteableNode {
  constructor(opt) {
    super(opt)
  }

  _write($i: any): void {
      
  }
}
