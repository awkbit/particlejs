import LinkedList from "./LinkedList.js";
import assert from "assert";

const ll = new LinkedList();

ll.push(1);
assert(ll.size === 1, "size is ok");
ll.push(2);
ll.push(3);
ll.push(4);
assert(ll.size === 4, "size is ok");
assert(ll.getAt(3) === 4, "getAt is ok");
ll.push(5);
ll.push(6);
ll.push(7);

const sliced = ll.slice(2, 4);

assert(ll.size === 5, "size is ok");
assert(sliced.size === 2, "size is ok");

sliced.shift(1);
assert(sliced.size === 3, "size is ok");
assert(ll.getAt(0) === 1, "getAt shift is ok");

assert(sliced.unshift() === 1, "unshift is ok");
assert(sliced.size === 2, "size is ok");
console.log(sliced.getAt(0));
assert(sliced.getAt(0) === 3, "getAt is ok");

// for (let val of ll) {
//   console.log("ll: ", val);
// }

// for (let val of sliced) {
//   console.log("sliced: ", val);
// }
