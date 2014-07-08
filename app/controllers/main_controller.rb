class MainController < ApplicationController
  
  def home
      
  end
  
  def authenticate
    
    @authenticated = Hash["user", "unauthenticated", "token", form_authenticity_token]
    
    if authenticated?
      
      @user = current_user
      
      @authenticated = @user.info
    end

    respond_to do |format|
      format.json { render json: @authenticated }
    end
  end
  
end
