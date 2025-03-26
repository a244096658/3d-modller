import * as Cesium from "../../Source/Cesium.js";//the one from source instead of build
console.log(Cesium);

/*本模块用途
作为helper，转换我方gis数据到cesium数据。给前端用的。
*/

//1- 转换我们的3dSweep数据到cesium的polylinevolumeGraphics
function toPolylineVolume(geo3dSweep)
{
  //转换shape
  var shape =[]
  geo3dSweep.geometry.profile.forEach(function (value, index) {
    shape.push(new Cesium.Cartesian2(value[0],value[1]));//shape截面的cesium储存格式不是纯数组，是Cartesian2类型的数组
  });
  //转换position
  var position = Cesium.Cartesian3.fromDegreesArrayHeights(geo3dSweep.geometry.line.flat(2));//二维数组转一维数组，来符合cesium数据格式

  var polylineVolume = 
  {
    name:geo3dSweep.properties.name,
    polylineVolume:new Cesium.PolylineVolumeGraphics
    ({
      positions: position,
      shape:shape,
      material: Cesium.Color.BLUE,
    })
  }
  return polylineVolume;
}

//2- 转换我们的3dLine数据到cesium的polyline. (可入到专门的数据处理.js里)
function toPolyline(geo3dLineList)
{
  var polylineList = [];
  geo3dLineList.forEach(function (geo3dLine, index) {
  {
    var position = geo3dLine.geometry.coordinates.flat(2);//cesium的polyline是一维list[1,2,3,4,5,6]
    var polyline = 
    {
      name:"Orange line with black outline at height and following the surface",
      polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
      width: 5,
      //arcType: Cesium.ArcType.NONE,
      clampToGround:false,//线条是否贴地
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE,
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK,
      }),
     },
   };
  polylineList.push(polyline);
  }
})
  return polylineList;

}


// exports.toPolyline = toPolyline;
// exports.toPolylineVolume = toPolylineVolume;

export {toPolylineVolume, toPolyline}