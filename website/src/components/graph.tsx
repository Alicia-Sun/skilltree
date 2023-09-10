import { useEffect, useRef, useState } from "react";

type Node = {
  id: string;
  title: string;
  description: string;
};

type RefMap = Record<string, any>;

export default function Graph(props: {
  edges: [Node, Node][];
  layers: Node[][];
}) {
  const [showEdges, setShowEdges] = useState(false);
  const refs = useRef<RefMap>({});
  const edges = gedges;
  const layers = glayers;

  useEffect(() => {
    setShowEdges(true);
  }, []);

  console.log(refs.current);

  const edgeComps =
    showEdges &&
    edges.map((edge, i) => (
      <Edge
        from={refs.current[edge[0].id]}
        to={refs.current[edge[1].id]}
        key={i}
      />
    ));

  const layerComps = layers.map((layer) => (
    <Layer key={layer[0].id} nodes={layer} refs={refs.current} />
  ));

  return (
    <div className="relative flex flex-col items-center gap-y-12">
      {showEdges && edgeComps}
      {layerComps}
    </div>
  );
}

function Layer({ nodes, refs }: { nodes: Node[]; refs: RefMap }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-row content-around gap-x-4">
        {nodes.map((node) => (
          <Node refs={refs} key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

function Node({ node, refs }: { node: Node; refs: RefMap }) {
  const ref = useRef<any>();

  useEffect(() => {
    refs[node.id] = ref.current;
  }, [node.id, refs]);

  return (
    <div
      ref={ref}
      className="max-w-xs p-3 border border-gray-800 border-solid shadow-md cursor-pointer rounded-md hover:shadow-lg"
    >
      <h3 className="mb-2 font-semibold text-gray-700">{node.title}</h3>
      <p className="text-sm font-light whitespace-break-spaces">
        {node.description}
      </p>
    </div>
  );
}

function Edge({ from, to }: { from: HTMLDivElement; to: HTMLDivElement }) {
  return <PointerSVG from={from} to={to} />;
}

function makeLayerNums(layers: Node[][]) {
  const layerNums: Record<string, number> = {};
  for (let i = 0; i < layers.length; i++) {
    for (let j = 0; j < layers[i].length; j++) {
      layerNums[layers[i][j].id] = i;
    }
  }
  return layerNums;
}

const counting = {
  id: "counting",
  title: "Counting",
  description:
    "Counting is the process of determining the number of elements of a finite set of objects.",
};

const sets = {
  id: "sets",
  title: "Sets",
  description:
    "A set is a collection of distinct objects, considered as an object in its own right.",
};

const numberTheory = {
  id: "number-theory",
  title: "Number Theory",
  description: "Number theory is the study of the integers.",
};

const abstractAlgebra = {
  id: "abstract-algebra",
  title: "Abstract Algebra",
  description: "Abstract algebra is the study of algebraic structures.",
};

const stupid = {
  id: "stupid",
  title: "Kenneth Stupid Smart",
  description: "Kenneth Stupid Smart is a stupid smart person.",
};

const cryptography = {
  id: "cryptography",
  title: "Cryptography",
  description:
    "Cryptography is the practice and study of techniques for secure communication in the presence of third parties called adversaries.",
};

const gedges: [Node, Node][] = [
  [counting, numberTheory],
  [sets, numberTheory],
  [numberTheory, abstractAlgebra],
  [abstractAlgebra, cryptography],
  [abstractAlgebra, stupid],
];

const glayers = [
  [counting, sets],
  [numberTheory],
  [abstractAlgebra],
  [cryptography, stupid],
];

// whether it's going from left to right or right to left

type Point = {
  x: number;
  y: number;
};

function PointerSVG(props: { from: HTMLDivElement; to: HTMLDivElement }) {
  let { from, to } = props;

  const nodeDirection = calcNodeDirection(from, to);
  const curveStart = calcCurveStart(from, to);

  const fromrect = from.getBoundingClientRect();
  const torect = to.getBoundingClientRect();

  const fromheight = fromrect.height;
  const toheight = torect.height;

  console.log(nodeDirection, curveStart);

  if (nodeDirection[0] === "right") {
    const height = 10;
    const width = torect.left - fromrect.right;

    const x1 = 0;
    const y1 = fromheight / 2;
    const x2 = width;
    const y2 = toheight / 2;
    const top = from.offsetTop + toheight / 2;
    const left = from.offsetLeft + fromrect.width;

    return (
      <div style={{ position: "absolute", top, left }}>
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />
        </svg>
      </div>
    );
  }

  if (nodeDirection[0] === "left") {
    const height = 10;
    const width = fromrect.left - torect.right;

    const x1 = 0;
    const y1 = fromheight / 2;
    const x2 = width;
    const y2 = toheight / 2;
    const top = from.offsetTop + toheight / 2;
    const left = to.offsetLeft + width;

    return (
      <div style={{ position: "absolute", top, left }}>
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />
        </svg>
      </div>
    );
  }

  if (nodeDirection[0] === "bottom") {
    const height = torect.top - fromrect.bottom;
    const top = from.offsetTop + fromrect.height;
    let cp1, cp2, cp3, cp4, left, width;

    if (curveStart === "left") {
      width = Math.abs(
        fromrect.left + fromrect.width / 2 - (torect.left + torect.width / 2)
      );
      if (width === 0) width += 10;
      cp1 = [0, 0];
      cp2 = [0, height / 2];
      cp3 = [width, height / 2];
      cp4 = [width, height];
      left = from.offsetLeft + fromrect.width / 2;
    } else {
      width = Math.abs(
        fromrect.right - fromrect.width / 2 - (torect.right - torect.width / 2)
      );
      if (width === 0) width += 10;
      cp1 = [width, 0];
      cp2 = [width, height / 2];
      cp3 = [0, height / 2];
      cp4 = [0, height];
      left = to.offsetLeft + torect.width / 2;
    }

    return (
      <div style={{ position: "absolute", top, left }}>
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <path
            d={`M${cp1[0]} ${cp1[1]} C${cp2[0]} ${cp2[1]}, ${cp3[0]} ${cp3[1]}, ${cp4[0]} ${cp4[1]}`}
            stroke="black"
            fill="transparent"
          />
        </svg>
      </div>
    );
  }

  if (nodeDirection[0] === "top") {
    const height = fromrect.top - torect.bottom;
    const width = Math.abs(fromrect.left - torect.right);
    const top = to.offsetTop + torect.height;
    let cp1, cp2, cp3, cp4, left;

    if (curveStart === "left") {
      cp1 = [0, 0];
      cp2 = [0, height / 2];
      cp3 = [width, height / 2];
      cp4 = [width, height];
      left = to.offsetLeft + torect.width / 2;
    } else {
      cp1 = [width, 0];
      cp2 = [width, height / 2];
      cp3 = [0, height / 2];
      cp4 = [0, height];
      left = to.offsetLeft + torect.width / 2;
    }

    return (
      <div style={{ position: "absolute", top, left }}>
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <path
            d={`M${cp1[0]} ${cp1[1]} C${cp2[0]} ${cp2[1]}, ${cp3[0]} ${cp3[1]}, ${cp4[0]} ${cp4[1]}`}
            stroke="black"
            fill="transparent"
          />
        </svg>
      </div>
    );
  }

  return null;
}

// returns an array containing two elements:
// 1. a tuple which indicates which part of the node to start the svg from
// 2. a tuple which indicates whether to draw the curve from left to right or right to left
function calcNodeDirection(a: HTMLDivElement, b: HTMLDivElement) {
  const arect = a.getBoundingClientRect();
  const brect = b.getBoundingClientRect();

  if (arect.y === brect.y) {
    return arect.x < brect.x ? ["left", "right"] : ["right", "left"];
  }

  if (arect.y < brect.y) {
    return ["bottom", "top"];
  }

  return ["top", "bottom"];
}

// returns where to start from
function calcCurveStart(a: HTMLDivElement, b: HTMLDivElement) {
  const arect = a.getBoundingClientRect();
  const brect = b.getBoundingClientRect();

  return arect.x < brect.x ? "left" : "right";
}
