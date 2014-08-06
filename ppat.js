var xmlDoc;
var powerCase;
var powerCategory;
var performanceCategory;
var performanceCase;
var powerDevice;
var deviceCategory;
var powerAdvancedCase;
var	platform;
var boardDevice;
var powerAdvCategory;
var device;
var testType;
var testcases="";
var countOfCmds=1;
function ppat_load(buildtype){
    var strURL = "http://10.38.32.97:3000/scenarios";
            $.ajax({
              type: "GET",
              url: strURL,
              timeout:3000,
              dataType:'html',
              success: function(msg){
                    powerCase = new Array();
                    powerCategory = new Array();
                    performanceCategory = new Array();
                    performanceCase = new Array();
                    powerDevice = new Array();
                    deviceCategory = new Array();
                    boardDevice = new Array();
					platform = new Array();
					powerAdvancedCase = new Array();
					powerAdvCategory = new Array();
                    domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(msg, 'text/xml');
                    ppat_parsePowerNode();
					ppat_parseAdvancedPowerNode();
                    ppat_parsePerformanceNode();
                    ppat_parseDeviceNode();
                    ppat_parseBoardDevice();
                    generateUI(buildtype);
                    ppat_load_testcase();
              }
            });
}

function ppat_update_checkbox(id,stream, duration){
    $("."+id).attr("checked",true);
    testcases += "{\"CaseName\":\"" + id + "\",";
    testcases += "\"Stream\":\"" + stream + "\",";
    testcases += "\"Duration\":\"" + duration + "\"},";
}

function showAPM(id,target){
	if($("#"+id).attr("checked")){
		$("#"+target).css("display", "block");
    }else{
		$("#"+target).css("display", "none");
    }
}

function addCmd(){
	$("#add").before("<div id=\"div_" + countOfCmds + "\"></div>");
	$("#div_" + countOfCmds).append("<b>Input commands before run test cases:</b></br>");
    $("#div_" + countOfCmds).append("Description of set of cmds:<input id=" + countOfCmds + "r type=\"text\" name=\"reason\"></input> </br><textarea id=" + countOfCmds + " cols=\"60\" rows=\"10\"></textarea><img src=\"delete.png\" onclick=\"demiss(div_" + countOfCmds + ")\"></img></br>");
    countOfCmds +=1;
}
function demiss(id){
	$(id).remove();
}

function ppat_load_testcase(){
    var audioURL = "http://10.38.32.97:3000/tc/audio";
    $.ajax({
        type: "GET",
        url: audioURL,
        timeout:3000,
        dataType:'html',
        success: function(data){
             var audio_xml = new DOMParser().parseFromString(data, 'text/xml');
             $(audio_xml).find('Resource').each(function(i){
                var audio = '<input align=\"left\" onclick=ppat_update_checkbox(\"mp3\",\"'+ $(this).find("Name").text() + '\",\"'+ $(this).find("Duration").text() +'\") type=\"radio\" name=\"testcase_audio\" value=\"testcase_audio\">'+ $(this).find("Name").text() + '</input></br>';
                audio +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"><b>Duration:' + '</b>' +$(this).find("Duration").text() + 's</div>';
                audio +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"><b>Description:' + '</b>' +$(this).find("Description").text() +'</div>';
                $("#mp3").append(audio);
            });

        }
    });
    var videoURL = "http://10.38.32.97:3000/tc/video";
    $.ajax({
        type: "GET",
        url: videoURL,
        timeout:3000,
        dataType:'html',
        success: function(msg){
             var video_xml = new DOMParser().parseFromString(msg, 'text/xml');
             $(video_xml).find('Resource').each(function(i){
                 var checkbox = '<input onclick=ppat_update_checkbox(\"' + $(this).find("CaseName").text() + '\",\"'+ $(this).find("Name").text() + '\",\"'+ $(this).find("Duration").text() +'\")  type=\"radio\" name=\"testcase\" value=\"testcase\">'+ $(this).find("Name").text() + '</input></br>';
                 checkbox +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"><b>FPS:' + '</b>' +$(this).find("FPS").text() + '</div>';
                 checkbox +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"><b>Duration:' + '</b>' +$(this).find("Duration").text() + 's</div>';
                 checkbox +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"><b>Description:' + '</b>' + $(this).find("Description").text() + '</div>';
                 checkbox +='<div style=\"margin:3px 0 0 0; padding:0 0 0 27px; font-family:Arial; font-size:12px; color:#3b3a2b; line-height:25px; text-decoration:none\"}><b>Description:' + '</b>' + $(this).find("StreamModule").text() + '</div>';
                 $("#" + $(this).find("CaseName").text()).append(checkbox);
            });
        }
    });

}

function ppat_parseBoardDevice(){
	$(xmlDoc).find("Board").each(function(){
		var str = "{";
		str += "\"type\":\"" + $(this).find("Type").text() + "\",";
		var modules = new Array();
		$(this).find("Name").each(function(){
			modules.push($(this).text());
		});
		str += "\"hw\":\"" + modules.join(";") + "\"";
        str += "}";
        boardDevice.push(eval('(' + str + ')'));
	});
}

