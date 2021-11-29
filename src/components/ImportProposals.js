

const context = require.context('../proposals', true, /.json$/);

let Proposals = [];
context.keys().forEach((key) => {
  const fileName = key.replace('./', '');
  const proposalData = require(`../proposals/${fileName}`);
  Proposals.push(JSON.parse(JSON.stringify(proposalData)));
});

export default Proposals;
