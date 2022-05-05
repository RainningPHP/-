<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="small" type="primary" @click="showAdd">添加文件</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="fileId" border>
      <el-table-column label="名称" prop="fileType"></el-table-column>
      <el-table-column prop="fileNo" label="文件编号"></el-table-column>
      <el-table-column prop="fileTime" label="时间"></el-table-column>
      <el-table-column prop="totalSum" label="概算"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top">
            <el-button
              size="mini"
              @click="handleDownload(scope.row)"
            >{{scope.row.fileName | emplisisText}}</el-button>
          </el-tooltip>
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
    <!-- 上传文件对话框 -->
    <el-dialog
      title="上传文件"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-form ref="upload" :model="fileForm" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="文件编号" prop="fileNo">
              <el-input v-model="fileForm.fileNo" placeholder="请输入文件编号" />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="总估算" prop="totalSum">
              <el-input v-model="fileForm.totalSum" placeholder="请输入总估算" />
            </el-form-item>
          </el-col>-->
          <el-col :span="24">
            <el-form-item label="时间" prop="fileTime">
              <el-date-picker
                clearable
                size="small"
                v-model="fileForm.fileTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选取文件" prop="fileId">
              <el-upload
                ref="upload"
                :limit="1"
                :action="upload.url"
                :headers="upload.headers"
                :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import mixin from "./components/normal.vue";
import { updateCbsjList, getCbsjList } from "@/api/project/project.js";
export default {
  name: "cbsj",
  mixins: [mixin],
  data() {
    return {
      fileForm: {},
      rules: {
        fileNo: [
          { required: true, message: "请输入文件编号", trigger: "blur" }
        ],
        fileTime: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        // totalSum: [
        //   { required: true, message: "请输入总估算", trigger: "blur" }
        // ],

        fileId: [{ required: true, message: "请选取文件", trigger: "change" }]
      }
    };
  },
  methods: {
    getList() {
      getCbsjList(this.projectId).then(res => {
        this.tableData = res.data;
      });
    },
    // 文件上传
    submitFileForm() {
      this.$refs.upload.validate(value => {
        if (value) {
          if (this.isParent) {
            this.fileForm.fileType = "概算文件";
          } else {
            this.fileForm.fileType = "初步设计文件";
          }

          updateCbsjList(this.fileForm).then(res => {
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