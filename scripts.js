// Empty JS for your own code to be here
$(document).ready(function () {
	$('.dropdown-item').click(function() {
		$('#dropdownMenu').text($(this).text())
	});
});

$(document).ready(function () {
	$(".btn-primary").click(function(e){
		e.preventDefault(); 
		let className = $('#dropdownMenu').text().toLowerCase();
		let keyword = document.getElementById('keyword').value;

		// var query = `MATCH (u:${className})`;
		// if(className == 'university'){
		// 	query += `WHERE toLower(u.uniName) CONTAINS "${keyword}"` ;
		// }else if (className == 'subject'){
		// 	query += `WHERE toLower(u.subName) CONTAINS "${keyword}"` ;
		// }else if (className == 'courses'){
		// 	query += `WHERE toLower(u.courseName) CONTAINS "${keyword}"` ;
		// }else{ 
		// 	query = `MATCH (u)`;

			//no need
			//No class specified
			// $('#myModal').on('show.bs.modal', function (e) {
			//   	$('.modal-body').text('You didn\'t specify any constraint.');
			// }).modal("show")
			// query = `MATCH (u)`;
		// }
		// query += `RETURN u`

		// console.log(query)

	    $.ajax({
	        async: false,
	        dataType: 'json', 
	        type: 'GET',
	        url: './entity',
	        data: JSON.stringify({className:className,keyword:keyword}), 
	        // data: JSON.stringify(query), 
	        success: function (data) {
	        	var uniList = {"CSUS":"California State University, Sacramento","AshFord":"Ashford University","CalPoly":"California Polytechnic State University"};
	        	console.log(data);
	        	// document.getElementById("result").innerHTML = data;
	        	


	        	//$('#result').text( JSON.stringify(data, undefined, 2) );
	        	// $('#table').text(data[0]['uniName']);
	        	
	        	if(data){
	        		console.log(data); //show in chrome
	        		if(data.university){
	        		$("#table td").remove();
	        		$("#table th").remove();
	        		var len_u = data.university.length;
	        		// var len_s = data.subject_u.length;
	        		var txt = "";
	        		console.log(len_u+"123");
	        		if(len_u>0){
	        			var txt = "";
	        			txt += "<tr> <th>University</th>  <th>  Subject</th> </tr> <tr>"
	        			for(var i=0;i<len_u;i++){
	        				if(data.university[i]){
	        					txt += "<td>"+data.university[i]+"</td>";
	        					txt += "<td>"+"  "+data.subject_u[i]+"</td>";
	        					txt += "</tr>"
	        				}
	        			}
	        			
	        			
	        			if(txt!=""){
	        				$("#table").append(txt).removeClass("hidden");
	        			}
	        		}	        			

	        		}
	        		if(data.courses){
	        			$("#table td").remove();
	        			$("#table th").remove();
		        		var len_c = data.courses.length;
		        		var txt = "";
		        		console.log(uniList[data.subject_c[0].split("_")[0]]);
		        		if(len_c>0){
		        			//<th>  Description</th> </tr>
		        			// txt += "<tr> Similar Course</th> <th>  Term</th> <th>  Subject</th> <th>  University</th>  <th>  Description</th><tr>";
		        			for(var i=0;i<len_c;i++){
		        				if(data.courses[i]){
		        					// $.ajax({
		        					// 	async: false,
	        						// 	dataType: 'json', 
						         //        type: 'GET',
						         //        url: "./subject",
						         //        data:JSON.stringify({subject:data.subject_c[i]}),
						         //        success: function (data) {
						         //        	console.log(data);

						         //        }
						         //    });
		        					let code = uniList[data.subject_c[i].split("_")[0]];
		        					txt += "<table><tr><td><b>Course</b>: "+data.courses[i]+"</td></tr>";
		        					txt += "<tr><td><b>Course Number</b>: "+data.id_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>Similar Course</b>: "+data.similar_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>Term</b>: "+data.term_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>Subject</b>: "+data.subject_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>University</b>: "+code+"</td></tr>";
		        					txt += "<tr><td><b>Format</b>: "+data.format_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>Prerequisite</b>: "+data.prerequisite_c[i]+"</td></tr>";
		        					txt += "<tr><td><b>Description</b>: "+data.description_c[i]+"\n\n</td></tr></table>";

		        				}
		        			}
		        	
		        			if(txt!=""){
		        				$("#table").append(txt).removeClass("hidden");
		        			}
		        		}

	        		}//end of course
	        		if(data.subject){
	        			$("#table td").remove();
	        			$("#table th").remove();
		        		var len_c = data.subject.length;
		        		var txt = "";
		        		console.log(data.courseFormat+"123");
		        		if(len_c>0){
		        			txt += "<tr> <th>Subject</th>  <th>  University/Id</th> </tr> <tr>";
		        			for(var i=0;i<len_c;i++){
		        				if(data.subject[i]){
		        					txt += "<td>"+data.subject[i]+"</td>";
		        					txt += "<td>"+"  "+data.subid_s[i]+"</td></tr>";
		        					// txt += "<td>"+"  "+data.course_s[i]+"</td> </tr>";

		        				}
		        			}
		        	
		        			if(txt!=""){
		        				$("#table").append(txt).removeClass("hidden");
		        			}
		        		}

	        		}//end of subject

	        		if(data.courseNum){
	        			$("#table td").remove();
	        			$("#table th").remove();
	        			var len_c = data.courseNum.length;
		        		var txt = "";
		        		console.log(data+"123");
		        		if(len_c>0){
		        			txt += "<tr> <th>Course Number</th>  <th>  Course</th> <th>  Term</th> <th>  Units</th> <th>  Description</th></tr> <tr>";
		        			for(var i=0;i<len_c;i++){
		        				if(data.courseNum[i]){
		        					txt += "<td>"+data.courseNum[i]+"</td>";
		        					txt += "<td>"+"  "+data.course_n[i]+"</td>";
		        					txt += "<td>"+"  "+data.term_n[i]+"</td>";
		        					txt += "<td>"+"  "+data.unit_n[i]+"</td>";
		        					txt += "<td>"+"  "+data.description_n[i]+"</td></tr>";
		        					// txt += "<td>"+"  "+data.course_s[i]+"</td> </tr>";

		        				}
		        			}
		        	
		        			if(txt!=""){
		        				$("#table").append(txt).removeClass("hidden");
		        			}
		        		}




	        		}





			    } //end of data


	        },

	        // error: function(jqXHR, textStatus, errorThrown){
         //    alert('error: ' + textStatus + ': ' + errorThrown);
	    });

	});

});

