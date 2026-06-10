export const COLA_LAYOUT = {
  name: "cola",
  animate: true,
  randomize: true,
  maxSimulationTime: 4000,
  padding: 30,
  nodeSpacing: 12,
  edgeLengthVal: 80,
};

export function runLayout(cy) {
  return cy.layout(COLA_LAYOUT).run();
}

export function fitGraph(cy) {
  cy.fit(undefined, 40);
}
