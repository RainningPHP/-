<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="userName" label="项目经理"></el-table-column>
      <el-table-column prop="lzTime" label="履职日期"></el-table-column>
      <el-table-column prop="lzDuration" label="履职时长"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="getHyDetail(scope.row)"
            >会议详情</el-button
          >
          <el-button size="mini" @click="getDkDetail(scope.row)"
            >打卡详情</el-button
          >
          <el-button size="mini" @click="getJcDetail(scope.row)"
            >检查详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="会议详情"
      :visible.sync="dialogVisibleMeeting"
      width="60%"
      :before-close="handleCloseMeeting"
    >
      <el-table
        :data="MeetingListData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="meetingName" label="会议名称"></el-table-column>
        <el-table-column prop="meetingName" label="会议类型"></el-table-column>
        <el-table-column prop="meetingTime" label="会议时间"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDownloadMeeting1(scope.row)"
              >查看图片</el-button
            >
            <el-button size="mini" @click="handleDownloadMeeting2(scope.row)"
              >下载会议纪要</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalMeeting > 0"
        :total="totalMeeting"
        :page.sync="queryParamsMeeting.pageNum"
        :limit.sync="queryParamsMeeting.pageSize"
        @pagination="getMeetingList"
      />
    </el-dialog>
    <el-dialog
      title="打卡详情"
      :visible.sync="dialogVisibleDk"
      width="50%"
      :before-close="handleCloseDk"
    >
      <el-table
        :data="DkListData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="dkAddress" label="打卡地点"></el-table-column>
        <el-table-column prop="dkTimeIn" label="进场时间"></el-table-column>
        <el-table-column prop="dkTimeOut" label="离场时间"></el-table-column>
      </el-table>
      <pagination
        v-show="totalDk > 0"
        :total="totalDk"
        :page.sync="queryParamsDk.pageNum"
        :limit.sync="queryParamsDk.pageSize"
        @pagination="getDkLists"
      />
    </el-dialog>

    <el-dialog
      title="检查详情"
      :visible.sync="dialogVisibleJc"
      width="50%"
      :before-close="handleCloseJc"
    >
      <el-table
        :data="JcListData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="checkTime" label="检查时间"></el-table-column>
        <el-table-column prop="checkType" label="检查类型"></el-table-column>
        <el-table-column prop="checkContent" label="问题描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDownloadCheck1(scope.row)"
              >查看图片</el-button
            >
            <el-button size="mini" @click="handleDownloadCheck2(scope.row)"
              >下载整改清单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalJc > 0"
        :total="totalJc"
        :page.sync="queryParamsJc.pageNum"
        :limit.sync="queryParamsJc.pageSize"
        @pagination="getJcLists"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getJdglList,
  getHyList,
  getDkList,
  getJcList,
  getFileUrl,
} from "@/api/project/project.js";
export default {
  name: "jdgl",
  data() {
    return {
      projectId: this.$route.params.id,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,

      //   会议
      dialogVisibleMeeting: false,
      totalMeeting: 0,
      queryParamsMeeting: {
        pageNum: 1,
        pageSize: 10,
      },
      MeetingListData: [],

      // 打卡
      //   会议
      dialogVisibleDk: false,
      totalDk: 0,
      queryParamsDk: {
        pageNum: 1,
        pageSize: 10,
      },
      DkListData: [],
      // 检查
      dialogVisibleJc: false,
      totalJc: 0,
      queryParamsJc: {
        pageNum: 1,
        pageSize: 10,
      },
      JcListData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getDetail() {},
    getList() {
      getJdglList({ projectId: this.projectId }).then((res) => {
        // console.log(res);
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    // 文件下载处理
    handleDownload(row) {
      console.log(row);
      var id = row.file;
      var url = row.filePath;
      var suffix = url.substring(url.lastIndexOf("."), url.length);
      const a = document.createElement("a");
      a.setAttribute("download", name + suffix);
      a.setAttribute("target", "_blank");
      a.setAttribute("href", url);
      a.click();
    },
    // 会议
    getHyDetail(row) {
      this.dialogVisibleMeeting = true;
      this.getMeetingList({
        projectId: this.projectId,
        meetingTime: row.lzTime,
        ...this.queryParamsMeeting,
      });
    },
    getMeetingList(params) {
      getHyList(params).then((res) => {
        this.MeetingListData = res.rows;
      });
    },
    handleCloseMeeting() {
      this.dialogVisibleMeeting = false;
    },
    handleDownloadMeeting1(row) {
      getFileUrl(row.meetingPhotoId1).then((res) => {
        console.log(res);
        this.handleDownload(res.data);
      });
    },
    handleDownloadMeeting2(row) {
      getFileUrl(row.meetingFileId).then((res) => {
        this.handleDownload(res.data);
      });
    },

    // 打卡
    getDkDetail(row) {
      this.dialogVisibleDk = true;
      this.getDkLists({
        projectId: this.projectId,
        dkTimeIn: row.lzTime,
        ...this.queryParamsDK,
      });
    },
    getDkLists(params) {
      getDkList(params).then((res) => {
        this.DkListData = res.rows;
      });
    },
    handleCloseDk() {
      this.dialogVisibleDk = false;
    },
    handleDownloadDk(row) {
      getFileUrl(row.DkPhotoId1).then((res) => {
        this.handleDownload(res.data);
      });
    },
    // 检查
    getJcDetail(row) {
      this.dialogVisibleJc = true;
      this.getJcLists({
        projectId: this.projectId,
        checkTime: row.lzTime,
        ...this.queryParamsDK,
      });
    },
    getJcLists(params) {
      getJcList(params).then((res) => {
        this.JcListData = res.rows;
      });
    },
    handleCloseJc() {
      this.dialogVisibleJc = false;
    },
    handleDownloadCheck1(row) {
      getFileUrl(row.checkPhotoId1).then((res) => {
        this.handleDownload(res.data);
      });
    },
    handleDownloadCheck2(row) {
      getFileUrl(row.checkFileId).then((res) => {
        this.handleDownload(res.data);
      });
    },
  },
};
</script>

<style>
</style>