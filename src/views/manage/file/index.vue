<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">文件名称</div>
        <el-input
          v-model="queryParams.wj_name"
          placeholder="文件名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>

      <div class="btn-group-single">
        <div class="btn-group-single-title">关键字</div>
        <el-input
          v-model="queryParams.key_word"
          placeholder="关键字"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">发文时间</div>
        <el-date-picker
          v-model="queryParams.fw_time"
          type="year"
          value-format="yyyy"
          placeholder="选择发文时间"
          :picker-options="pickerOptions"
          @change="getList"
          size="small"
          style="width: 240px"
        ></el-date-picker>
<!--        -->
<!--        <el-select-->
<!--          v-model=""-->
<!--          placeholder="请选择发文时间"-->
<!--          clearable-->
<!--         -->
<!--          @change="getList"-->
<!--        >-->
<!--          <el-option label="2019以前" value="2019以前" />-->
<!--          <el-option label="2020" value="2020" />-->
<!--          <el-option label="2021" value="2021" />-->
<!--          <el-option label="2022" value="2022" />-->
<!--        </el-select>-->
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="getList"
        >搜索</el-button
      >
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置</el-button
      >
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column
        prop="wj_name"
        label="文件名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="wj_type"
        label="文件类别"
        :show-overflow-tooltip="true"
        :formatter="wjTypeFormat"
      ></el-table-column>
      <el-table-column
        prop="key_word"
        label="关键字"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="oper_name"
        label="发文单位"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        prop="fw_time"
        label="发文时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="oper_time"
        label="上传时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="use_count"
        label="查阅量"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="file_id"
        label="附件"
        :show-overflow-tooltip="true"
        width="200"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.file_name"
            placement="top"
          >
            <el-button size="mini" @click="handleDownload(scope.row)">{{
              scope.row.file_name | emplisisText
            }}</el-button>
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
            <el-form-item label="文件名称" prop="wj_name">
              <el-input v-model="form.wj_name" placeholder="请输入文件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件类别" prop="wj_type">
              <el-select v-model="form.wj_type" placeholder="请选择文件类别">
                <el-option
                  v-for="item in options.wj_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关键字" prop="key_word">
              <el-input v-model="form.key_word" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发文单位" prop="oper_name">
              <el-input v-model="form.oper_name" placeholder="请输入发文单位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发文时间" prop="fw_time">
              <el-date-picker
                v-model="form.fw_time"
                type="year"
                value-format="yyyy"
                placeholder="选择发文时间"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件" prop="file_id">
              <el-upload
                ref="upload"
                :limit="1"
                :action="upload.url"
                :headers="upload.headers"
                :file-list="upload.fileList"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="isAdd"
          type="primary"
          @click.once="submitForm"
          :loading="upload.isUploading"
          >确 定</el-button
        >
        <el-button
          v-else
          type="primary"
          @click.once="updateForm"
          :loading="upload.isUploading"
          >确 定</el-button
        >
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data";
import { parseTime } from "@/utils/ruoyi";
import { commonDownload } from "@/utils/index";
import { getToken } from "@/utils/auth";
import {
  getGfwjList,
  addGfwjList,
  updateGfwjList,
  delGfwjList,
  downloadCount,
} from "@/api/manage/gfwj.js";
export default {
  name: "gfwj",
  data() {
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        },
      },
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

        updateSupport: false,
      },

      total: 0,
      queryParams: {
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
        wj_name: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],

        wj_type: [
          { required: true, message: "请选择文件类别", trigger: "change" },
        ],
        oper_name: [
          { required: true, message: "请输入发文单位", trigger: "blur" },
        ],

        file_id: [{ required: true, message: "请上传附件", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    getList() {
      this.queryParams.fileType = "1";
      this.loading = true
      getGfwjList(this.queryParams).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.loading = false
      }).catch(() => {
        this.loading = false
      });
    },
    getDict() {
      getDicts("wj_type").then((res) => {
        this.options.wj_type = res.data;
      });
    },
    wjTypeFormat(row) {
      if (this.options.wj_type)
        return this.selectDictLabel(this.options.wj_type, row.wj_type);
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增规范文件";
      this.isAdd = true;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改规范文件";
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
        this.ids = selection.map((item) => item.id);
      }
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
      this.$refs.upload.clearFiles();
      this.$refs.form.clearValidate();
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$set(this.form, "file_id", response.data.file_id);
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.oper_time = time;
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          this.form.fileType = "1";
          addGfwjList(this.form).then((res) => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      this.form.fileType = "1";
      updateGfwjList(this.form).then((res) => {
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
        type: "warning",
      })
        .then((res) => {
          return delGfwjList(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDownload(row) {
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
    },
  },
};
</script>
