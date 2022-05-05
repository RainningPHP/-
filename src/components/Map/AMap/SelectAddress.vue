<template>
  <div>
    <el-input @click.native="openMap" placeholder="选择地址" v-model="address"></el-input>

    <el-dialog
      title="地图打点"
      width="80%"
      :visible.sync="dialogVisible"
      :before-close="beforeClose"
      append-to-body
    >
      <div v-loading="loading">
        <div id="panel">
          <el-input v-model="lnglat" @keyup.enter.native="regeoCode" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="regeoCode"></el-button>
          </el-input>
          <el-input v-model="currentAddress.address" size="mini"></el-input>
        </div>
        <div id="container"></div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeClose()">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { amapInit } from "@/utils/amap.js";
var AMap = {};

export default {
  name: "selectAddress",
  components: {
    // loading
  },
  props: {
    address: {},
    lng: {},
    lat: {}
  },

  data() {
    return {
      loading: true,
      showMap: false,
      dialogVisible: false,
      map: {},
      marker: {},
      mapData: [],
      keyword: "",
      geocoder: "",
      lnglat: "",
      currentAddress: {}
    };
  },
  methods: {
    openMap() {
      this.dialogVisible = true;
      this.initMap();
    },
    initMap() {
      this.loading = true;
      amapInit().then(res => {
        AMap = res;
        this.loading = false;
        this.map = new AMap.Map("container", {
          resizeEnable: true,
          zoom: 12,
          isHotspot: true
        });
        this.geocoder = new AMap.Geocoder({
          city: "全国" //城市设为北京，默认：“全国”
        });
        this.marker = new AMap.Marker();
        if (this.lng && this.lat) {
          this.lnglat = this.lng + "," + this.lat;
          this.currentAddress.address = this.address;
          this.map.add(this.marker);
          this.marker.setPosition([this.lng, this.lat]);
          this.map.setFitView();
        }
        this.map.on("click", e => {
          this.lnglat = e.lnglat.lng + "," + e.lnglat.lat;
          this.regeoCode();
        });
      });
    },
    save() {
      if (this.currentAddress.address) {
        // console.log(this.currentAddress);
        this.$emit("changeAdd", this.currentAddress);
        this.beforeClose();
      } else {
        this.$message.error("请正确打点");
      }
    },
    beforeClose() {
      this.map.destroy();
      this.map = "";
      this.lnglat = "";
      this.currentAddress = {};
      this.dialogVisible = false;
    },
    regeoCode() {
      var lnglat = this.lnglat.split(",");
      this.currentAddress.lng = lnglat[0];
      this.currentAddress.lat = lnglat[1];
      this.map.add(this.marker);
      this.marker.setPosition(lnglat);
      this.map.setFitView();

      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          this.currentAddress.address = result.regeocode.formattedAddress;
          this.$forceUpdate();
        } else {
          console.error("根据经纬度查询地址失败");
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 500px;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 150px;
  right: 50px;
  width: 280px;
  z-index: 10;
  padding: 20px;
  box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
  .el-input {
    margin-bottom: 10px;
  }
}
</style>