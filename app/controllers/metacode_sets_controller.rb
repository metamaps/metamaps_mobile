class MetacodeSetsController < ApplicationController
  
  # GET /metacode_sets/1.json
  def show
    @metacode_set = MetacodeSet.find(params[:id])

    respond_to do |format|
      format.json { render json: @metacode_set }
    end
  end
  
  # GET /metacode_sets/1/metacodes.json
  def metacodes
    @metacode_set = MetacodeSet.find(params[:id])

    respond_to do |format|
      format.json { render json: @metacode_set.metacodes }
    end
  end
  
  
end