function ppat_parseDeviceNode(){
	$(xmlDoc).find("Device").each(function(){
		var str = "{";
		str += "\"name\":\"" + $(this).find("Name").text() + "\",";
		var cases = new Array();
		$(this).find("CaseName").each(function(){
			//powerCategory.push($(this).attr("Component"));
			deviceCategory.push($(this).attr("Category"));
			cases.push($(this).text());
		});
		str += "\"TestCase\":\"" + cases + "\"";
        str += "}";
        powerDevice.push(eval('(' + str + ')'));
	});
}

function ppat_parsePowerNode(){
	$(xmlDoc).find("Power").each(function(){
		powerCase.push($(this).find("CaseName").text());
		powerCategory.push($(this).find("Category").text());
	});
}

function ppat_parseAdvancedPowerNode(){
	$(xmlDoc).find("PowerAdvanced").each(function(){
		powerAdvancedCase.push($(this).find("CaseName").text());
		platform.push($(this).find("Platform").text());
		powerAdvCategory.push($(this).find("Category").text());
	});
}

function ppat_parsePerformanceNode(){
	$(xmlDoc).find("Performance").each(function(){
		performanceCase.push($(this).find("CaseName").text());
		performanceCategory.push($(this).find("Category").text());
	});
}

function chooseTest(select){
	testType = $(select).val();
	$("#selection").empty();
	$("#selection").append("<hr><b>" + $(select).val() + " Test</b><hr>");
	if($(select).val() == "PowerScenario"){
		addScenarioCheckbox();
		addUIScenarioCheckbox();
		$("#tune").empty();
		$("#baremetal").empty();
	}else if($(select).val() == "Round PP"){
		addScenarioCheckbox();
		addUIScenarioCheckbox();
		$("#baremetal").empty();
		//add tune parameters here
		ppat_load_tune();
	}else{
		$("#tune").empty();
		$("#scenario").empty();
		$("#advscenario").empty();
		$("#ui").empty();
	}	
}

function ppat_load_baremetal(){

}

function ppat_load_tune(){
    var tuneURL = "http://10.38.32.97:3000/tc/tune";
	var tunediv = $("#tune");
	tunediv.empty();
    $.ajax({
        type: "GET",
        url: tuneURL,
        timeout:3000,
        dataType:'html',
        success: function(data){
             var tune_xml = new DOMParser().parseFromString(data, 'text/xml');
             $(tune_xml).find("Device").each(function(){
				if($(this).attr("name") == device){
					var table="<table cellspacing=\"0px\" border=\"1\" width=\"100%\"><tr><th colspan=\"2\" align=\"left\" height=\"50px\">Tune Parameters:</th></tr>";
					$(this).find("cpu").each(function(){
						table +="<tr><td colspan=\"2\" height=40>CPU:</td></tr>";
						$(this).children().each(function(){
							var nodeName = $(this).context.nodeName;
							if($(this).text() == null || $(this).text() == ""){
								table += "<tr><td width=\"15%\">Input tune " + nodeName + ": </td>";
								table += "<td class=\"cpu\" width=\"85%\"><input type=\"text\" name=\"cpu\" param=\"" + nodeName + "\"> split with ','";
								table += "</td></tr>";
							}else{
								table += "<tr><td width=\"15%\"><input type=\"checkbox\" onclick=\"ppat_CheckboxSelectCategory(this, 'cpu_" + nodeName + "' ,tune)\">"+ nodeName + "</td>";
								table += "<td class=\"cpu\" width=\"85%\">";
								var params = $(this).text().split(",");
		                 		for(var i = 0; i < params.length; i++){
									table += "<input type=\"checkbox\" name=\"" + params[i] + "\"" + " value=\"cpu_" + nodeName + "\" param=\"" + nodeName +"\">" + params[i];
								}
								table += "</td></tr>";
							}
						});
					});
					$(this).find("gpu").each(function(){
						var unit = $(this).attr("unit");
						table +="<tr><td colspan=\"2\" height=40>GPU" +unit + ":</td></tr>";
						$(this).children().each(function(){
							var nodeName = $(this).context.nodeName;
							if($(this).text() == null || $(this).text() == ""){
								table += "<tr><td>Input tune " + nodeName + ": </td>";
								table += "><td class=\"gpu\"><input type=\"text\" name=\"gpu\" param=\"" + nodeName + "\"> split with ','";
								table += "</td></tr>";
							}else{
								table += "<tr><td width=\"15%\"><input type=\"checkbox\" onclick=\"ppat_CheckboxSelectCategory(this, 'gpu_" + unit + nodeName + "' ,tune)\">"+ nodeName + "</td>";
								table += "<td class=\"gpu" + unit + "\">";
								var params = $(this).text().split(",");
		                 		for(var i = 0; i < params.length; i++){
									table +="<input type=\"checkbox\" name=\"" + params[i] + "\"" + " value=\"gpu_" + unit + nodeName + "\" param=\"" + nodeName +"\">" + params[i];
								}
								table += "</td></tr>";
							}
						});
					});	
					$(this).find("vpu").each(function(){
						var unit = $(this).attr("unit");
						table +="<tr><td colspan=\"2\" height=40>VPU" +unit + ":</td></tr>";
						$(this).children().each(function(){
							var nodeName = $(this).context.nodeName;
							if($(this).text() == null || $(this).text() == ""){
								table += "<tr><td>Input tune " + nodeName + ": </td>";
								table += "<td class=\"vpu\"><input type=\"text\" name=\"vpu\" param=\"" + nodeName + "\"> split with ','";
								table += "</td></tr>";
							}else{
								table += "<tr><td width=\"15%\"><input type=\"checkbox\" onclick=\"ppat_CheckboxSelectCategory(this, 'vpu_" + unit + nodeName + "' ,tune)\">"+ nodeName + "</td>";
								table += "<td class=\"vpu" + unit + "\">";
								var params = $(this).text().split(",");
		                 		for(var i = 0; i < params.length; i++){
									table +="<input type=\"checkbox\" name=\"" + params[i] + "\"" + " value=\"vpu_" + unit + nodeName + "\" param=\"" + nodeName +"\">" + params[i];
								}
								table += "</td></tr>";
							}
						});
					});	
					$(this).find("ddr").each(function(){
						table +="<tr><td colspan=\"2\" height=40>DDR:</td></tr>";
						$(this).children().each(function(){
							var nodeName = $(this).context.nodeName;
							if($(this).text() == null || $(this).text() == ""){
								table += "<tr><td>Input tune " + nodeName + ": </td>";
								table += "<td class=\"ddr\"><input type=\"text\" name=\"ddr\" param=\"" + nodeName + "\"> split with ','";
								table += "</td></tr>";
							}else{
								table += "<tr><td width=\"15%\"><input type=\"checkbox\" onclick=\"ppat_CheckboxSelectCategory(this, 'ddr_" + nodeName + "' ,tune)\">"+ nodeName + "</td>";
								table += "<td class=\"ddr\">";
								var params = $(this).text().split(",");
		                 		for(var i = 0; i < params.length; i++){
									table += "<input type=\"checkbox\" name=\"" + params[i] + "\"" + " value=\"ddr_" + nodeName + "\" param=\"" + nodeName +"\">" + params[i];
								}
								table += "</td></tr>";
							}
						});
					});	
				tunediv.append(table + "</table>");
				}
			});
		}
    });
}

