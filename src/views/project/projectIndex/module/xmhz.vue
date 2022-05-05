<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" v-if="!isParent">
      <el-col :span="1.5">
        <el-button size="small" type="primary" @click="showAdd">添加文件</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称">
        <template>项目核准</template>
      </el-table-column>
      <el-table-column prop="fileNo" label="文件编号"></el-table-column>
      <el-table-column prop="projectXmhzTime" label="时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top">
            <el-button size="mini" @click="handleDownload(scope.row)">{{scope.row.fileName | emplisisText}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 上传文件对话框 -->
    <el-dialog title="上传文件" :before-close="handelCancel" :visible.sync="dialogVisible" width="50%" append-to-body>
      <el-form ref="upload" :model="fileForm" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="文件编号" prop="file_no">
              <el-input v-model="fileForm.file_no" placeholder="请输入文件编号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="时间" prop="project_xmhz_time">
              <el-date-picker clearable size="small" v-model="fileForm.project_xmhz_time" type="date"
                value-format="yyyy-MM-dd" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选取文件" prop="project_xmhz_file">
              <el-upload :limit="1" :action="upload.url"  :headers="upload.headers" :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    parseTime
  } from "@/utils/ruoyi";
  import mixin from "./components/normal_php.vue";
  import {
    getToken
  } from "@/utils/auth";
  import {
    updateXmhzList,
    getXmhzList,
    commonDownload
  } from "@/api/project/project.js";
  import {
    xmhzAdd
  } from "@/api/project/project_php.js";
  export default {
    name: "xmhz",
    mixins: [mixin],
    data() {
      return {
        fileForm: {

        },
        rules: {
          file_no: [{
            required: true,
            message: "请输入文件编号",
            trigger: "blur"
          }],
          project_xmhz_time: [{
            required: true,
            message: "请选择时间",
            trigger: "change"
          }],
          project_xmhz_file: [{
            required: true,
            message: "请选取文件",
            trigger: "change"
          }]
        }
      };
    },

    methods: {
      getList() {
        getXmhzList(this.projectId).then(res => {
          console.log('查询信息',res)
          this.tableData = res.rows;
        });
      },
      fileIdChange(response) {
        this.$set(this.fileForm, "project_xmhz_file", response.fileId);
        this.$refs.upload.clearValidate("project_xmhz_file");
      },
      // 文件下载处理
      handleDownload(row) {
        commonDownload(row.project_xmhz_file);
      },
      // 文件上传
      submitFileForm() {
        this.$refs.upload.validate(value => {
          if (value) {
            this.fileForm.file_type = "项目核准";
            this.fileForm.type = "4";
            // console.log('参数信息',this.fileForm)
            xmhzAdd(this.fileForm).then(res => {
              this.submitSuccess();
              this.msgSuccess(res.msg);
            });
          }
        });
      }
    }
  };
</script>

<style>
</style>
