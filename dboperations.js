var config=require('./dbconfig');
const sql=require('mssql');

async function getSpecificAVThreshold(){
    try{
        let pool=await sql.connect(config);
        let value= await pool.request().query(
            "SELECT * " +
            "FROM ( "+
            "SELECT ST.Name, R.RegionShortName AS Region, COUNT(SAV.SpecificAvNumber) AS 'AvailableThreshold' "+
            "FROM ServiceType ST "+
            "INNER JOIN SpecificAV SAV ON SAV.fk_ServiceType = ST.pk_ServiceType AND SAV.IsUsed=0 "+
            "INNER JOIN Region R ON R.Id=SAV.RegionId AND R.RegionShortName IN ('AMS','APJ','EMEA') "+
            "GROUP BY ST.Name, R.RegionShortName "+
            ") AS SourceTable PIVOT(AVG(AvailableThreshold) FOR Region IN ([AMS],[APJ],[EMEA])) AS PivotTable"
            );
        return value.recordsets;
    }
    catch (error){
        console.log(error);
    }
}

module.exports ={
    getSpecificAVThreshold:getSpecificAVThreshold
}