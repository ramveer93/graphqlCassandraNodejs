module.exports = {
    fields:{
            name:"text",
            genre:{
                type:"text",
                rule:{
                    required: true
                }
            },
            id:{
                type:"int",
                rule:{
                    validator: function(value){return value>0;},
                    message: function(value){ return 'ID must be greater than 0 , You provided '+value;},
                    required:true
                }
            },
            authorId:"int"
        },
        key:["id"],
        before_save: function (instance, options) {
            console.log("saving data to cassandra");
            return true;
        },
        after_save: function (instance, options) {
            console.log("successfully saved");
            return true;
        },
        before_update: function (queryObject, updateValues, options) {
            return true;
        },
        after_update: function (queryObject, updateValues, options) {
            return true;
        },
        before_delete: function (queryObject, options) {
            return true;
        },
        after_delete: function (queryObject, options) {
            return true;
        },
    }