function generateUI(buildtype){

    var submit;
    if(buildtype == "ppat_test"){
        $("#odvb_ppat").html("");
        $("#org_ppat").html("");
        submit = $("#org_ppat");
    }else {
        $("#org_ppat").html("");
        $("#odvb_ppat").html("");
        submit = $("#odvb_ppat");
    }
    var colorbox = "<div style='display:none'>" +
                    "<div id='1080p' style=\"padding:10px; background:#F9F7DB;\" ><div style=\"font-family:Arial; font-size:14px; color:#3b3a2b; line-height:25px; text-decoration:none\">If you need update the stream please visit <b style=\"color:#f00;\">\\\\10.38.116.40\\PPAT_test</b>, push your stream in <b style=\"color:#f00;\">video</b> folder, and update the <b style=\"color:#f00;\">config.xml</b></div></div>" +
                    "<div id='720p' style=\"padding:10px; background:#F9F7DB;\" ><div style=\"font-family:Arial; font-size:14px; color:#3b3a2b; line-height:25px; text-decoration:none\">If you need update the stream please visit <b style=\"color:#f00;\">\\\\10.38.116.40\\PPAT_test</b>, push your stream in <b style=\"color:#f00;\">video</b> folder, and update the <b style=\"color:#f00;\">config.xml</b></div></div>" +
                    "<div id='VGA' style=\"padding:10px; background:#F9F7DB;\" ><div style=\"font-family:Arial; font-size:14px; color:#3b3a2b; line-height:25px; text-decoration:none\">If you need update the stream please visit <b style=\"color:#f00;\">\\\\10.38.116.40\\PPAT_test</b>, push your stream in <b style=\"color:#f00;\">video</b> folder, and update the <b style=\"color:#f00;\">config.xml</b></div></div>" +
                    "<div id='mp3' style=\"padding:10px; background:#F9F7DB;\" ><div style=\"font-family:Arial; font-size:14px; color:#3b3a2b; line-height:25px; text-decoration:none\">If you need update the stream please visit <b style=\"color:#f00;\">\\\\10.38.116.40\\PPAT_test</b>, push your stream in <b style=\"color:#f00;\">audio</b> folder, and update the <b style=\"color:#f00;\">config.xml</b></div></div>" ;

	submit.append("<div id=\"powercase\" style=\"display: block; \">"
					+ "*Choose Test: <select onchange=\"chooseTest(this)\">"
					+ "<option>PowerScenario</option>"
					+ "<option>Round PP</option>"
					+ "<option>Baremetal</option>"
					+ "</select>"
					+ "<div id=\"selection\"><hr><b>PowerScenario Test</b><hr></div></div>");
	submit.append("<label id=\"DeviceHW\" style=\"display: block; \"></label>"); 
	submit.append("<div id=\"scenario\" style=\"display: block; \"></div>");
	submit.append("<div id=\"advscenario\" style=\"display: block; \"></div>");
	submit.append("<div id=\"ui\" style=\"display: block; \"></div>");
	submit.append("<div id=\"baremetal\" style=\"display: block; \"></div>");
	addScenarioCheckbox();
	addUIScenarioCheckbox();
	submit.append(colorbox);
	submit.append("<div id=\"cmd\" style=\"display: block; \"></div>"); 
	submit.append("<div id=\"tune\" style=\"display: block; \">");  
	submit.append("<hr><b>Please click \"Add cmds for PPAT test\" if you need input commmands<br/><input id=\"add\" type=\"button\" onclick=\"addCmd()\" value=\"Add cmds for PPAT test\">");

}

