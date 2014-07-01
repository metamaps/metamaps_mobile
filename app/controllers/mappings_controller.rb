class MappingsController < ApplicationController
  
  skip_before_filter  :verify_authenticity_token, :only => [:create]
  
  # GET /mappings
  # GET /mappings.json
  def index
    @mappings = Mapping.all

    respond_to do |format|
      format.json { render json: @mappings }
    end
  end

  # GET /mappings/1
  # GET /mappings/1.json
  def show
    @mapping = Mapping.find(params[:id])

    respond_to do |format|
      format.json { render json: @mapping }
    end
  end

  # GET /mappings/new
  # GET /mappings/new.json
  def new
    @mapping = Mapping.new

    respond_to do |format|
      format.json { render json: @mapping }
    end
  end

  # GET /mappings/1/edit
  def edit
    @mapping = Mapping.find(params[:id])
  end

  # POST /mappings
  # POST /mappings.json
  def create
    @mapping = Mapping.new(params[:mapping])

    respond_to do |format|
      if @mapping.save
        format.json { render json: @mapping, status: :created }
      else
        format.json { render json: @mapping.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /mappings/1
  # PUT /mappings/1.json
  def update
    @mapping = Mapping.find(params[:id])

    respond_to do |format|
      if @mapping.update_attributes(params[:mapping])
        format.json { head :no_content }
      else
        format.json { render json: @mapping.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /mappings/1
  # DELETE /mappings/1.json
  def destroy
    @mapping = Mapping.find(params[:id])
    @mapping.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
