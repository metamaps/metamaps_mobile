    // initialize
	function Init() {

		var fileselect = $id("fileselect");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);
	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}
	
	
    
    // file selection
	function FileSelectHandler(e) {

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
			UploadFile(f);
		}

	}


	// output file information
	function ParseFile(file) {
		
		var reader = new FileReader();
		// if file is an image
		if (file.type.indexOf("image") == 0) {
			reader.onload = function(e) {
                $('#capture').css('background-image','url("' + e.target.result + '")');
			}
			reader.readAsDataURL(file);
		}
	}

	// upload JPEG files
	function UploadFile(file) {

		var xhr = new XMLHttpRequest();
		if (xhr.upload) { 

			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
				    var message = xhr.status == 200 ? "success" : "failure";
					console.log(message);
				}
			};

			// start upload
			xhr.open("POST", "/upload", true);
			xhr.setRequestHeader("X-File-Name", file.name);
			xhr.send(file);

		}

	}
	

//  $('#capture').click(function(evt){
//    $('#fileselect').focus().trigger('click');
//  });



    
      // add a form for adding new topics to this map 
      var pageString = ''
        +   '<div data-role="content">'
      	+	  '<div id="capture">CAPTURE</div>'
        +     '<input id="fileselect" type="file" accept="image/*" capture="camera">'


    
      