function addAdvancedScenarioCheckbox(pf){
	var adv_scenario_div = $("#advscenario");
	adv_scenario_div.html("");

	powerAdvCategory_b = powerAdvCategory.concat().del();
	platform_b = platform.concat();
	platform_b = platform_b.del();
	for(var i = 0; i < platform_b.length; i++){
		if(platform_b[i] == pf){
			var table="<table id=\"scenario_table\" cellspacing=\"0px\" border=\"1\" width=\"100%\"><tr><th colspan=\"2\" align=\"left\" height=\"50px\">Advanced Power Consumption Test: <input type=\"checkbox\" value=\"Select All\" onclick=\"ppat_CheckboxSelectAll(this, advscenario)\">SelectAll&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test loop:<input id=\"loopadvscenario\" style=\"width:20px\" type=\"text\" name=\"loopPPAT\" /><span style=\" font-size:12px;color:#999999\">test loop, default is<b>\"3\"</b></span></th></tr>";
			for(var j = 0; j < powerAdvCategory_b.length; j++){
				table += "<tr><td width=\"15%\"><input type=\"checkbox\" value=\"Select " + powerAdvCategory[j] + "\" onclick=\"ppat_CheckboxSelectCategory(this, '"+ powerAdvCategory[j] +"',advscenario)\">"+ powerAdvCategory[j] + "</td><td width=\"85%\">";
				for(var k = 0; k < powerAdvancedCase.length; k++){
					if(powerAdvCategory[k] == powerAdvCategory_b[j] && platform[k] == pf){
						table += "&nbsp;&nbsp;<input id=\"" + powerAdvancedCase[k] + "\" type=\"checkbox\" value=\"" + powerAdvCategory[k] + "\"" + " name=\"powerAdv\" class=\"" + powerAdvancedCase[k] + "\" text=\""+ powerAdvancedCase[k] +"\">" + powerAdvancedCase[k] ;
					}
				}
			}
			table += "</td></tr></table></br>";
			adv_scenario_div.append(table);
		}
	}
}

function addScenarioCheckbox(){
	var scenario_div = $("#scenario");
	scenario_div.html("");
	var table="<table id=\"scenario_table\" cellspacing=\"0px\"  border=\"1\" width=\"100%\"><tr><th colspan=\"2\" align=\"left\" height=\"50px\">Power Consumption Test: <input type=\"checkbox\" text=\"SelectAll\" value=\"Select All\" onclick=\"ppat_CheckboxSelectAll(this, scenario)\">SelectAll&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test loop:<input id=\"loopscenario\" style=\"width:20px\" type=\"text\" name=\"loopPPAT\" /><span style=\" font-size:12px;color:#999999\">test loop, default is<b>\"3\"</b></span></th></tr>";
	
	//add button to select/de-select by category
    powerCategory_b = powerCategory.concat();
    powerCategory_b = powerCategory_b.del();
    for(var i = 0; i < powerCategory_b.length; i++){
		table += "<tr><td width=\"15%\"><input type=\"checkbox\" value=\"Select " + powerCategory_b[i] + "\" onclick=\"ppat_CheckboxSelectCategory(this, '"+ powerCategory_b[i] +"',scenario)\">" + powerCategory_b[i] + " </td><td width=\"85%\">";
			for(var j = 0; j < powerCase.length; j++){
				if(powerCategory[j] == powerCategory_b[i]){
					table +="&nbsp;&nbsp;<input type=\"checkbox\" value=\"" + powerCategory[j] + "\"" + " name=\"power\" class=\"" + powerCase[j] + "\" text=\""+ powerCase[j] +"\" href=\"#"+ powerCase[j] +"\">" + powerCase[j];
				}
    	}
		table += "</td></tr>"
    }
	table += "</table></br>";
	scenario_div.append(table);

	addAdvancedScenarioCheckbox(device);
		
	$(".1080p").colorbox({inline:true, width:"50%"});
	$(".720p").colorbox({inline:true, width:"50%"});
	$(".VGA").colorbox({inline:true, width:"50%"});
	$(".mp3").colorbox({inline:true, width:"50%"});
}

