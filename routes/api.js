var proj4 = require('proj4');
var fs = require("fs");
var Cesium = require("cesium");
const { transform } = require('proj4');



/* polylineList 数据结构
[
  {
    name: 'Orange line with black outline at height and following the surface',
    polyline: {
      positions: [Array],
      width: 5,
      clampToGround: false,
      material: [PolylineOutlineMaterialProperty]
    }
  }
]

*/

var Alignment = 
{
  //1-geojson official schema
    getAllPoints: function(req, res, next) 
    {
    // var username = req.body.username;
    // var password = req.body.password;
    //添加geojson 测试数据，假设是从业务层算出来的。现在这边只写接口层
    var polyGeoJson= {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                127.529296875,
                50.233151832472245
              ],
              [
                125.72753906249999,
                53.12040528310657
              ],
              [
                123.134765625,
                53.409531853086435
              ],
              [
                119.83886718750001,
                52.96187505907603
              ],
              [
                119.88281249999999,
                51.42661449707482
              ],
              [
                118.6083984375,
                49.63917719651036
              ],
              [
                116.76269531249999,
                49.83798245308484
              ],
              [
                115.7080078125,
                47.724544549099676
              ],
              [
                118.21289062499999,
                47.96050238891509
              ],
              [
                119.53125,
                46.830133640447386
              ],
              [
                116.98242187499999,
                46.255846818480315
              ],
              [
                113.0712890625,
                44.62175409623324
              ],
              [
                106.5234375,
                42.293564192170095
              ],
              [
                95.97656249999999,
                42.87596410238256
              ],
              [
                89.6044921875,
                46.13417004624326
              ],
              [
                88.154296875,
                49.009050809382046
              ],
              [
                84.1552734375,
                46.86019101567027
              ],
              [
                78.92578124999999,
                41.705728515237524
              ],
              [
                72.861328125,
                40.17887331434696
              ],
              [
                75.234375,
                34.994003757575776
              ],
              [
                81.6064453125,
                29.6880527498568
              ],
              [
                86.9677734375,
                27.994401411046148
              ],
              [
                93.7353515625,
                26.667095801104814
              ],
              [
                98.3056640625,
                27.68352808378776
              ],
              [
                97.6904296875,
                24.00632619875113
              ],
              [
                100.81054687499999,
                21.002471054356725
              ],
              [
                104.0625,
                22.228090416784486
              ],
              [
                107.57812499999999,
                22.06527806776582
              ],
              [
                109.77539062499999,
                20.427012814257385
              ],
              [
                108.45703125,
                18.729501999072138
              ],
              [
                109.77539062499999,
                18.22935133838668
              ],
              [
                110.9619140625,
                19.559790136497412
              ],
              [
                114.521484375,
                22.553147478403194
              ],
              [
                121.37695312499999,
                21.820707853875017
              ],
              [
                123.0908203125,
                25.12539261151203
              ],
              [
                121.9921875,
                30.44867367928756
              ],
              [
                120.89355468749999,
                34.016241889667015
              ],
              [
                120.673828125,
                36.98500309285596
              ],
              [
                122.607421875,
                37.23032838760387
              ],
              [
                118.3447265625,
                38.54816542304656
              ],
              [
                121.728515625,
                40.78054143186033
              ],
              [
                121.55273437499999,
                38.993572058209466
              ],
              [
                124.49707031249999,
                39.90973623453719
              ],
              [
                131.484375,
                43.35713822211053
              ],
              [
                131.748046875,
                44.715513732021336
              ],
              [
                135,
                48.04870994288686
              ],
              [
                130.693359375,
                48.516604348867475
              ],
              [
                127.529296875,
                50.233151832472245
              ]
            ]
          ]
        }
      }
    ]
    }
        res.json(polyGeoJson)
    },
    //2-self-defined geojson for containing 3d-coordinates
    getAlignment:function(req,res,next)
    {
    //var p1 = "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs ";//这是beijing54的投影坐标系
    //var p2 = "+proj=longlat +datum=WGS84 +no_defs ";//这是wgs84的地理坐标系
    //console.log(proj4(p1,p2,[ 447954.6195175554, 4419421.83027916 ]));//从p1转换到p2，就是投影坐标到地理坐标，所以[]里输入的是投影坐标。 ->转换结果是[ 74.39070173215043, 39.90696070269679 ]
    //console.log(proj4(p2,p1,[ 74.39070173215043, 39.90696070269679 ]));//从p2转换到p1，就是地理坐标到投影坐标，所以[]里输入的是地理坐标 ->转换结果是[ 447954.6195175554, 4419421.83027916 ]
    //define coordinate system
    var wgs84_pr0j_world = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";//这是wgs84的投影坐标系 
    var wgs84_proj_utm18 ="+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs ";
    var wgs84_proj_utm17 = "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs";//EPSG:32617
    var wgs84_llh_world = "+proj=longlat +datum=WGS84 +no_defs ";//这是wgs84的地理坐标系 EPSG:4326
    var CGCS2000__CM108E = "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";//EPSG:4545
    var CGCS2000 = "+proj=longlat +ellps=GRS80 +no_defs ";
    //get alignment data in xyz format
    var data = JSON.parse(fs.readFileSync('public/alignment.txt').toString());//fs.readFileSync('public/alignment.txt')返回的是文件buffer，先转成string,再parse成对象。即list对象。
    var llh=[];
    // convert xyz to llh
    data.forEach(function (value, index) {
      llh.push(proj4(wgs84_proj_utm17,wgs84_llh_world,value));// 顺序是[东距、北距]。 需要转成wgs84的llh，因为cesium默认使用的就是wgs84的。
    });
    //console.log(llh);
    //发送的是一个geo3dLine的list，即便只有一个对象. <- think from how dynamo works the input
    var geo3dLineList = [];
    var geo3dLine = 
    {
      "type": "Feature",
      "geometry": 
      {
      "type": "LineString",
      "coordinates": llh,//[[x,y,z],[x,y,z]]
      },
      "properties": {
      "name": "Dinagat Islands"
    }}
    geo3dLineList.push(geo3dLine);
    res.json(geo3dLineList);
    //var cesium3dLineList = Transform.toPolyline(geo3dLineList);//转换为cesium的数据. 可以后端转换，但是不能stringifry，发不到前端。所以后端还是发普通数据过去。
    //console.log(geo3dLineList);
    },

    //3-get ground line. 可以跟getAlignment函数合并，进行parameter切换
    getBridgeLine:function(req,res,next)
    {
    //var p1 = "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs ";//这是beijing54的投影坐标系
    //var p2 = "+proj=longlat +datum=WGS84 +no_defs ";//这是wgs84的地理坐标系
    //console.log(proj4(p1,p2,[ 447954.6195175554, 4419421.83027916 ]));//从p1转换到p2，就是投影坐标到地理坐标，所以[]里输入的是投影坐标。 ->转换结果是[ 74.39070173215043, 39.90696070269679 ]
    //console.log(proj4(p2,p1,[ 74.39070173215043, 39.90696070269679 ]));//从p2转换到p1，就是地理坐标到投影坐标，所以[]里输入的是地理坐标 ->转换结果是[ 447954.6195175554, 4419421.83027916 ]
    //define coordinate system
    var wgs84_pr0j_world = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";//这是wgs84的投影坐标系 
    var wgs84_proj_utm18 ="+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs ";
    var wgs84_proj_utm17 = "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs";//EPSG:32617
    var wgs84_llh_world = "+proj=longlat +datum=WGS84 +no_defs ";//这是wgs84的地理坐标系 EPSG:4326
    var CGCS2000__CM108E = "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";//EPSG:4545
    var CGCS2000 = "+proj=longlat +ellps=GRS80 +no_defs ";
    //get alignment data in xyz format
    var data = JSON.parse(fs.readFileSync('public/bridgeLine.txt').toString());//fs.readFileSync('public/alignment.txt')返回的是文件buffer，先转成string,再parse成对象。即list对象。
    var llh=[];
    // convert xyz to llh
    data.forEach(function (value, index) {
      llh.push(proj4(wgs84_proj_utm17,wgs84_llh_world,value));// 顺序是[东距、北距]。 需要转成wgs84的llh，因为cesium默认使用的就是wgs84的。
    });
    console.log(llh);
    //构建跨径线polyline的list. 两两组队 ->[[x,y,z],[x,y,z]]
    var geo3dLineList = [];
    llh.forEach(function(value, index){
      var bridgeLineList = [];
      var geo3dLine = {};
      if(index%2==0)
      {
        bridgeLineList.push(value);
        bridgeLineList.push(llh[index+1]);
        geo3dLine = 
        {
          "type": "Feature",
          "geometry": 
          {
          "type": "LineString",
          "coordinates": bridgeLineList,//[[],[]] 两个点的polyline
          },
          "properties": {
          "name": "Dinagat Islands"
          }
        }
        geo3dLineList.push(geo3dLine);
      }
    })

      res.json(geo3dLineList)
      console.log(geo3dLineList);
    
    },


};

 

var SuperStructure =
{
    getGirder:function(req, res, next)//测试一个3d entity的数据
    {
        //自己定义的三维模型数据结构:simplfied sweep
        var geo3dSweep = 
        {
            "type": "sweep",
            "geometry": {
            "profile": [[-12100,-572],[-12250,-642],[-11987,-1558],[-11265,-1595],[-11215,-1545],[-10953,-622],[-11103,-552]],//local c2 coordinate system
            "line":[[-85,39,1000],[-85,38,2000]],// llh coordinate system
            },
            "properties": {
            "name": "girder entity 3d"
        }}
        res.json(geo3dSweep)
    }
}

//坐标转换
//读取坐标文件
// 异步读取
// fs.readFile('public/alignment.txt', function (err, data) {
//   if (err) {
//       return console.error(err);
//   }
//   console.log("异步读取: " + data.toString());
// });

// 同步读取
// var data = fs.readFileSync('public/alignment.txt');






exports.Alignment = Alignment;
exports.SuperStructure = SuperStructure;
// exports.ServiceInterface = ServiceInterface;
// exports.PluginInterface = PluginInterface;
// exports.NotificationRegistryInterface=NotificationRegistryInterface;