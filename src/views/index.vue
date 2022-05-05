<template>
  <div class="app-container home">
    <div class="map" id="container"></div>
  </div>
</template>

<script>
import { getZbxxList } from "@/api/project/project.js";
import { amapInit } from "@/utils/amap.js";
let biandianzhan = require("@/assets/images/biandianzhan.png");
let dianta = require("@/assets/images/dianta.png");
var AMap = {};
export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "3.5.0",
      center: { lng: 0, lat: 0 },
      zoom: 8,
      map: {},
      markers: [],
      points: [],
      infoWindow: {}
    };
  },
  created() {
    amapInit().then(res => {
      AMap = res;
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        city: "江苏",
        zoom: 13
      });

      this.getPoints();
    });
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    handler({ BMap, map }) {
      this.center.lng = 116.404;
      this.center.lat = 39.915;
    },
    getPoints() {
      getZbxxList().then(res => {
        // console.log(res);
        // this.points = res.rows;
        // this.center.lng = this.points[17].longitude;
        // this.center.lat = this.points[17].latitude;
        // console.log(this.center);
      });
      setTimeout(() => {
        this.points = [
          // {
          //   title: "111",
          //   lng: 116.399688,
          //   lat: 39.91179,
          //   type: 0,
          //   contents: "1111111"
          // },
          // {
          //   title: "222",
          //   lng: 116.404,
          //   lat: 39.915,
          //   type: 1,
          //   contents: "22222222222222"
          // }
        ];
        this.addInfoWindow();
        this.points.forEach(item => {
          this.addMarker(item);
        });
        this.map.setFitView();
      }, 0);
    },
    // 实例化点标记
    addMarker(point) {
      let marker = {};
      if (point.type) {
        marker = new AMap.Marker({
          map: this.map,
          icon: dianta,
          position: [point.lng, point.lat],

          offset: new AMap.Pixel(-20, -20)
        });
      } else {
        marker = new AMap.Marker({
          map: this.map,
          icon: biandianzhan,
          position: [point.lng, point.lat]
        });
      }

      marker.content = "我是第" + point.contents + "个Marker";
      marker.on("click", this.markerClick);
      // marker.emit("click", { target: marker });
      this.markers.push(marker);
    },
    addInfoWindow() {
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -25)
      });
    },
    markerClick(e) {
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    }
  }
};
</script>

<style scoped lang="scss">
.map {
  height: calc(100vh - 84px);
}
.home {
  padding: 0;
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