function addUIScenarioCheckbox(){
	var scenario_div = $("#ui");
	scenario_div.html("");

	var table="<table id=\"ui_table\" cellspacing=\"0px\" border=\"1\" width=\"100%\"><tr><th colspan=\"2\" align=\"left\" height=\"50px\">UI Performance Test: <input type=\"checkbox\" text=\"SelectAll\" value=\"Select All\" onclick=\"ppat_CheckboxSelectAll(this, ui)\">SelectAll&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test loop:<input id=\"loopui\" style=\"width:20px\" type=\"text\" name=\"loopPPAT\" /><span style=\" font-size:12px;color:#999999\">test loop, default is<b>\"3\"</b></span></th></tr>";

	//add button to select/de-select by category
    performanceCategory_b = performanceCategory.concat();
    performanceCategory_b = performanceCategory_b.del();
    for(var i = 0; i < performanceCategory_b.length; i++){
		table += "<tr><td width=\"15%\"><input type=\"checkbox\" value=\"Select " + performanceCategory_b[i] + "\" onclick=\"ppat_CheckboxSelectCategory(this, '"+ performanceCategory_b[i] +"',ui)\">" + performanceCategory_b[i] + " </td><td width=\"85%\">";
			for(var j = 0; j < performanceCase.length; j++){
				if(performanceCategory[j] == performanceCategory_b[i]){
					table +="&nbsp;&nbsp;<input type=\"checkbox\" value=\"" + performanceCategory[j] + "\"" + " name=\"performance\" class=\"" + performanceCase[j] + "\" text=\""+ performanceCase[j] +"\" href=\"#"+ performanceCase[j] +"\">" + performanceCase[j];
				}
    	}
		table += "</td></tr>"
    }
	table += "</table></br>";
	scenario_div.append(table);	
}

function ppat_addDeviceCase(j){
	var scenario_div = $("#scenario");
	$("#scenario_table").html("");
	scenario_div.html("");
		
	powerCategory_b = powerCategory.concat();
	powerCase_b = powerCase.concat();
	$(xmlDoc).find("Device").each(function(){
		if($(this).find("Name").text() == powerDevice[j].name){
			var tdVal="";
			$(this).find("CaseName").each(function(){
				powerCase_b.push($(this).text());
				powerCategory_b.push($(this).attr("Category"));						
			});
		}
	});
	//reset table
	var table="<table id=\"scenario_table\" cellspacing=\"0px\" border=\"1\" width=\"100%\"><tr><th colspan=\"2\" align=\"left\" height=\"50px\">Power Consumption Test: <input type=\"checkbox\" text=\"SelectAll\" value=\"Select All\" onclick=\"ppat_CheckboxSelectAll(this, scenario)\">SelectAll&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test loop:<input id=\"loopscenario\" style=\"width:20px\" type=\"text\" name=\"loopPPAT\" /><span style=\" font-size:12px;color:#999999\">test loop, default is<b>\"3\"</b></span></th></tr>";
	
	//add button to select/de-select by category
	powerCategory_c = powerCategory_b.concat();
	powerCategory_b = powerCategory_b.del();
	for(var i = 0; i < powerCategory_b.length; i++){
		table += "<tr><td width=\"15%\"><input type=\"checkbox\" value=\"Select " + powerCategory_b[i] + "\" onclick=\"ppat_CheckboxSelectCategory(this, '"+ powerCategory_b[i] +"',scenario)\">" + powerCategory_b[i] + " </td><td width=\"85%\">";
		for(var j = 0; j < powerCase_b.length; j++){
			if(powerCategory_c[j] == powerCategory_b[i]){
				table +="&nbsp;&nbsp;<input type=\"checkbox\" value=\"" + powerCategory_c[j] + "\"" + " name=\"power\" class=\"" + powerCase_b[j] + "\" text=\""+ powerCase_b[j] +"\" href=\"#"+ powerCase_b[j] +"\">" + powerCase_b[j];
			}
		}
		table += "</tr>"
	}
	table += "</table></br>";
	scenario_div.append(table);

	addAdvancedScenarioCheckbox(device);
	$(".1080p").colorbox({inline:true, width:"50%"});
	$(".720p").colorbox({inline:true, width:"50%"});
	$(".VGA").colorbox({inline:true, width:"50%"});
	$(".mp3").colorbox({inline:true, width:"50%"});
}


