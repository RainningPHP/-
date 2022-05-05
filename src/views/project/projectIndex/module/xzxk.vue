<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">类型</div>
        <el-select style="width: 200px" v-model="queryParams.type" @change="getList" placeholder="请选择类型">
          <el-option
            key="1"
            label="前期资料文件"
            value="前期资料文件"
          ></el-option>
          <el-option
            key="2"
            label="行政许可手续"
            value="行政许可手续"
          ></el-option>
        </el-select>

      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" label="序号"></el-table-column>

      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="type" label="类型" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="file_no" label="文件编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="done_time" label="完成时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="file_id" label="附件" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top">
            <el-button
              size="mini"
              @click="handleDownload(scope.row)"
            >附件</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->
    <!-- 添加修改对话框 -->
    <el-dialog
      :title="dialogTitle"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-select v-model="form.name" placeholder="名称">
                <el-option
                  v-for="item in options"
                  :key="item.dict_code"
                  :label="item.dict_label"
                  :value="item.dict_label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件编号" prop="file_no">
              <el-input v-model="form.file_no" placeholder="请输入文件编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option
                  key="1"
                  label="前期资料文件"
                  value="前期资料文件"
                ></el-option>
                <el-option
                  key="2"
                  label="行政许可手续"
                  value="行政许可手续"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="完成时间">
              <el-date-picker
                clearable
                size="small"
                v-model="form.done_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件" prop="fileId">
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
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm" :loading="upload.isUploading">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { parseTime } from "@/utils/ruoyi";
  import { commonDownload } from "@/utils/index";
  import { getToken } from "@/utils/auth";
  import {
    getXzxkList,
    addXzxk,
    getXzxkName
  } from "@/api/project/project_php.js";
  export default {
    name: "xzxk",
    data() {
      return {
        project_id: this.$route.params.projectId,
        // 用户导入参数
        upload: {
          open: false,
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: window.uploadUrl,
          // 上传的文件列表
          fileList: [],

          updateSupport: false
        },

        total: 0,
        queryParams: {
          type: '行政许可手续'
          // pageNum: 1,
          // pageSize: 10
        },
        form: {},
        tableData: [],
        options: {},
        dialogVisible: false,
        dialogTitle: "",
        isAdd: false,
        ids: [],
        single: true,
        multiple: true,
        currentForm: {},
        rules: {
          // fileType: [
          //   { required: true, message: "请选择文件类型", trigger: "change" }
          // ],
          // wjName: [
          //   { required: true, message: "请输入文件名称", trigger: "blur" }
          // ],
          //
          // operName: [
          //   { required: true, message: "请输入上传人", trigger: "blur" }
          // ],
          //
          // fileId: [{ required: true, message: "请上传附件", trigger: "blur" }]
        }
      };
    },
    created() {
      this.getList();
      this.getDict();
    },
    methods: {
      getList() {
        getXzxkList({...this.queryParams, project_id: this.project_id, ...this.queryParams}).then(res => {
          this.tableData = res.data;
          console.log(res)
        });
      },
      getDict() {
        getXzxkName({type: '行政许可手续'}).then(res => {
          console.log(res, 889)
          this.options = res.data;
        })
        // this.getDicts("gfwj_type").then(res => {
        //   this.options.gfwj_type = res.data;
        // });
      },
      fileTypeFormat(row) {
        if (this.options.gfwj_type)
          return this.selectDictLabel(this.options.gfwj_type, row.fileType);
      },
      resetQuery() {
        this.queryParams = { pageNum: 1, pageSize: 10 };
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.dialogTitle = "新增";
        this.isAdd = true;
      },
      handleUpdate() {
        this.dialogVisible = true;
        this.dialogTitle = "修改";
        this.isAdd = false;
        this.form = this.currentForm;
      },
      handleSelectionChange(selection) {
        this.single = selection.length !== 1;
        if (this.single) {
          this.currentForm = {};
        } else {
          this.currentForm = selection[0];
        }
        this.multiple = selection.length === 0;
        if (this.multiple) {
          this.ids = [];
        } else {
          this.ids = selection.map(item => item.id);
        }
      },
      handelCancel() {
        this.dialogVisible = false;
        this.dialogTitle = "";
        this.form = {};
        this.$refs.upload.clearFiles();
      },
      handleFileUploadProgress() {
        this.upload.isUploading = true;
      },
      handleFileSuccess(response, file, fileList) {
        this.upload.isUploading = false;
        this.$set(this.form, "file_id", response.data.file_id);
        console.log(this.form, 888)
      },
      submitForm() {
        this.$refs.form.validate(value => {
          if (value) {
            addXzxk({...this.form, project_id: this.project_id}).then(res => {
              this.handelCancel();
              this.getList();
              this.msgSuccess(res.msg);
            });
          }
        });
      },
      updateForm() {
        this.form.fileType = "2";
        updateGfwjList(this.form).then(res => {
          this.handelCancel();
          this.getList();
          this.msgSuccess(res.msg);
        });
      },
      // 删除
      handleDelete() {
        this.$confirm("是否确认删除数据?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            return delGfwjList(this.ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleDownload(row) {
        if (!row.file_id) {
          return;
        }
        commonDownload(row.file_id);
      },
    },
    filters: {
      emplisisText(value) {
        if (value && value.length > 10) {
          return value.substring(0, 10) + "···";
        } else {
          return value;
        }
      }
    }
  };
</script>
