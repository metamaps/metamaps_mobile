class MetacodesController < ApplicationController
  # GET /metacodes
  # GET /metacodes.json
  def index
    @metacodes = Metacode.all

    respond_to do |format|
      format.json { render json: @metacodes }
    end
  end

  # GET /metacodes/1
  # GET /metacodes/1.json
  def show
    @metacode = Metacode.find(params[:id])

    respond_to do |format|
      format.json { render json: @metacode }
    end
  end

  # GET /metacodes/new
  # GET /metacodes/new.json
  def new
    @metacode = Metacode.new

    respond_to do |format|
      format.json { render json: @metacode }
    end
  end

  # GET /metacodes/1/edit
  def edit
    @metacode = Metacode.find(params[:id])
  end

  # POST /metacodes
  # POST /metacodes.json
  def create
    @metacode = Metacode.new(params[:metacode])

    respond_to do |format|
      if @metacode.save
        format.json { render json: @metacode, status: :created, location: @metacode }
      else
        format.json { render json: @metacode.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /metacodes/1
  # PUT /metacodes/1.json
  def update
    @metacode = Metacode.find(params[:id])

    respond_to do |format|
      if @metacode.update_attributes(params[:metacode])
        format.json { head :no_content }
      else
        format.json { render json: @metacode.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /metacodes/1
  # DELETE /metacodes/1.json
  def destroy
    @metacode = Metacode.find(params[:id])
    @metacode.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