function ppat_appendToText(v){
    var jsonStr = "";
    var caseCount = 0;
	var scenarios = $("#scenario").find("input");
	scenarios.each(function(){
		if($(this).attr("checked") && $(this).attr("name")){
			caseCount += 1;
			jsonStr += "{\"Name\":\"" + $(this).attr("text") + "\"";

			//loop
		    var lp = $("#loopscenario").val();
		    if(lp != ""){
		    	jsonStr +=",\"count\":\"" + $("#loopscenario").val() + "\"},";
		    }else{
				jsonStr +=",\"count\":\"1\"},";
			}
		}
	});
	var advscenarios = $("#advscenario").find("input");
	advscenarios.each(function(){
		if($(this).attr("checked") && $(this).attr("name")){
			caseCount += 1;
			jsonStr += "{\"Name\":\"" + $(this).attr("text") + "\"";

			//loop
		    var lp = $("#loopadvscenario").val();
		    if(lp != ""){
		     	jsonStr +=",\"count\":\"" + $("#loopadvscenario").val() + "\"},";
		    }else{
				jsonStr +=",\"count\":\"1\"},";
			}
		}
	});
	var ui = $("#ui").find("input");
	ui.each(function(){
		if($(this).attr("checked") && $(this).attr("name")){
			caseCount += 1;
			jsonStr += "{\"Name\":\"" + $(this).attr("text") + "\"";

			//loop
		    var lp = $("#loopui").val();
		    if(lp != ""){
		     	jsonStr +=",\"count\":\"" + $("#loopui").val() + "\"},";
		    }else{
				jsonStr +=",\"count\":\"1\"},";
			}
		}
	});
	if(caseCount >= 1){
		jsonStr = "{\"TestCaseList\":[" + jsonStr.substring(0, jsonStr.length - 1) + "]";
		for(var c = 1; c <= countOfCmds; c++){
			if($("#"+c).val() != "" && $("#"+c).val() != null){
			jsonStr +=",\"inputs\":[";
			break;
			}
		}
		$('textarea').each(function(){                      
			var text = $(this).val();//commands
			if(text != ""){
				var description = $("#" + ($(this).attr("id")+ "r")).attr("value");//reason
				if(description == ""){
					description = "null";
				}
				jsonStr += "{\"description\":\"" + description + "\",";
				jsonStr += "\"commands\":\"" + text + "\"},";
			}
       });
       jsonStr = jsonStr.substring(0, jsonStr.length - 1) + "]";
       
       if(testcases != ""){
			jsonStr += ",\"stream\":[" + testcases.substring(0, testcases.length - 1) + "]";
        }
		var tuneParam ="";
//CPU
		var cpu = "";
		var tune = $(".cpu").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
					}else{//text
						if($(this).val() != ""){
							paramVal += $(this).val() + ",";
						}
					}
			});
			if(paramVal != ""){
				cpu += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(cpu != ""){
			cpu = "\"cpu\":{" + cpu.substring(0,cpu.length-1) + "},";
			tuneParam += cpu;
		}
//DDR
		var ddr = "";
		var tune = $(".ddr").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
				}else{//text
					if($(this).val() != ""){
						paramVal += $(this).val() + ",";
					}
				}
			});
			if(paramVal != ""){
				ddr += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(ddr != ""){
			ddr = "\"ddr\":{" + ddr.substring(0,ddr.length-1) + "},";
			tuneParam += ddr;
		}
//gpu0
		var gpu0 = "";
		var tune = $(".gpu0").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
				}else{//text
					if($(this).val() != ""){
						paramVal += $(this).val() + ",";
					}
				}
			});
			if(paramVal != ""){
				gpu0 += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(gpu0 != ""){
			gpu0 = "\"gpu0\":{" + gpu0.substring(0,gpu0.length-1) + "},";
			tuneParam += gpu0;
		}
//gpu1
		var gpu1 = "";
		var tune = $(".gpu1").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
				}else{//text
					if($(this).val() != ""){
						paramVal += $(this).val() + ",";
					}
				}
			});
			if(paramVal != ""){
				gpu1 += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(gpu1 != ""){
			gpu1 = "\"gpu1\":{" + gpu1.substring(0,gpu1.length-1) + "},";
			tuneParam += gpu1;
		}
//vpu0
		var vpu0 = "";
		var tune = $(".vpu0").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
				}else{//text
					if($(this).val() != ""){
						paramVal += $(this).val() + ",";
					}
				}
			});
			if(paramVal != ""){
				vpu0 += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(vpu0 != ""){
			vpu0 = "\"vpu0\":{" + vpu0.substring(0,vpu0.length-1) + "},";
			tuneParam += vpu0;
		}
//vpu1
		var vpu1 = "";
		var tune = $(".vpu1").each(function(){
			var param = "";
			var paramVal = "";
			$(this).find("input").each(function(){
				if($(this).attr("param") != param){
					param = $(this).attr("param");
					paramVal = "";
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).attr("checked")){
						paramVal += $(this).attr("name") + ",";
					}
				}else{//text
					if($(this).val() != ""){
						paramVal += $(this).val() + ",";
					}
				}
			});
			if(paramVal != ""){
				vpu1 += "\"" + param +"\":\"" + paramVal.substring(0,paramVal.length-1) +"\",";
			}
		});
		if(vpu1 != ""){
			vpu1 = "\"vpu1\":{" + vpu1.substring(0,vpu1.length-1) + "},";
			tuneParam += vpu1;
		}
