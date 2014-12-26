class CompareController < ApplicationController
	def index
		@cart = get_cart
		@tasks = TaskInfo.find(:all)
		render :layout=>"ppat"
	end

	def add_daily_compare
		image_date = params[:ImageDate]
	    branch = params[:Branch]
	    device = params[:Device]
	    platform = params[:Platform]
	    @task_id = PowerRecord.find(:all, :conditions => ['image_date = ? and branch = ? and device = ? and platform = ?', image_date,
	      branch, device, platform]).first.task_id
	    @cart = get_cart
	    @scenarios = PowerRecord.find(:all, :conditions => ['task_id = ?', @task_id], :group => "power_scenario_id")
	    @scenarios.each do |power_record|
	        @record_list = @cart.record_list.build(:power_record => power_record)
	        @record_list.save
	    end
	    respond_to do |format|
	        format.js
	    end
	end

	def add_ondemand_compare

	end
end
