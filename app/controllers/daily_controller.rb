class DailyController < ApplicationController
  	@@start = ""
  	@@end = ""
  	@@category = ""
  	def index
		categorys = PowerScenario.where("category not in ('baremetal', 'CMCC', 'DoU', 'sensor','thermal')").select("distinct category")
		@categorys = []
		categorys.each do |category|
	  		@categorys << category.category
		end
		@categorys << "All"
		@category = @categorys[0]
		@@category = @category
	  	@device=params[:device]
	  	@branch= params[:branch]

	  	image_dates = PowerRecord.where("device = ? AND branch = ? and run_type =  ?", @device, @branch, "daily").select("distinct image_date").order("image_date desc").limit(15)
	  	@start = image_dates.last.image_date
	  	@end = image_dates.first.image_date
	  	@@start = @start
	  	@@end = @end
		@datesEnable = PowerRecord.where(branch: @branch, device: @device, run_type: "daily").select("distinct image_date")
		render :layout=>"ppat"
	end

    def query_record
        device = params[:device]
        branch = params[:branch]
        @record = PowerRecord.joins(:power_scenario).where(branch: branch, device: device, run_type: "daily", verified: "P").group("name").select("distinct name, battery")
        if device == 'pxa1936ff_tz'
            render :json => [{
                :resolution => "1080p",
                :record => @record.to_json(:except => id)
            },{
                :user => true
            }].to_json
        elsif device == 'pxa1908FF_tz' || device == 'pxa1908FF_cmcc'
            @hash["WVGA"] = @record
        else
            @record_1080p = PowerRecord.joins(:power_scenario).where(branch: "lp5.1_k314_alpha1", device: device, run_type: "ondemand", purpose: "1080p LCD").group("name").select("distinct name, battery")
            @record_WVGA = PowerRecord.joins(:power_scenario).where(branch: "lp5.1_k314_alpha1", device: device, run_type: "ondemand", purpose: "2015-05-05_pxa1936-lp5.1_k314_alpha1 WVGA").group("name").select("distinct name, battery")
            if device == 'pxa1936dkb_tz'
                render :json => [{
                    :resolution => "720p",
                    :record => @record
                },{
                    :resolution => "1080p",
                    :record => @record_1080p
                }].to_json
            else
                render :json => [{
                    :resolution => "720p",
                    :record => @record
                },{
                    :resolution => "WVGA",
                    :record => @record_WVGA
                }]
            end
         end
        #render :json=> hash
		#render :layout=>"empty"
    end

	def query
		@scenario_id_list =params[:scenario_id_list]
		image_date = params[:image_date]
		record_num = params[:record_num].to_i
		@device = params[:device]
		@branch = params[:branch]
		@last_image = image_date
		@category = @@category
		record_num_after = record_num / 2
		record_after = PowerRecord.where("image_date >= ? and device = ? and branch = ?", image_date, @device, @branch).select("distinct image_date").order("image_date asc").limit(record_num_after)
		if record_after.last.nil?
			@@end = image_date
		else
			@@end = record_after.last.image_date
		end
		record_before = PowerRecord.where("image_date < ? and device = ? and branch = ?", image_date, @device, @branch).select("distinct image_date").order("image_date desc").limit(record_num - record_after.size)
		@@start = record_before.last.image_date

  		@start = @@start
		@end =  @@end
		respond_to do |format|
			format.js
		end
	end

	def get_comment
	  	image_date = params[:image_date]
	  	battery = params[:battery]
	  	@record = PowerRecord.where(:image_date => image_date, :battery=> battery).last
	  	render :layout=>"empty"
	end

	def  show_chart_by_tab
		@device=params[:device]
		@branch= params[:branch]
		@@category = params[:category]

		@category = @@category
		@start = @@start
		@end =  @@end
		respond_to do |format|
			format.js
		end
	end

	def update_comments
		@image_date = params[:imagedate]
		@power = params[:power]
		@device = params[:device]
		@branch = params[:branch]

		@scenario = PowerScenario.where(name: params[:casename])
		@case = PowerRecord.where(power_scenario_id: @scenario, image_date: @image_date, battery: @power).last

		if params[:verified] != ""
		  	@case.verified=params[:verified]
		end

		if params[:comments] != ""
		  	@case.comments=params[:comments]
		end
		@case.save
	end

	def get_verify
		image_date = params[:image_date]
		battery = params[:battery]
		@record = PowerRecord.where(:image_date => image_date, :battery=> battery).last
		render :layout=>"empty"
	end

	def show_dc
		image_date = params[:image_date]
		battery = params[:battery]
		scenario_name = params[:scenario]
		scenario_id = PowerScenario.where(name: scenario_name).first.id
		@record = PowerRecord.where(:power_scenario_id => scenario_id, :image_date => image_date, :battery => battery ).first
		render :layout=>"empty"
	end
private
	  #get 30 days before given image_date
	def get_last30_date(image_date)
		date = Date.parse(image_date.to_s)
		Date.parse((date - 30).to_s)
	end

	  #get the day before given image_date
	def get_last_date(image_date)
		date = Date.parse(image_date.to_s)
		Date.parse((date - 1).to_s)
	end
end
