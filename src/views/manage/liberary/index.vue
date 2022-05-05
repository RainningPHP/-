<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="经验名称">
        <el-input
          v-model="queryParams.liberary_name"
          placeholder="经验名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="关键词">
        <el-input
          v-model="queryParams.key_word"
          placeholder="请输入关键词"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
    </el-form>

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
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column
        prop="liberary_type"
        label="类型"
        :formatter="liberaryTypeFormat"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="key_word"
        label="关键字"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="user_name"
        label="分享人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="liberary_name"
        label="经验名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="zy"
        label="专业"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="xzhd"
        label="小组活动"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="oper_time"
        label="上传时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="dk_time"
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
            <el-form-item label="类型" prop="liberaryType">
              <el-select v-model="form.liberary_type" placeholder="请选择类型">
                <el-option
                  v-for="item in options.liberary_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="form.key_word" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分享人" prop="userName">
              <el-input
                v-model="form.user_name"
                placeholder="请输入分享人账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="经验名称" prop="liberaryName">
              <el-input
                v-model="form.liberary_name"
                placeholder="请输入经验名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="专业" prop="zy">
              <el-input v-model="form.zy" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="小组活动" prop="xzhd">
              <el-input v-model="form.xzhd" placeholder="请输入小组活动" />
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
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { commonDownload } from "@/utils/index";
import { getDicts } from "@/api/system/dict/data";
import {
  getLiberaryList,
  addLiberaryList,
  updateLiberaryList,
  delLiberaryList,
} from "@/api/manage/liberary.js";
export default {
  name: "liberaryIndex",
  data() {
    return {
      loading: false,
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
        pageNum: 1,
        pageSize: 10,
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
        liberary_type: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        key_word: [{ required: true, message: "请输入关键字", trigger: "blur" }],

        user_name: [
          { required: true, message: "请输入分享人", trigger: "blur" },
        ],
        liberary_name: [
          { required: true, message: "请输入经验名称", trigger: "blur" },
        ],
        file_id: [
          { required: true, message: "请输入上传附件", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  methods: {
    getList() {
      this.loading = true
      getLiberaryList(this.queryParams).then((res) => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.loading = false
      }).catch(() => {
        this.loading = false
      });
    },
    getDict() {
      getDicts("liberary_type").then((res) => {
        this.options.liberary_type = res.data;
      });
    },
    liberaryTypeFormat(row) {
      if (this.options.liberary_type)
        return this.selectDictLabel(
          this.options.liberary_type,
          row.liberary_type
        );
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增经验分享";
      this.isAdd = true;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改经验分享";
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
          addLiberaryList(this.form).then((res) => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateLiberaryList(this.form).then((res) => {
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
          return delLiberaryList(this.ids);
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

