class CustomerTanSessionsController < ApplicationController
  skip_before_filter :set_current_user

  # GET /salons/:salon_id/tan_sessions/new
  def new
    @beds = @current_salon.beds.order("bed_number ASC")
    @tan_session = TanSession.new
    @customer = @current_salon.customers.find(session[:customer_id])
  end

  # POST /salons/:salon_id/tan_sessions
  def create
    @tan_session = TanSession.new
    @bed =@current_salon.beds.find_by_bed_number(params[:tan_session][:bed])
    @customer = @current_salon.customers.find(session[:customer_id])

    @tan_session.minutes = params[:tan_session][:minutes]
    @tan_session.bed_id = @bed.id
    @tan_session.customer_id = @customer.id
    @tan_session.salon_id = @current_salon.id
    
    @customer.tan

    #TODO fix this render
    if @customer.save && @tan_session.save
      render :text => "new"
    else
      render :text => "new"
    end
  end
end
