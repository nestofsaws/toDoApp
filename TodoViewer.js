$(document).ready(function() {
	
    build_todo_list_div();
    sort_todo_list_div("title");
	//$("#add_item_form").submit(add_item_todo_list);

    $('#sortkey_select').on('change', function(e) {
	var key = $(this).val();
	sort_todo_list_div(key);	
	});

    $('input.filter').on('change', function() {
	filter_todo_list();
    });
	
	
	$('#add_item_form').on('submit', function(e) {
	    e.preventDefault();
		var title = $(this).find("input[name='title']").val();
		var project = $(this).find("input[name='project']").val();
		var due_date = $(this).find("input[name='due_date']").val();
		var priority = parseInt($(this).find("select[name='priority']").val()); 
		var note = $(this).find("textarea[name='note']").val();
		var complete = $(this).find("select[name='completed']").val(); 
		
		/*
		   if (complete == 'True') {
				complete = true;
			} else if (complete = 'False') {
				complete = false;
			}
		*/
	    $.ajax("http://wwwp.cs.unc.edu/Courses/comp416-f13/a5/brianz/todo.php",
		   {type: "POST",
			   dataType: "json",
			   data: {title: title,
			       project: project,
			       due_date: due_date,
			       priority: priority,
				   note: note,
				   complete: complete},
			   success: function(data, status, jqXHR) {
			   var todo_div = create_collapsed_div(data);
			   $('#todo_list').append(todo_div);
			   sort_todo_list_div($('#sortkey_select').val());
		       },
			   error: function(jqXHR, status, error) {
			   alert(jqXHR.responseText);
		       }});
			   
			   $("#add_item_form")[0].reset();
	});
	
	
	
});


//######################################################
var filter_todo_list = function() {

    var todo_divs = $('#todo_list > div');

    for (var i=0; i<todo_divs.length; i++) {
	var next_todo_div = $(todo_divs[i]);
	var item = next_todo_div[0].item;

	if (item.complete == true ) {
	    if (!$('#yes_box')[0].checked) {
		next_todo_div.css('display', 'none');
	    } else {
		next_todo_div.css('display', '');
	    }
	}
	if (item.complete == false ) {
	    if (!$('#no_box')[0].checked) {
		next_todo_div.css('display', 'none');
	    } else {
		next_todo_div.css('display', '');
	    }
	}
    }	
}

//######################################################
var sort_todo_list_div = function(key) {

    var todo_divs = $('#todo_list > div');
    var todo_div_array = todo_divs.toArray();

 
	if (key == "title") {
	    todo_div_array.sort(function (a, b) {
		var sa = a.item;
	    var sb = b.item;

		var atitle = sa.title.toLowerCase();
		var btitle = sb.title.toLowerCase();

		if (atitle < btitle) {
		    return -1;
		} else if (atitle > btitle) {
		    return 1;
		} else {
		    return 0;
		}
	});
	} else if (key == "project") {
	    todo_div_array.sort(function (a, b) {
		var sa = a.item;
	    var sb = b.item;

		var aproject = sa.project.toLowerCase();
		var bproject = sb.project.toLowerCase();

		if (aproject < bproject) {
		    return -1;
		} else if (aproject > bproject) {
		    return 1;
		} else {
		    return 0;
		}
	});
	} else if (key == "due_date") {
	    todo_div_array.sort(function (a, b) {
		var sa = a.item;
	    var sb = b.item;

		var adate = sa.due_date;
		var bdate = sb.due_date;

		if (adate < bdate) {
		    return -1;
		} else if (adate > bdate) {
		    return 1;
		} else {
		    return 0;
		}
	    });
	} else  if (key == "priority") {
	    todo_div_array.sort(function (a, b) {
		var sa = a.item;
	    var sb = b.item;

		var apriority = sa.priority;
		var bpriority = sb.priority;

		if (apriority < bpriority) {
		    return -1;
		} else if (apriority > bpriority) {
		    return 1;
		} else {
		    return 0;
		}
	    });
	} else {
		todo_div_array.sort(function(a, b) {
		var sa = a.item;
	    var sb = b.item;
		var adue = sa.due_date;
		var bdue = sb.due_date;

		if(adue == null && bdue != null)
			return 1;
		else if(adue != null && bdue == null)
			return -1;
		else if(adue < bdue)
			return -1;
		else if(adue == bdue)
			return 0;
		else
			return 1;
		}
		);	
	}
	

    for (var i=0; i<todo_div_array.length; i++) {
	$('#todo_list').append(todo_div_array[i]);
    }    
}

