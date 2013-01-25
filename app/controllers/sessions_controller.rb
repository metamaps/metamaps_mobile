class SessionsController < ApplicationController

  before_filter :require_no_user, only: [:new, :create]
  before_filter :require_user, only: [:destroy]
    
  respond_to :html, :json
  
  def show
  end
  
  # GET /session/new
  def new
    @session = Session.new
    
	
    respond_with(@session)
  end
  
  # POST /session
  def create
    @session = Session.create(params[:session])
    
    @user = User.new
	
    @map = Map.first(:conditions => [ "id = ?", 5])
		
    if @map
      respond_with(@user, @session, location: map_url(@map)) do |format| 
      end
    else
      respond_with(@user, @session, location: root_url) do |format| 
      end
    end
  end
  
  # DELETE /session
  def destroy
    @session = Session.find
    @session.destroy
    
    respond_to do |format|
      format.html   { respond_with(@session, location: restore(default: root_path)) }
    end
    
  end

end
