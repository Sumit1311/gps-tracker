/**
 * This file is used as base class for all the DAO classes which provides 
 * the gets the client from persistence strategy which can be used from 
 * other DAOs for purpose of querying database
 * 
 */
/**
 * For getting persistence objects. Which provides the query method 
 * for databse
 * @type {[type]}
 */
var DB=require("./persistence.js");

/**
 * Constructor for base class takes persistence object as argument which
 * is use as persistence strategy. If not given default is Postgres.
 * @param {Object} persistence Object of persistence strategy which 
 *                 provides required methods
 */
function BaseDAO(persistence){
	if(persistence){
		this.persistence=persistence;
	}else{
		this.persistence=DB.persistence();
	}
}

module.exports=BaseDAO;

/**
 * Used to get a client from pool for database to perform queries on
 * that client
 * @return {Promise} execute method query of client given in fulfill
 *                   handler to perform query on database.
 */
BaseDAO.prototype.getClient=function(){
	return this.persistence.getQueryClient();
}