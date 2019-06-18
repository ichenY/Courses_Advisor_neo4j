
const neo4j = require('neo4j-driver').v1;
// const uri = "http://localhost:7474/db/data/transaction/commit";
const uri = 'bolt://localhost:11001';
const driver = new neo4j.driver(uri, neo4j.auth.basic("jane", "jane"));
const session = driver.session();

const ID = 'CSUS';
const resultPromise = session.run(
  'MATCH (u:university {uniID: $uniID}) RETURN u',
  {uniID: ID}
);

resultPromise.then(result => {
  session.close();
  console.log(result.records.length);
 
  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.uniName);
  // on application exit:
})
.catch(e => {
	console.log(e);
})
.then(() => {
  	return session.close();
})
.then(() => {
  	return driver.close();
});

