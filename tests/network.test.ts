import { describe, expect, it } from "vitest";
import { forward, initNet, makeData, trainStep } from "@/components/widgets/NNWidgets";

function accuracy(net: ReturnType<typeof initNet>, data: ReturnType<typeof makeData>, linear: boolean) {
  return data.filter((d) => (forward(net, d.x, d.y, linear).p > 0.5 ? 1 : 0) === d.label).length / data.length;
}

describe("playground network (the backprop students watch)", () => {
  it("one small gradient step lowers the loss", () => {
    const data = makeData("circle");
    const net = initNet(4, 3);
    const before = trainStep(structuredClone(net), data, 0, false); // lr 0: just the loss
    trainStep(net, data, 0.05, false);
    const after = trainStep(structuredClone(net), data, 0, false);
    expect(after).toBeLessThan(before);
  });

  it("a tanh hidden layer learns the circle", () => {
    const data = makeData("circle");
    const net = initNet(4, 1);
    for (let i = 0; i < 3000; i++) trainStep(net, data, 0.5, false);
    expect(accuracy(net, data, false)).toBeGreaterThan(0.95);
  });

  it("a tanh hidden layer learns XOR", () => {
    const data = makeData("xor");
    const net = initNet(4, 1);
    for (let i = 0; i < 3000; i++) trainStep(net, data, 0.5, false);
    expect(accuracy(net, data, false)).toBeGreaterThan(0.9);
  });

  it("without an activation it can't: stacked linear layers draw one straight line", () => {
    const data = makeData("circle");
    const net = initNet(8, 1);
    for (let i = 0; i < 3000; i++) trainStep(net, data, 0.5, true);
    expect(accuracy(net, data, true)).toBeLessThan(0.75);
  });
});
