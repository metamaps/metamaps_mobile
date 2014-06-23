class UploadController < ApplicationController
  
  skip_before_filter  :verify_authenticity_token
  
  respond_to :html, :js, :json
  
  def fileupload
    raw = request.env["rack.input"].read
    File.open("#{Rails.root}/public/uploads/"+request.env["HTTP_X_FILE_NAME"], "wb") do |f| 
      f.puts raw;    
    end
    
    respond_to do |format|
      format.js { render json: "Successful upload" }
      format.html # index.html.erb
      format.json { render json: "Successful upload" }
    end
  end

end