//all tune append to jsonStr
		if(tuneParam != ""){
			jsonStr += ",\"TuneParam\":{" + tuneParam.substring(0,tuneParam.length-1) + "}";
		}
        jsonStr += "}";
        jsonStr = jsonStr.replace(/[\n]/ig,'&amps;').replace(/\s+/g,'&nbsp;');

		$("input[name='" + v + "']").each(function(){
			$(this).attr("value", jsonStr);
		});
    }else{
        alert('Please at least choose a Power or Performance test case');
    }
}


function ppat_CheckboxSelectAll(name, id) {
	if($(name).attr("checked")){
		$(id).find(":checkbox").each(function(){
			$(this).attr("checked", true);
		});
	}else{
		$(id).find(":checkbox").each(function(){
			$(this).attr("checked", false);
		});
	}
 }

function ppat_CheckboxSelectCategory(name, Category, id) {
  if($(name).attr("checked")){
		$(id).find(":checkbox").each(function(){
			if($(this).attr("value") == Category){
				$(this).attr("checked", true);
			}
		});
	}else{
		$(id).find(":checkbox").each(function(){
			if($(this).attr("value") == Category){
				$(this).attr("checked", false);
			}
		});
	}
}

Array.prototype.del = function() {
    var a = {}, c = [], l = this.length;
    for (var i = 0; i < l; i++) {
        var b = this[i];
        var d = (typeof b) + b;
        if (a[d] === undefined) {
            c.push(b);
            a[d] = 1;
        }
    }
    return c;
}

function ppat_triggerValidate(thisform)
{
    with (thisform)
    {
        if (selected.value == "ppat_test")
        {
            //load append ppat.xml to Text after validate
            ppat_appendToText("property3value");
//            if (ppat_validateRequired(property4value, "please input the Reason for Build") == false)
//            {
//                property4value.focus();
//                return false;
//            }
            if (ppat_validateRequired(property1value, "please input the Image Path") == false)
            {
                property1value.focus();
                return false;
            }
            if (ppat_validateRequired(property6value, "please select the device") == false)
            {
                property6value.focus();
                return false;
            }
            if (ppat_validateRequired(property7value, "please select the blf") == false)
            {
                property7value.focus();
                return false;
            }
            if (ppat_validateRequired(property3value, "please select power or performance test cases") == false)
            {
                property3value.focus();
                return false;
            }
        }
        if (selected.value == "on_demand_virtual_build_with_ppat")
        {
            //load append ppat.xml to Text after validate
            ppat_appendToText("property2value");
//            if (ppat_validateRequired(property4value, "please input the Reason for Build") == false)
//            {
//                property4value.focus();
//                return false;
//            }
            if (ppat_validateRequired(property6value, "please input the manifest") == false)
            {
                property6value.focus();
                return false;
            }
            if (ppat_validateRequired(property8value, "please select the device") == false)
            {
                property8value.focus();
                return false;
            }
            if (ppat_validateRequired(property9value, "please select the blf") == false)
            {
                property9value.focus();
                return false;
            }
            if (ppat_validateRequired(property2value, "please select power or performance test cases") == false)
            {
                property2value.focus();
                return false;
            }
        }

    }
}

function ppat_validateRequired(field, alerttxt)
{
    with (field)
    {
        if (value==null||value=="")
        {
            alert(alerttxt);
            focus();
            return false;
         }
         for (i = 0; i < value.length; i++)
         {
             c = value.substr(i, 1);
             ts = escape(c);
             if(ts.substring(0,2) == "%u")
             {
                 alert("Chinese characters is not allowed!");
                 value = "";
                 return false;
             }
         }
    }
}

