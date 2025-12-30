// Node factory function for tree nodes
function Node(data, left = null, right = null) {
  return { data, left, right };
}

// prettyPrint helper from The Odin Project
function prettyPrint(node, prefix = "", isLeft = true) {
  if (node === null) return;

  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }

  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
}

function uniqueSortedArray(values) {
  const unique = Array.from(new Set(values));
  unique.sort((a, b) => a - b);
  return unique;
}

function buildBalancedTree(sortedArray, start = 0, end = sortedArray.length - 1) {
  if (start > end) return null;

  const mid = Math.floor((start + end) / 2);
  const root = Node(sortedArray[mid]);

  root.left = buildBalancedTree(sortedArray, start, mid - 1);
  root.right = buildBalancedTree(sortedArray, mid + 1, end);

  return root;
}

function insertRecursive(current, value) {
  if (current === null) return Node(value);

  if (value === current.data) return current;

  if (value < current.data) {
    current.left = insertRecursive(current.left, value);
  } else {
    current.right = insertRecursive(current.right, value);
  }

  return current;
}

function findMinNode(node) {
  let current = node;
  while (current && current.left !== null) current = current.left;
  return current;
}

function deleteRecursive(current, value) {
  if (current === null) return null;

  if (value < current.data) {
    current.left = deleteRecursive(current.left, value);
    return current;
  }

  if (value > current.data) {
    current.right = deleteRecursive(current.right, value);
    return current;
  }

  if (current.left === null && current.right === null) return null;
  if (current.left === null) return current.right;
  if (current.right === null) return current.left;

  const successor = findMinNode(current.right);
  current.data = successor.data;
  current.right = deleteRecursive(current.right, successor.data);
  return current;
}

function findRecursive(current, value) {
  if (current === null) return null;
  if (value === current.data) return current;
  if (value < current.data) return findRecursive(current.left, value);
  return findRecursive(current.right, value);
}

function inorderRecursive(node, callback, values) {
  if (node === null) return;
  inorderRecursive(node.left, callback, values);
  callback ? callback(node) : values.push(node.data);
  inorderRecursive(node.right, callback, values);
}

function preorderRecursive(node, callback, values) {
  if (node === null) return;
  callback ? callback(node) : values.push(node.data);
  preorderRecursive(node.left, callback, values);
  preorderRecursive(node.right, callback, values);
}

function postorderRecursive(node, callback, values) {
  if (node === null) return;
  postorderRecursive(node.left, callback, values);
  postorderRecursive(node.right, callback, values);
  callback ? callback(node) : values.push(node.data);
}

function heightRecursive(node) {
  if (node === null) return -1;
  return Math.max(heightRecursive(node.left), heightRecursive(node.right)) + 1;
}

function depthRecursive(root, node, depth = 0) {
  if (root === null || node === null) return -1;
  if (root === node) return depth;
  if (node.data < root.data) return depthRecursive(root.left, node, depth + 1);
  return depthRecursive(root.right, node, depth + 1);
}

function isBalancedRecursive(node) {
  if (node === null) return { balanced: true, height: -1 };

  const left = isBalancedRecursive(node.left);
  if (!left.balanced) return { balanced: false, height: 0 };

  const right = isBalancedRecursive(node.right);
  if (!right.balanced) return { balanced: false, height: 0 };

  const balanced = Math.abs(left.height - right.height) <= 1;
  const height = Math.max(left.height, right.height) + 1;

  return { balanced, height };
}

function recursiveLevelOrder(nodes, callback, values) {
  if (!nodes.length) return;

  const next = [];
  for (const node of nodes) {
    if (!node) continue;
    callback ? callback(node) : values.push(node.data);
    if (node.left) next.push(node.left);
    if (node.right) next.push(node.right);
  }

  recursiveLevelOrder(next, callback, values);
}

// Tree "class"
function Tree(array = []) {
  const sortedUnique = uniqueSortedArray(array);
  let root = buildBalancedTree(sortedUnique);

  function insert(value) {
    root = insertRecursive(root, value);
  }

  function deleteValue(value) {
    root = deleteRecursive(root, value);
  }

  function find(value) {
    return findRecursive(root, value);
  }

  function levelOrder(callback) {
    if (root === null) return callback ? undefined : [];
    const queue = [root];
    const values = [];

    while (queue.length) {
      const node = queue.shift();
      callback ? callback(node) : values.push(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return callback ? undefined : values;
  }

  function recursiveLevelOrderPublic(callback) {
    if (root === null) return callback ? undefined : [];
    const values = [];
    recursiveLevelOrder([root], callback, values);
    return callback ? undefined : values;
  }

  function inorder(callback) {
    const values = [];
    inorderRecursive(root, callback, values);
    return callback ? undefined : values;
  }

  function preorder(callback) {
    const values = [];
    preorderRecursive(root, callback, values);
    return callback ? undefined : values;
  }

  function postorder(callback) {
    const values = [];
    postorderRecursive(root, callback, values);
    return callback ? undefined : values;
  }

  function height(node) {
    return heightRecursive(node);
  }

  function depth(node) {
    return depthRecursive(root, node);
  }

  function isBalanced() {
    return isBalancedRecursive(root).balanced;
  }

  function rebalance() {
    const values = inorder();
    root = buildBalancedTree(values);
  }

  return {
    get root() {
      return root;
    },
    insert,
    delete: deleteValue,
    find,
    levelOrder,
    recursiveLevelOrder: recursiveLevelOrderPublic,
    inorder,
    preorder,
    postorder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
}

// -------------------------
// Driver script (Odin steps)
// -------------------------

function randomArray(length, max = 100) {
  return Array.from({ length }, () => Math.floor(Math.random() * max));
}

const initialArray = randomArray(10);
console.log("Initial array:", initialArray);

const tree = Tree(initialArray);
console.log("\nInitial tree:");
prettyPrint(tree.root);

console.log("Is balanced?", tree.isBalanced());
console.log("Level-order:", tree.levelOrder());
console.log("Preorder:", tree.preorder());
console.log("Inorder:", tree.inorder());
console.log("Postorder:", tree.postorder());

tree.insert(150);
tree.insert(200);
tree.insert(250);
tree.insert(300);

console.log("\nAfter inserts (unbalanced):");
prettyPrint(tree.root);
console.log("Is balanced?", tree.isBalanced());

tree.rebalance();

console.log("\nAfter rebalance:");
prettyPrint(tree.root);
console.log("Is balanced?", tree.isBalanced());
console.log("Level-order:", tree.levelOrder());
console.log("Preorder:", tree.preorder());
console.log("Inorder:", tree.inorder());
console.log("Postorder:", tree.postorder());
