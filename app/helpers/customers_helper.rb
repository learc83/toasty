module CustomersHelper
  def type_and_details_for(customer)
    str = ", #{customer.details}" if customer.details
    "#{customer.word_for_type}#{str}"
  end

  def customer_form_submit_button
    if @customer.new_record?
      output = '<input id="add_customer_button" type="submit" 
                value="Add Customer"/>'
    else
      output = '<input id="edit_customer_button" type="submit" 
                value="Save Changes"/>'
    end

    output.html_safe
  end

  def customer_cancel_changes_link
    unless @customer.new_record?
      %Q{<div id="cancel_link_wrapper"> 
        #{link_to "Cancel Changes",salon_customer_path(@current_salon,@customer)}
      </div>}.html_safe
    end
  end

  def customer_error_handler
    render :partial => 'errors' if @customer.errors.any?
  end
end
