class UploadController < ApplicationController
  
  skip_before_filter  :verify_authenticity_token
  
  respond_to :js, :json
  
  def fileupload
    
    @topic = Topic.find(request.env["HTTP_TOPIC_ID"])
    
    if request.env["HTTP_IMAGE_OR_AUDIO"] == "audio"
      @topic.audio = request.env["rack.input"]
      @topic.save
    elsif request.env["HTTP_IMAGE_OR_AUDIO"] == "image"
      @topic.image = request.env["rack.input"]
      @topic.save
    end

    respond_to do |format|
      format.js { render json: "Successful upload" }
      format.json { render json: "Successful upload" }
    end
  end

end