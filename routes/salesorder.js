module.exports = function(app) {

	app.get('/salesorder/:facility_name/:order_id/:cust_ref_num/:customer_id/:order_status/:item/:shipdate/:orderdate/:filteroptions/:filtervalue', function(req, res, next) {
		var salesorder = app.get('order');
		var facility_name = req.params.facility_name;
		var order_id = req.params.order_id;
		var cust_ref_num = req.params.cust_ref_num;
		var customer_id = req.params.customer_id;
		var order_status = req.params.order_status;
		var item = req.params.item;
		var shipdate = req.params.shipdate;
        var orderdate = req.params.orderdate;
        var filteroptions = req.params.filteroptions;
        var filter_value = req.params.filtervalue;
		
		var condition = {};
		var fields = {};
		condition.where ={};
		condition.where.$and =[{}];

		
		if (facility_name != "undefined" && facility_name != "null") condition.where.Facility_Name = {$eq: facility_name};
		if (order_id != "undefined" && order_id != "null") condition.where.Order_ID = {$eq: order_id};
		if (cust_ref_num != "undefined" && cust_ref_num != "null") condition.where.CUST_ORDER_NBR = {$eq: cust_ref_num};
		if (customer_id != "undefined" && customer_id != "null") condition.where.Customer_ID = {$eq: customer_id};
		if (item != "undefined" && item != "null") {	
			  condition.where.$and.push({ Order_line: { $elemMatch: {Item_ID: {$eq: item}}}});
		}
		
		if (order_status != "undefined" && order_status != "null") condition.where.Status = {$eq: order_status};

		if (shipdate !="undefined" && shipdate != "null" ) {
				condition.where.$and.push({ Order_line:  { $elemMatch: {ActShipmentDate: {$eq: shipdate}}}});
		}
		
		if (orderdate != "undefined" && orderdate != "null") condition.where.Order_Created = {$eq:orderdate};

		if (filteroptions == "Batch Number")
			if (filter_value !="undefined" && filter_value != "null") condition.where.$and.push({ Order_line: { $elemMatch: {Batch_Number: {$eq: parseInt(filter_value)}}}});

		if (filteroptions == "Partial Ship")
			if (filter_value !="undefined" && filter_value != "null") condition.where.Partial_Ship = {$eq: filter_value=="true"? true:false};

		if (filteroptions == "Back Order Number")
			if (filter_value !="undefined" && filter_value != "null") condition.where.$and.push({ Order_line: { $elemMatch: {Back_Order_Number: {$eq: parseInt(filter_value)}}}});

		if (filteroptions == "Order Line Modified")
			if (filter_value !="undefined" && filter_value != "null") condition.where.$and.push({ Order_line: { $elemMatch: {Order_Line_Modified: {$eq: filter_value}}}});									

/*		if (filteroptions == "Late_Shipment"){
			if (filter_value == "true") condition.where.$and.push({ Order_line: { $elemMatch: {ActShipmentDate: {$gt: { Order_line.Est_Shipment_Date}}}}});
			else if (filter_value == "false") condition.where.$and.push({ Order_line: { $elemMatch: {ActShipmentDate: {$lte: { Order_line.Est_Shipment_Date}}}}});
		}

		if (filteroptions == "Shrt_ship"){
			if (filter_value == true) condition.where.$and.push({ Order_line: { $elemMatch: { Shipped_Qty: {$lt: { Order_line.Ordered_QTY}}}}});
			else if (filter_value == false)	condition.where.$and.push({ Order_line: { $elemMatch: { Shipped_Qty: {$eq: { Order_line.Ordered_QTY}}}}});
		}		
*/
		/*condition.where = {"Order_ID":{"$eq":"88-3458-99"}};
		condition.where.$and = [{"Order_line":{"$elemMatch":{"Item_ID":{"$eq":"SP7875"}}}}, 
							    {"Order_line":{"$elemMatch":{"ActShipmentDate":{"$eq":"2015-11-18"}}}];*/

		fields = 
					{'_id':0,'Facility_Name':1,'Order_ID':1,'CUST_ORDER_NBR':1,'DEST_ID':1,'Status':1,
					 'Partial_Ship':1,'Order_Created':1,'Order_Total':1,'Carrier':1,'Service_Level':1,
					 'Order_line':1,'Customer_ID':1,'Order_Line_Modified':1};

				salesorder.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						//console.log("Result is : " +  result);
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
					});
	});		
	app.get('/salesorder/:order_id',function(req, res, next) {
		var salesorder = app.get('order');
		var order_id = req.params.order_id;
		
		var condition = {};
		var fields = {};
		condition.where ={};
		condition.where.$and =[{}];
		
		if (order_id != "undefined" && order_id != "null") condition.where.Order_ID = {$eq: order_id};
		console.log("where +++++", JSON.stringify(condition.where));	
		
		fields = 
					{'_id':0,'Facility_Name':1,'Order_ID':1,'CUST_ORDER_NBR':1,'BOL_NBR':1,'DEST_ID':1,
					 'Order_Total':1,'Order_Created':1,'Customer_ID':1,'Status':1,'Carrier':1,'Service_Level':1,
					'Partial_Ship':1};

				salesorder.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						//console.log("Result is : " +  result);
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
					});
		
	});
	app.get('/salesorder/item/:item',function(req, res, next) {
		var salesorder = app.get('order');
		var item = req.params.item;
		
		var condition = {};
		var fields = {};
		condition.where ={};
		condition.where.$and =[{}];
		
		if (item != "undefined" && item != "null") {	
			  condition.where.$and.push({ Order_line: { $elemMatch: {Item_ID: {$eq: item}}}});
		}
		console.log("where -----", JSON.stringify(condition.where));	
		
		fields = 
					{'_id':0,'Order_line.Order_line_Status':1,'Order_line.Item_ID':1,'Order_line.Ordered_QTY':1,'Order_line.Container_ID':1,'Order_line.Est_Shipment_Date':1,
					 'Order_line.ActShipmentDate':1,'Order_line.Tracking_Number':1,'Order_line.Shipped_Qty':1,'Order_line.Date_Delivered':1,'Order_line.Unit_Price':1,'Order_line.Order_Line_Created':1,
					'Order_line.Order_Line_Modified':1,'Order_line.Back_Order_Number':1,'Order_line.Batch_Number':1};

				salesorder.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						//console.log("Result is : " +  result);
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
					});
		
	});
	}
	