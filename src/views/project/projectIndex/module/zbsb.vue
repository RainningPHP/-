<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
          >删除</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" fixed width="50" align="center" />
      <el-table-column type="index" fixed width="50" align="center" />
      <el-table-column
        fixed
        prop="projectName"
        label="项目名称"
        width="250"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="时间" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          {{ scope.row.projectMonth }}月第{{ scope.row.projectWeek }}周
        </template>
      </el-table-column>
      <el-table-column
        prop="projectJd"
        label="工程进度情况"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="thisWeekWork"
        label="本周完成工作"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="nextWeekPlan"
        label="下周工作计划"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="thisWeekMain"
        label="本周重点管理工作"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="nextWeekMain"
        label="下周重点管理工作"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="wzProblem"
        label="物资类存在或需要协调问题"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="tdProblem"
        label="停电类存在或需要协调问题"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="zcProblem"
        label="政处类存在或需要协调问题"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="otherProblem"
        label="其他类存在或需要协调问题"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getLists"
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
          <el-col :span="12">
            <el-form-item label="项目名称">{{ form.projectName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间">
              {{ form.projectYear }}年{{ form.projectMonth }}月第{{
                form.projectWeek
              }}周
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工程进度情况" prop="projectJd">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.projectJd"
                placeholder="请输入工程进度情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本周完成工作" prop="thisWeekWork">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.thisWeekWork"
                placeholder="请输入本周完成工作"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下周工作计划" prop="nextWeekPlan">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.nextWeekPlan"
                placeholder="请输入下周工作计划"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本周重点管理工作" prop="thisWeekMain">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.thisWeekMain"
                placeholder="请输入本周重点管理工作"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下周重点管理工作" prop="nextWeekMain">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.nextWeekMain"
                placeholder="请输入下周重点管理工作"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资类存在或需要协调问题" prop="wzProblem">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.wzProblem"
                placeholder="请输入物资类存在或需要协调问题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停电类存在或需要协调问题" prop="tdProblem">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.tdProblem"
                placeholder="请输入停电类存在或需要协调问题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政处类存在或需要协调问题" prop="zcProblem">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.zcProblem"
                placeholder="请输入政处类存在或需要协调问题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他类存在或需要协调问题" prop="otherProblem">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.otherProblem"
                placeholder="请输入其他类存在或需要协调问题"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :data="{ projectId, updateSupport: upload.updateSupport }"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
// import { getProjectInfo } from "@/api/project/project.js";
import {
  addList,
  getList,
  updateList,
  delList,
  downloadDefault,
} from "@/api/manage/zb.js";
export default {
  name: "zbsb",
  data() {
    return {
      projectId: this.$route.params.projectId,
      value1: "",
      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/report/importData",
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
        // projectBudget: [
        //   { required: true, message: "请输入不含税预算(万)", trigger: "blur" }
        // ],
      },
      // 详情
      dialogVisibleDetail: false,
      dialogTitleDetail: "周报详情",
      formDetail: {},
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },
  methods: {
    getLists() {
      this.queryParams.projectId = this.projectId;
      getList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getDict() {},
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    // 新增
    handleAdd() {
      getProjectInfo(this.projectId).then((res) => {
        this.form = res.data;
        this.form.projectId = this.form.id;
        delete this.form.id;
        this.dialogVisible = true;
        this.dialogTitle = "新增周报";
        this.isAdd = true;
        this.getLists();
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改周报";
      this.isAdd = false;
      this.form = row;
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
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          addList(this.form).then((res) => {
            this.handelCancel();
            this.getLists();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateList(this.form).then((res) => {
        this.handelCancel();
        this.getLists();
        this.msgSuccess(res.msg);
      });
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm("是否确认删除数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (row) {
            return delList([row.id]);
          } else {
            return delList(this.ids);
          }
        })
        .then(() => {
          this.getLists();
          this.msgSuccess("删除成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 导入按钮
    handleImport() {
      this.upload.title = "周报导入";
      this.upload.open = true;
    },
    // 文件上传
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getLists();
    },
    // 下载模板
    importTemplate() {
      downloadDefault().then((res) => {
        this.download(res.msg);
      });
    },
    // 导入上传
    submitFileForm() {
      this.$refs.upload.submit();
    },

    // 选择月周
    weekChange(val) {
      if (val) {
        let arr = val.split("-");
        this.queryParams.week = this.getWeekInMonth(new Date(val));
      }
    },
    // 根据日期判断是月的第几周
    getWeekInMonth(t) {
      if (t == undefined || t == "" || t == null) {
        t = new Date();
      } else {
        var _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());

        var date = _t.getDate(); //给定的日期是几号

        _t.setDate(1);
        var d = _t.getDay(); //1. 得到当前的1号是星期几。
        var fisrtWeekend = d;
        if (d == 0) {
          fisrtWeekend = 1;
          //1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; //第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        } else {
          return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
      }
    },
    // 详情
    // 详情展开
    showDetail(row) {
      this.dialogVisibleDetail = true;
      this.formDetail = row;
    },
    // 详情取消
    handelCancelDetail() {
      this.formDetail = {};
      this.dialogVisibleDetail = false;
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