function branchSelect2(){
        var c = {
                "pxa1L88dkb_def:pxa1L88dkb":['HELN_LTE_CSFB_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_LWG_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_400MHZ_768MB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_400MHZ_768MB.blf', 'HELN_LTE_LWG_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_533MHZ_768MB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_533MHZ_768MB.blf', 'HELN_LTE_LWG_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_TABLET_Nontrusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_CSFB_TABLET_Nontrusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_CSFB_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB_NTZ.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_CSFB_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_400MHZ_512M.blf', 'HELN_LTE_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_CSFB_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_533MHZ_512M.blf', 'HELN_LTE_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_Nontrusted_eMMC_400MHZ_1GB.blf'],
                "pxa1U88dkb_def:pxa1U88dkb":['HLN2_Nontrusted_LPDDR3_2G_Hynix.blf'],
                "pxa1928dkb_tz:pxa1928dkb":['PXA1928_Trusted_eMMC_Samsung_Discrete.blf','PXA1928_Trusted_eMMC_Elpida.blf', 'PXA1928_Trusted_eMMC_Hynix.blf', 'PXA1928_Trusted_eMMC_Hynix_Discrete.blf']
                };

        var sel = document.getElementById("property6value");
        var op = sel.options[sel.selectedIndex];
        var r_devices = c[op.text];
        var r_device = document.getElementById("property7value");
        r_device.length=0;
        for(var i=0;i<r_devices.length;i++){
        var ops = new Option();
        ops.text = r_devices[i] ;
        r_device.options[i] = ops;
        }
		device = op.text;
        $("#DeviceHW").css("display", "none");
		$("#DeviceHW").empty();
        $("#device_module").remove();
        $("#DeviceHW").append("<b>Choose Board HW Module:</b><div id=\"device_module\"></div>");
        for(var i = 0; i < boardDevice.length; i++){
            if(boardDevice[i].type == op.text){
                var hwModule = new Array();
                hwModule = boardDevice[i].hw.split(";");
                for(var k = 0; k < hwModule.length; k++){
                    for(var j = 0; j < powerDevice.length; j++){
                        if(powerDevice[j].name == hwModule[k]){
                            $("#DeviceHW").css("display", "block");
							$("#DeviceHW").append("<input id=\"" + powerDevice[j].name + "\" type=\"radio\" value=\"" + powerDevice[j].name + "\"" + " name=\"device\" onclick=ppat_addDeviceCase(" + j + ")>" + powerDevice[j].name);
                        }
                     }
                 }
            }
        }
		addScenarioCheckbox();
		if(testType == "Tune"){
			ppat_load_tune();
		}
}

function branchSelect3(){
        var c = {
                "pxa1L88dkb_def:pxa1L88dkb":['HELN_LTE_CSFB_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_LWG_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_400MHZ_768MB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_400MHZ_768MB.blf', 'HELN_LTE_LWG_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Nontrusted_eMMC_533MHZ_768MB.blf', 'HELN_LTE_CSFB_Nontrusted_eMMC_533MHZ_768MB.blf', 'HELN_LTE_LWG_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_TABLET_Nontrusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_CSFB_TABLET_Nontrusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_CSFB_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB.blf', 'HELN_LTE_LWG_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_TABLET_Trusted_eMMC_DDR3L_533MHZ_1GB_NTZ.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_CSFB_Trusted_eMMC_400MHZ_1GB.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_400MHZ_512M.blf', 'HELN_LTE_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_Trusted_eMMC_400MHZ_1GB_NTZ.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_CSFB_Trusted_eMMC_533MHZ_1GB.blf', 'HELN_LTE_NOCP_Nontrusted_eMMC_533MHZ_512M.blf', 'HELN_LTE_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_CSFB_Trusted_eMMC_533MHZ_1GB_NTZ.blf', 'HELN_LTE_Nontrusted_eMMC_400MHZ_1GB.blf'],
                "pxa1U88dkb_def:pxa1U88dkb":['HLN2_Nontrusted_LPDDR3_2G_Hynix.blf'],
                "pxa1928dkb_tz:pxa1928dkb":['PXA1928_Trusted_eMMC_Samsung_Discrete.blf','PXA1928_Trusted_eMMC_Elpida.blf', 'PXA1928_Trusted_eMMC_Hynix.blf', 'PXA1928_Trusted_eMMC_Hynix_Discrete.blf']
                };

        var sel = document.getElementById("property8value");
        var op = sel.options[sel.selectedIndex];
        var r_devices = c[op.text];
        var r_device = document.getElementById("property9value");
        r_device.length=0;
        for(var i=0;i<r_devices.length;i++){
        var ops = new Option();
        ops.text = r_devices[i] ;
        r_device.options[i] = ops;
        }
		device = op.text;
		$("#DeviceHW").css("display", "none");
		$("#DeviceHW").empty();
        $("#device_module").remove();
        $("#DeviceHW").append("<b>Choose Board HW Module:</b><div id=\"device_module\"></div>");
        for(var i = 0; i < boardDevice.length; i++){
            if(boardDevice[i].type == op.text){
                var hwModule = new Array();
                hwModule = boardDevice[i].hw.split(";");
                for(var k = 0; k < hwModule.length; k++){
                    for(var j = 0; j < powerDevice.length; j++){
                        if(powerDevice[j].name == hwModule[k]){
                            $("#DeviceHW").css("display", "block");
							$("#DeviceHW").append("<input id=\"" + powerDevice[j].name + "\" type=\"radio\" value=\"" + powerDevice[j].name + "\"" + " name=\"device\" onclick=ppat_addDeviceCase(" + j + ")>" + powerDevice[j].name);
                        }
                     }
                 }
            }
        }
		addScenarioCheckbox();
		if(testType == "Tune"){
			ppat_load_tune();
		}
}
