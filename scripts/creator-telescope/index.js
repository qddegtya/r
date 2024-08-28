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
    $o("out").send("https://www.builder.io/m/explainers/composable-dxp");
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
const $c = new C({});

$startNode.O("out").connect($c.I("url"));
$c.O("post").connect($endNode.I("in"));

const flow = new Flow({});

flow.run($startNode);