//######################################################
/*
var build_todo_list_div = function() {
	var list_div = $('#todo_list');
	var all_todo_ids = TodoItem.getAll();

	for (var i=0; i < all_todo_ids.length; i += 1) {
		var next_item = TodoItem.getByID(all_todo_ids[i]);
	    
	    var todo_div = create_collapsed_div(next_item);
		

	    list_div.append(todo_div);
		
	}
};
*/
var build_todo_list_div = function() {
	var list_div = $('#todo_list');

    $.ajax("http://wwwp.cs.unc.edu/Courses/comp416-f13/a5/brianz/todo.php",
           {type: "GET",
	    dataType: "json",
	    success: function(data, status, jqXHR) {
	       for (var i=0; i<data.length; i += 1) {
		   load_item(data[i]);
	       }
	    }
	   });
};

var load_item = function(id) {
    $.ajax("http://wwwp.cs.unc.edu/Courses/comp416-f13/a5/brianz/todo.php/" + id,
           {type: "GET",
	    dataType: "json",
	    success: function(data, status, jqXHR) {
	       var todo_div = create_collapsed_div(data);
	       $('#todo_list').append(todo_div);
	    }
	   });
};

//######################################################
var create_collapsed_div = function(item) {
    var todo_div = $('<div></div>');
    todo_div[0].item = item;

    todo_div.append('<h3>' + item.title + '</h3>');

    todo_div.on('click', function(e) {
	var item = this.item;
	var expanded_div = create_expanded_div(item);
	todo_div.replaceWith(expanded_div);
    });
	
	var today = new Date();
	if(item.due_date < today && item.due_date != null)
	todo_div.addClass("overdue");

    return todo_div;
};
//######################################################
var create_expanded_div = function(item) {
    var todo_div = $('<div></div>');
    todo_div[0].item = item;

    todo_div.append("<h3>" + item.title + "</h3>" + "ID: " + item.id
			+ '<br />' + "Project: " + item.project
			+ '<br />' + "Due Date: " + item.due_date
			+ '<br />' + "Priority: " + item.priority
			+ '<br />' + "Notes: " + item.note
			+ '<br />' + "Completed?: " + (item.complete ? "Yes" : "No") + '<br />');

    var collapse_button = $('<button type=button>Collapse</button>');

    collapse_button.on('click', function (e) {
	var todo_div = $(this).parent();
	var item = todo_div[0].item;
	
		var collapsed_div = create_collapsed_div(item);
		todo_div.replaceWith(collapsed_div);
    });

	var expand_button = $('<button type=button>Edit</button>');
    expand_button.on('click', function (e) {
		var todo_div = $(this).parent();	
		var item = todo_div[0].item;
		var edit_form_div = create_edit_form_div(item);
		$(this).replaceWith(edit_form_div);
    });

    todo_div.append(collapse_button);
    todo_div.append(expand_button);

	var today = new Date();
		
		if(item.due_date < today && item.due_date != null)
			todo_div.addClass("overdue");

    return todo_div;
}
//######################################################

