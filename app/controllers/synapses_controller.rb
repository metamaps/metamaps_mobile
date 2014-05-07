class SynapsesController < ApplicationController
  # GET /synapses
  # GET /synapses.json
  def index
    @synapses = Synapse.all

    respond_to do |format|
      format.json { render json: @synapses }
    end
  end

  # GET /synapses/1
  # GET /synapses/1.json
  def show
    @synapse = Synapse.find(params[:id])

    respond_to do |format|
      format.json { render json: @synapse }
    end
  end

  # GET /synapses/new
  # GET /synapses/new.json
  def new
    @synapse = Synapse.new

    respond_to do |format|
      format.json { render json: @synapse }
    end
  end

  # GET /synapses/1/edit
  def edit
    @synapse = Synapse.find(params[:id])
  end

  # POST /synapses
  # POST /synapses.json
  def create
    @synapse = Synapse.new(params[:synapse])

    respond_to do |format|
      if @synapse.save
        format.json { render json: @synapse, status: :created, location: @synapse }
      else
        format.json { render json: @synapse.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /synapses/1
  # PUT /synapses/1.json
  def update
    @synapse = Synapse.find(params[:id])

    respond_to do |format|
      if @synapse.update_attributes(params[:synapse])
        format.json { head :no_content }
      else
        format.json { render json: @synapse.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /synapses/1
  # DELETE /synapses/1.json
  def destroy
    @synapse = Synapse.find(params[:id])
    @synapse.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
