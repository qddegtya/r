// TODO
const {
  ReadableNode,
  WriteableNode,
  Port,
  Flow,
} = require("@hlang-org/runtime");
const C = require("../../packages/mas/lib/nodes/C").default;
const T = require("../../packages/mas/lib/nodes/T").default;
const P = require("../../packages/mas/lib/nodes/P").default;

// Start
class StartNode extends ReadableNode {
  constructor(opt) {
    super(opt);

    Port.O("out").attach(this);
  }

  _read($o) {
    $o("out").send(process.env.POST_URL || "");

    setTimeout(() => {
      this.throw(new Error("error"));
    }, 10000);
  }
}

class GlobalExceptionHandlerNode extends WriteableNode {
  constructor(opt) {
    super(opt);

    Port.I("in").attach(this);
  }

  _write($i) {
    $i("in").receive((error) => {
      console.log(error);
    });
  }
}

// End
class EndNode extends WriteableNode {
  constructor(opt) {
    super(opt);

    Port.I("in").attach(this);
  }

  _write($i) {
    $i("in").receive((article) => {
      console.log(article);
    });
  }
}

const $startNode = new StartNode({});
const $endNode = new EndNode({});
const $globalExceptionHandlerNode = new GlobalExceptionHandlerNode({});
const $c = new C({});
const $t = new T({});

$startNode.O("out").connect($c.I("url"));
$c.O("post").connect($t.I("post"));
$t.O("post").connect($endNode.I("in"));

// $startNode.E().connect($globalExceptionHandlerNode.I("in"));

const flow = new Flow({});

flow.run($startNode);
