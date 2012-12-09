Ext.form.LabelField = function(config){
    Ext.form.LabelField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.LabelField, Ext.form.Field,  {
    isField: true,
    value: '',
    renderSelectors: {fieldEl: '.aceroute-label-field'},
    renderTpl: [
       '<tpl if="label">',
           '<div class="x-form-label"><span>{label}</span></div>',
       '</tpl>',
       //'<div class="x-form-label x-form-labelfield"><span>{value}</span></div>',
       '<div class="aceroute-label-field"><span>{value}</span></div>',
    ],
    setValue:function(val) {
        this.value = val;
        if(this.rendered){
             this.fieldEl.update('<span>' + val + '</span>');
        }
        return this;
    },

});

Ext.reg('labelfield', Ext.form.LabelField);