<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="建设进度计划" name="jsjdjh" lazy>
        <jsjdjh v-if="updateTag && activeName === 'jsjdjh'"></jsjdjh>
      </el-tab-pane>
      <el-tab-pane label="施工计划" name="sgjh" lazy>
        <sgjh v-if="updateTag && activeName === 'sgjh'"></sgjh>
      </el-tab-pane>
      <el-tab-pane label="设计计划" name="sjjh" lazy>
        <sjjh v-if="updateTag && activeName === 'sjjh'"></sjjh>
      </el-tab-pane>
      <el-tab-pane label="物资计划" name="wzjh" lazy>
        <wzjh v-if="updateTag && activeName === 'wzjh'"></wzjh>
      </el-tab-pane>
      <el-tab-pane label="停电计划" name="tdjh" lazy>
        <tdjh v-if="updateTag && activeName === 'tdjh'"></tdjh>
      </el-tab-pane>
      <el-tab-pane label="属地办证" name="sdbz" lazy>
        <sdbz v-if="updateTag && activeName === 'sdbz'"></sdbz>
      </el-tab-pane>
      <el-tab-pane label="业主项目部组成" name="yzxmbzc" lazy>
        <yzxmbzc v-if="updateTag && activeName === 'yzxmbzc'"></yzxmbzc>
      </el-tab-pane>
      <el-tab-pane label="四通一平" name="styp" lazy>
        <styp v-if="updateTag && activeName === 'styp'"></styp>
      </el-tab-pane>
      <el-tab-pane label="政处需求调查" name="zcxqdc" lazy>
        <zcxqdc v-if="updateTag && activeName === 'zcxqdc'"></zcxqdc>
      </el-tab-pane>

      <el-tab-pane label="跨越工作" name="kygz" lazy>
        <kygz v-if="updateTag && activeName === 'kygz'"></kygz>
      </el-tab-pane>

      <el-tab-pane label="月度计划" name="ydjh" lazy>
        <ydjh v-if="updateTag && activeName === 'ydjh'"></ydjh>
      </el-tab-pane>
      <el-tab-pane label="总体计划" name="ztjh" lazy>
        <ztjh v-if="updateTag && activeName === 'ztjh'"></ztjh>
      </el-tab-pane>
    </el-tabs>
    <!-- <developping></developping> -->
  </div>
</template>

<script>
import developping from "@/views/error/developping.vue";
import Sgjh from "./sgjh";
import Sjjh from "./sjjh";
import Tdjh from "./tdjh";
import Wzjh from "./wzjh";
import Sdbz from "./sdbz";
import Yzxmbzc from "./yzxmbzc";
import Jsjdjh from "./jsjdjh";
import Styp from "./styp";
import Zcxqdc from "./zcxqdc";
import Kygz from "./kygz";
import Ydjh from "./ydjh";
import Ztjh from "./ztjh";
export default {
  name: "jh",
  components: {
    developping,
    Sgjh,
    Tdjh,
    Wzjh,
    Sjjh,
    Sdbz,
    Yzxmbzc,
    Jsjdjh,
    Styp,
    Zcxqdc,
    Kygz,
    Ydjh,
    Ztjh,
  },
  data() {
    return {
      activeName: "jsjdjh",
      updateTag: true,
    };
  },
  methods: {
    handleClick(tab, event) {
      this.updateTag = false;
      this.$nextTick(() => {
        this.updateTag = true;
      });
    },
  },
};
</script>

<style>
</style>