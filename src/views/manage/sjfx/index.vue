<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="项目名称">
        <el-input
          v-model="queryParams.liberaryName"
          placeholder="项目名称"
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
    

    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-if="props.row.project_name===''" :data="southWorker" stripe border>
            <!--  -->
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" width="50" align="center" :index="indexMethod" /> -->
      <el-table-column prop="project_name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="total" label="项目明细" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getLists"
    />
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { commonDownload } from "@/utils/index";
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
      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
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
        liberaryType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        keyWord: [{ required: true, message: "请输入关键字", trigger: "blur" }],

        userName: [
          { required: true, message: "请输入分享人", trigger: "blur" },
        ],

        liberaryName: [
          { required: true, message: "请输入经验名称", trigger: "blur" },
        ],
        fileId: [
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
      getLiberaryList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        // this.total = res.total;
      });
    },
    getDict() {
      this.getDicts("liberary_type").then((res) => {
        this.options.liberary_type = res.data;
      });
    },
    liberaryTypeFormat(row) {
      if (this.options.liberary_type)
        return this.selectDictLabel(
          this.options.liberary_type,
          row.liberaryType
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
      this.$set(this.form, "fileId", response.fileId);
      this.form.projectId = this.projectId;
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.operTime = time;
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
      commonDownload(row.fileId);
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
// myCharts.setOption(this.option)
</script>



