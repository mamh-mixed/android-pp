module DailyHelper
	def get_year(image_date)
       	image_date.to_s.split('-')[0]
    	end
    	def get_month(image_date)
        	image_date.to_s.split('-')[1].to_i - 1
    	end

    	def get_month_d(image_date)
        	image_date.to_s.split('-')[1].to_i
    	end
    	def get_day(image_date)
        	image_date.to_s.split('-')[2]
    	end
    	def get_one_day_before(image_date)
        	image_date.to_s.split('-')[2].to_i - 2
    	end

    	def get_lcd_backlight(value)
        	100 - value
    	end

    	def get_last_date(image_date)
        	year= get_year(image_date).to_s
        	month = get_month_d(image_date).to_s
        	day = get_one_day_before(image_date).to_s
        	Date.parse(year + "-" + month + "-" + day).to_s
    	end

    	def get_power(float)
        	if float.nil?
         		0
        	else
            		index = float.index('.')
            		if index.nil? or float.nil?
                		0
            		else
                		float
            		end
        	end
        end

        def get_sub_name_first(str)
        	index = str.index('(')
        	str[0, index]
    	end
    	def get_sub_name_last(str)
        	index = str.index('(')
        	str[index, str.length]
    	end
end
