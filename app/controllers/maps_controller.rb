class MapsController < ApplicationController
  # GET /maps.json
  def index
    @maps = Map.all

    respond_to do |format|
      format.json { render json: @maps }
    end
  end

  # GET /maps/1.json
  def show
    @map = Map.find(params[:id])

    respond_to do |format|
      format.json { render json: @map.topics }
    end
  end

  # POST /maps.json
  def create
    @map = Map.new(params[:map])

    respond_to do |format|
      if @map.save
        format.json { render json: @map, status: :created, location: @map }
      else
        format.json { render json: @map.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /maps/1.json
  def update
    @map = Map.find(params[:id])

    respond_to do |format|
      if @map.update_attributes(params[:map])
        format.json { head :no_content }
      else
        format.json { render json: @map.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /maps/1.json
  def destroy
    @map = Map.find(params[:id])
    @map.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
