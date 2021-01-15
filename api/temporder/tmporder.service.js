const pool = require('../../config/database');



module.exports = {
    add:(data,callback) => {
        pool.query('insert into tblTempOrder (tOrderPiece,tOrderPrice,userID) values(?,?,?,?)',
        [
        data.torderPiece,
        data.torderPrice,
        data.userID,
        ],
        (error,results,fields)=>{
            if(error){
               return callback(error)
            }
            return callback(null,results)
          }
        );
    },
    //SELECT tOrderID,userID,tOrderPiece,tOrderPrice from tblTempOrder
    //getTmpOrders:(id ,callBack) => {
    //    pool.query('call spGetBasket(?);',
    //    [id],
    //    (error,results,fields) =>{
    //        if(error){
    //           return callBack(error);
    //        }
    //        return callBack(null,results[0]);
    //    });
    //},
    //stored procedure ile id yi vererek kullanıcıların adresini v  siparişini çekiyorum.
    getTmpOrdersAndAddress: (id ,callBack) => {
        var data = {siparisData:[],addressData : []}
         pool.query('call spGetBasket(?);',[id],
        (err,results)=>{
            if(err){
                return callBack(err);
            }
            data.siparisData = results[0];
            pool.query('call spGetUserAddress(?);',[id],
            (err,results)=>{
                if(err){
                    return callBack(err);
                }
                data.addressData = results[0];
                //console.log(data)
                return callBack (null,data);
            });
        });
    },    
    //DELETE FROM `MTSK`.`tblTempOrder` WHERE (`userID` ='?') AND (`tOrderID`='?');
    deleteTmpOrders: (data,callBack) =>{
        //console.log(data);
        pool.query("call spTempOrderDelete(?,?);",
        [
        data.userID, 
        data.tOrderID
        ],
        (error,results,fields) =>{
            if(error){
                callBack(error);
            }
            console.log(results)
            return callBack(null,results['affectedRows']);          
        });
    }, 
    deleteAllTmpOrders: (data,callBack) =>{
        //console.log(data);
        pool.query("call spClearBasket(?);",
        [
        data.userID, 
        ],
        (error,results,fields) =>{
            if(error){
                callBack(error);
            }
            console.log(results)
            return callBack(null,results['affectedRows']);          
        });
    }, 
//////////////////////////////ADDRESS//////////////////////////////
    
    getAddressCities: callBack => {
        var data ={ cities: [], districts: []}
        pool.query('SELECT * FROM MTSK.vwCities;',
        [],
        (error,results,) =>{
            if(error){
               return callBack(error);
            }
            data.cities = results;
            pool.query('SELECT * FROM MTSK.vwDistrict;',
            [],
            (error,results) =>{
                if(error){
                   return callBack(error);
                }
                data.districts = results;
                
                return callBack(null,data);
            });    
        });
    },
    addAddress:(data,callback) => {
        pool.query('insert into tblAddress (cityID,districtID,openAddress,userID) values(?,?,?,?)',
        [
        data.cityID,
        data.districtID,
        data.openAddress,
        data.userID,
        ],
        (error,results,fields)=>{
            if(error){
               return callback(error)
            }
            return callback(null,results[0])
          }
        );
    }

}