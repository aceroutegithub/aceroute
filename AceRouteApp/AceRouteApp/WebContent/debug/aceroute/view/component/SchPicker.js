Ext.form.SchPicker = Ext.extend(Ext.form.Field, {
	    ui: 'select',
        picker: null,
	    destroyPickerOnHide: false,
	    initComponent: function() {
	        this.addEvents(
	            'change'
	        );
	 
	        this.tabIndex = -1;
	        this.useMask = true;
	        Ext.form.Text.superclass.initComponent.apply(this, arguments);
	    },
	    getSchPicker: function() {
	        if (!this.schPicker) {
	            if (this.picker instanceof Ext.Picker) {
	                this.schPicker = this.picker;
	            } else {
	                this.schPicker = new Ext.Picker(Ext.apply(this.picker || {}));
	            }
	            var hour, mins, ampm;
	            if(typeof this.value !== "undefined"){
	            	var indexOfColumn = this.value.indexOf(':');
	            	hour = this.value.substr(0, indexOfColumn);
	            	var indexOfSpace = this.value.indexOf(' ');
	            	//console.log(' indexOfSpace '+indexOfSpace);
	            	mins = this.value.substr(indexOfColumn+1, indexOfSpace-1);
	            	mins = mins.trim();
	            	if(this.value.indexOf('am') > 0){
	            		ampm = 'am';
	            	}else{
	            		ampm = 'pm';
	            	}
	            	//console.log(' hour >'+hour+"<<");
	            	//console.log(' mins >'+mins+"<<");
	            }
	            this.schPicker.setValue({ ampm: ampm,
	            	hour: hour,
	            	mins: mins}); //this.value || null);
	           
	            this.schPicker.on({
	                scope : this,
	                change: this.onPickerChange,
	                hide  : this.onPickerHide
	            });
	        }
	  
	        return this.schPicker;
	    },
	    onMaskTap: function() {
	        if (Ext.form.SchPicker.superclass.onMaskTap.apply(this, arguments) !== true) {
	            return false;
	        }
	 
	        this.getSchPicker().show();
	    },
	 
	    /**
	     * Called when the picker changes its value
	     * @param {Ext.SchPicker} picker The date picker
	     * @param {Object} value The new value from the date picker
	     * @private
	     */
	    onPickerChange : function(picker, value) {
	        this.setValue(value);
	        this.fireEvent('change', this, this.getValue());
	    },
	 
	    /**
	     * Destroys the picker when it is hidden, if
	     * {@link Ext.form.SchPicker#destroyPickerOnHide destroyPickerOnHide} is set to true
	     * @private
	     */
	    onPickerHide: function() {
	        if (this.destroyPickerOnHide && this.schPicker) {
	            this.schPicker.destroy();
	        }
	    },
	 
	    // inherit docs
	    /**
	     * this will set the value of the picker and will also store the value
	     * in the format specified. If format is not specified then, it will
	     * just concat the columns separated with a pipe(|)
	     */
	    setValue: function(value, animated) {
	        this.value = value;
	        if (this.schPicker) {
	            this.schPicker.setValue(value, animated);
	            this.value = (value != null) ? this.schPicker.getValue() : null;
	        }
	        if (Ext.isObject(this.value)) {
	            if (!this.valueFormat) {
	                var str = '';
	                for (var k in this.value) {
	                    str += this.value[k] + '|';
	                }
	                this.value = str.substr(0, str.length-1);
	            } else {
	                var i = 0;
	                var str = this.valueFormat;
	                for (var k in this.value) {
	                    str = str.replace(k, this.value[k])
	                }
	                this.value = str;
	            }
	        }
	        if (this.rendered) {
	            this.fieldEl.dom.value = this.getValue(true);
	        }
	 
	        return this;
	    },
	 
	    /**
	     * Returns the value of the field, which will be a {@link Date} unless the format parameter is true.
	     * @param {Boolean} format True to format the value with Ext.util.FLabelFieldExormat.defaultDateFormat
	     */
	    getValue: function(format) {
	        var value = this.value || null;
	        return value;
	    },
	 
	    // @private
	    onDestroy: function() {
	        if (this.schPicker) {
	            this.schPicker.destroy();
	        }
	 
	        Ext.form.SchPicker.superclass.onDestroy.call(this);
	    }
	});
	 
	Ext.reg('schpickerfield', Ext.form.SchPicker);