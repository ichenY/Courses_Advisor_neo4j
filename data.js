var express = require('express'),
	util = require('util'),
	app = express(),
	path = require('path');
	// MongoClient = require('mongodb').MongoClient, 
	// Server = require('mongodb').Server;


const neo4j = require('neo4j-driver').v1;
const uri = 'bolt://localhost:11001';

app.use( '/', express.static(path.join(__dirname , '..')));


// Define index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname +'/index.html'));
	console.log("File sent to client");
});





//route the given url to get corresponding function

app.get('/entity' , (req, res) => {
	var query = JSON.parse(decodeURIComponent(req._parsedUrl.query))
	let keyword = query['keyword'];
	console.log(query);
	
	// const uri = "http://localhost:7474/db/data/transaction/commit";
	const driver = new neo4j.driver(uri, neo4j.auth.basic("jane", "jane"));
	const session = driver.session();
	var command_u = `MATCH (u:university)--(s:subject)--(c:courses) WHERE toLower(u.uniName) CONTAINS "${keyword}" RETURN DISTINCT(u.uniName),s.subName`;
	var command_s = `MATCH (u:university)--(s:subject)--(c:courses) WHERE toLower(s.subName) CONTAINS "${keyword}" RETURN DISTINCT s.subID,s.subName`;
	var command_c = `MATCH (u:university)--(s:subject)--(c:courses) WHERE toLower(c.courseName) CONTAINS "${keyword}" RETURN c.courseName,c.courseID,c.courseSubjectOf,c.courseDescription,c.coursePrerequisite,c.courseFormat,c.courseTerm,c.similarTo`;
	var command_none = `MATCH (n) RETURN n`;
	var command_sim = `MATCH (c:courses {courseID:"${keyword}"}) return c.courseID,c.courseName,c.courseTerm,c.courseUnit,c.courseDescription`;


	if(query['className'] == 'course number'){
		dict = {};
		const resultPromise = session.run(
		command_sim
		);
		resultPromise.then(result => {
		dict['courseNum'] = result.records.map(x =>x.get('c.courseID'));
		dict['course_n'] = result.records.map(x =>x.get('c.courseName'));
		dict['term_n'] = result.records.map(x =>x.get('c.courseTerm'));
		dict['unit_n'] = result.records.map(x =>x.get('c.courseUnit'));
		dict['description_n'] = result.records.map(x =>x.get('c.courseDescription'));
		console.log(dict);
		res.send(dict);
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
	} //end of cnum

	if(query['className'] == 'courses'){
		dict = {};
		const resultPromise = session.run(
		command_c
		);

		resultPromise.then(result => {
			dict['courses'] = result.records.map(x =>x.get('c.courseName'));
			dict['term_c'] = result.records.map(x =>x.get('c.courseTerm'));
			dict['id_c'] = result.records.map(x =>x.get('c.courseID'));
			dict['similar_c'] = result.records.map(x =>x.get('c.similarTo'));
			dict['subject_c'] = result.records.map(x =>x.get('c.courseSubjectOf'));
			dict['format_c'] = result.records.map(x =>x.get('c.courseFormat'));
			dict['prerequisite_c'] = result.records.map(x =>x.get('c.coursePrerequisite'));
			dict['description_c'] = result.records.map(x =>x.get('c.courseDescription'));
			// dict['format_c'] = result.records.map(x =>x.get('c.courseFormat'));
			// nodes = result.records.map(x =>x.get('c.courseName'));
			// var nodes_rm = nodes.map(x=>x.replace(",",""))
			console.log(result.records.length);
			console.log(dict);
			res.send(dict);
			// res.send(JSON.stringify(nodes, null, 2));
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


	} //end of if


	if(query['className'] == 'university'){
		var dict = {};
		const resultPromise = session.run(
		// query
		command_u
		);

		resultPromise.then(result => {
			// nodes = result.records.map(x =>x.get('(u.uniName)')+'\n');
			dict['university'] = result.records.map(x =>x.get('(u.uniName)'));
			dict['subject_u'] = result.records.map(x =>x.get('s.subName'));
			console.log(result.records.length);

			/*
			const singleRecord = result.records[0];
			const node = singleRecord.get(0);
			console.log(node.properties.courseID);
			console.log(node.properties.courseName);
			*/
			console.log(dict);
			res.send(dict);
			// res.send(JSON.stringify(nodes, null, 2));
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


	}//end of uni



	if(query['className'] == 'subject'){
		var dict = {};
		const resultPromise = session.run(
		command_s
		);

		resultPromise.then(result => {
			dict['subject'] = result.records.map(x =>x.get('s.subName'));
			dict['subid_s'] = result.records.map(x =>x.get('s.subID'));
			// dict['course_s'] = result.records.map(x =>x.get('c.courseName'));
			console.log(result.records.length);
			console.log(dict);
			res.send(dict);
			// res.send(JSON.stringify(nodes, null, 2));
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


	}//end of subject





});
// app.get('/subject' , (req, res) => {
// 	var query = JSON.parse(decodeURIComponent(req._parsedUrl.query))
// 	let sub = query['subject'];
// 	const resultPromise = session.run(
// 		`MATCH (s:subject {subID:"${sub}"}) RETURN s.subName`
// 		);

// 	resultPromise.then(result => {
// 		var data = result.records.map(x =>x.get('(s.subName)'));
// 		res.send(data);
		
// 	})
// 	.catch(e => {
// 		console.log(e);
// 	})
// 	.then(() => {
// 		return session.close();
// 	})
// 	.then(() => {
// 		return driver.close();
// 	});

// });



	// if(query['className'=='class name']){
	// 	const resultPromise = session.run(
	// 	command_none
	// 	);
	// 	resultPromise.then(result => {
	// 		res.send(result);
	// 	})
	// 	.catch(e => {
	// 		console.log(e);
	// 	})
	// 	.then(() => {
	// 		return session.close();
	// 	})
	// 	.then(() => {
	// 		return driver.close();
	// });


	// }

	// const resultPromise = session.run(
	// 	// query
	// 	'MATCH (u:university {uniID: $uniID})--(s:subject {subID:$subID})--(c:courses) RETURN c',
	// 	{uniID: '', subID: input_sub}
	// 	);

	// resultPromise.then(result => {
	// 	nodes = result.records.map(x =>util.inspect(x.get(0).properties))
	// 	console.log(result.records.length);

	// 			/*
	// 			const singleRecord = result.records[0];
	// 			const node = singleRecord.get(0);
	// 			console.log(node.properties.courseID);
	// 			console.log(node.properties.courseName);
	// 			*/
	// 	console.log(nodes);
	// 	res.send(nodes);
	// 			// res.send(JSON.stringify(nodes, null, 2));
	//   			// on application exit:
	// })





// Set up port 3001
app.listen(3001, () => console.log('Navigate to http://localhost:3001'));