var create_edit_form_div = function(item) {
    var edit_form_div = $('<div></div>');
    edit_form_div.css('border', 'thin solid black');
    edit_form_div.addClass('edit');

    edit_form_div[0].item = item;

    var form = $('<form></form>');
    form.append("Title: ");
    var title_input = $('<input name=title type="text" size="35">');
    title_input.val(item.title);
    form.append(title_input);
    form.append("<br>");

    form.append("Project: ");
    var project_input = $('<input name=project type="text" size="35">');
    project_input.val(item.project);
    form.append(project_input);
    form.append("<br>");

    form.append("Due Date: ");
    var due_date_input = $('<input name=due_date type="text">');
	due_date_input.val(item.due_date);
    form.append(due_date_input);
    form.append("<br>");

	
	form.append("Priority: ");
    var priority_option = $('<select name="priority"></select>');
    priority_option.append("<option value='1'>1</option>"); 
    priority_option.append("<option value='2'>2</option>");
    priority_option.append("<option value='3'>3</option>");
    priority_option.append("<option value='4'>4</option>");
    priority_option.append("<option value='5'>5</option>");
    priority_option.append("<option value='6'>6</option>");
    priority_option.append("<option value='7'>7</option>");
    priority_option.append("<option value='8'>8</option>");
    priority_option.append("<option value='9'>9</option>");
    priority_option.append("<option value='10'>10</option>");
	priority_option.val(item.priority);
    form.append(priority_option);
    form.append("<br>");
	
	form.append("Notes: ");
    var note_input = $('<input name=note type="text" size="50">');
    note_input.val(item.note);
    form.append(note_input);
    form.append("<br>");
	
	form.append("Completed?: ");
    var complete_select = $('<select name="completed"></select>');
    complete_select.append("<option value=1>Yes</option>"); 
    complete_select.append("<option value=0>No</option>");
	
	/*
	var code;
  	if (item.complete == "Yes") {
  		code = "true";
  	} else {
  		code = "false";
  	}
  	
  	var selected_option = complete_select.find('option[value="' + code + '"]');
  	selected_option.attr('selected', 'selected'); */
	
    form.append(complete_select);
    form.append("<br>");

    var submit = $('<button type="submit"></button>');
    submit.append("Save");
    form.append(submit);

    var cancel = $('<button type="button">Cancel</button>');
    cancel.on('click', function(e) {
	    var edit_form_div = $(this).parent().parent().parent();
	    var item = edit_form_div[0].item;

		var expanded_div = create_expanded_div(item);
		edit_form_div.replaceWith(expanded_div);
	});

    form.append(cancel);

    edit_form_div.append(form);

    edit_form_div.on('submit', function(e) {
		e.preventDefault();
		var item = this.item;

		var edit_form_div = $(this).parent();

	    var title_input = edit_form_div.find('input[name="title"]');
	    var project_input = edit_form_div.find('input[name="project"]');
	    var due_date_input = edit_form_div.find('input[name="due_date"]');
	    var priority_option = edit_form_div.find('select option:selected');
		var note_input = edit_form_div.find('input[name="note"]');
		var complete_select = edit_form_div.find('select option:selected');

	    item.title = title_input.val();
	    item.project = project_input.val();
	    item.due_date = due_date_input.val();
		item.priority = priority_option.val();
	    item.note = note_input.val();
		item.complete = complete_select.val();
	   /*
		var new_complete;

	    switch (complete_select.val()) {
	    case 'true':
			new_complete = "Yes"; break;
	    case 'false':
			new_complete = "No"; break;
	    }
		*/
		
		var expanded_div = create_expanded_div(item);
		edit_form_div.replaceWith(expanded_div);
		
		
		$.ajax("http://wwwp.cs.unc.edu/Courses/comp416-f13/a5/brianz/todo.php/" + item.id,
		   {type: "POST",
		    dataType: "json",
		    data: {title: item.title,
			       project: item.project,
			       due_date: item.due_date,
			       priority: item.priority,
				   note: item.note,
				   complete: item.complete},
		       success:  function(data, status, jqXHR) {
				var expanded_div = create_expanded_div(data);
				edit_form_div.replaceWith(expanded_div);
			
		       },
		       error: function(jqXHR, status, error) {
			   alert(jqXHR.responseText);
		       }
		   });
	    

	    
	    
	});

    return edit_form_div;
}
