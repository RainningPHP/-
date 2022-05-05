<template>
  <div class="app-container">

    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">项目名称</div>
        <el-input
          v-model="queryParams.projectName"
          placeholder="项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getLists"
        />
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="getLists"
        >搜索</el-button
      >
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置</el-button
      >
    </div>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
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
      <el-table-column fixed type="selection" width="50" align="center" />
      <el-table-column
        fixed
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column
        prop="pName"
        fixed
        label="输变电项目名称"
        width="250"
      ></el-table-column>
      <el-table-column
        fixed
        prop="projectName"
        label="项目名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="jsDw"
        label="建设单位"
        width="300"
      ></el-table-column>
      <el-table-column prop="projectPeriod" label="工程状态"></el-table-column>
      <el-table-column prop="projectType" label="工程分类"></el-table-column>
      <el-table-column prop="city" label="地区"></el-table-column>
      <el-table-column prop="projectDyLevel" label="电压等级"></el-table-column>
      <el-table-column prop="projectNo" label="系统编号"></el-table-column>
      <el-table-column prop="projectXz" label="项目性质"></el-table-column>
      <el-table-column prop="userName" label="项目经理"></el-table-column>
      <el-table-column prop="projectScale1" label="线路长度"></el-table-column>
      <el-table-column prop="projectScale2" label="变电容量"></el-table-column>
      <el-table-column prop="kgTime" label="里程碑开工"></el-table-column>
      <el-table-column prop="tcTime" label="里程碑投产"></el-table-column>
      <el-table-column prop="projectTz" label="总投资"></el-table-column>
      <el-table-column
        prop="projectXmhzTime"
        label="核准时间"
      ></el-table-column>
      <el-table-column
        prop="projectXmhzFile"
        label="核准文号"
      ></el-table-column>
      <el-table-column
        prop="projectKypsTime"
        label="可研批复时间"
      ></el-table-column>
      <el-table-column
        prop="projectKypsFile"
        label="可研批复文号"
      ></el-table-column>
      <el-table-column
        prop="sbSjzbTime"
        label="上报设计招标时间"
      ></el-table-column>
      <el-table-column prop="sjDw" label="设计单位"></el-table-column>
      <el-table-column prop="csNsTime" label="初设内审时间"></el-table-column>
      <el-table-column
        prop="projectCbsjTime"
        label="正式初设评审时间"
      ></el-table-column>
      <el-table-column
        prop="projectCbsjRemark"
        label="初设评审意见"
      ></el-table-column>
      <el-table-column
        prop="projectCbsjFile"
        label="初设批复文件"
      ></el-table-column>
      <el-table-column prop="wzSbTime" label="国招物资上报"></el-table-column>
      <el-table-column
        prop="sbJlzbTime"
        label="上报监理招标时间"
      ></el-table-column>
      <el-table-column prop="jlDw" label="监理单位"></el-table-column>
      <el-table-column
        prop="sbSgzbTime"
        label="上报施工招标时间"
      ></el-table-column>
      <el-table-column prop="sgDw" label="施工单位"></el-table-column>
      <el-table-column
        prop="gjjdTime"
        label="关键节点铺排临建方案"
      ></el-table-column>
      <el-table-column
        prop="gjjdRemark"
        label="关键节点铺排属地对接"
      ></el-table-column>
      <el-table-column prop="jdSchedule" label="施工进度计划"></el-table-column>
      <el-table-column prop="tcTimeReal" label="实际投产时间"></el-table-column>
      <el-table-column prop="kgTimeReal" label="实际开工时间"></el-table-column>
      <el-table-column prop="projectJd" label="目前进展"></el-table-column>
      <el-table-column prop="projectProblem" label="存在问题"></el-table-column>
      <el-table-column prop="nextplan" label="下阶段计划"></el-table-column>
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
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
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
    <!-- 添加修改对话框 -->
    <el-dialog
      :title="dialogTitle"
      :before-close="handelCancel"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="输变电项目名称">{{ form.pName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ form.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建设单位" prop="jsDw">
              <el-input v-model="form.jsDw" placeholder="请输入建设单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工程状态" prop="projectPeriod">
              <el-select
                v-model="form.projectPeriod"
                placeholder="请选择工程状态"
              >
                <el-option
                  v-for="item in options.projectPeriod"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工程分类" prop="projectType">
              <el-select
                v-model="form.projectType"
                placeholder="请选择工程分类"
              >
                <el-option
                  v-for="item in options.projectType"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区" prop="city">
              <el-input v-model="form.city" placeholder="请输入地区" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电压等级" prop="projectDyLevel">
              <el-input
                v-model="form.projectDyLevel"
                placeholder="请输入电压等级"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统编号" prop="projectNo">
              <el-input v-model="form.projectNo" placeholder="请输入系统编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目性质" prop="projectXz">
              <el-input v-model="form.projectXz" placeholder="请输入项目性质" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目经理" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入项目经理" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线路长度" prop="projectScale1">
              <el-input
                v-model="form.projectScale1"
                placeholder="请输入线路长度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="变电容量" prop="projectScale2">
              <el-input
                v-model="form.projectScale2"
                placeholder="请输入变电容量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="里程碑开工" prop="kgTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.kgTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择里程碑开工"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="里程碑投产" prop="tcTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.tcTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择里程碑投产"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总投资" prop="projectTz">
              <el-input v-model="form.projectTz" placeholder="请输入总投资" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核准时间" prop="projectXmhzTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.projectXmhzTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择核准时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核准文号" prop="projectXmhzFile">
              <el-input
                v-model="form.projectXmhzFile"
                placeholder="请输入核准文号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可研批复时间" prop="projectKypsTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.projectKypsTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择可研批复时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可研批复文号" prop="projectKypsFile">
              <el-input
                v-model="form.projectKypsFile"
                placeholder="请输入可研批复文号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上报设计招标时间" prop="sbSjzbTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.sbSjzbTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择上报设计招标时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设计单位" prop="sjDw">
              <el-input v-model="form.sjDw" placeholder="请输入设计单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初设内审时间" prop="csNsTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.csNsTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择初设内审时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="正式初设评审时间" prop="projectCbsjTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.projectCbsjTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择正式初设评审时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初设评审意见" prop="projectCbsjRemark">
              <el-input
                v-model="form.projectCbsjRemark"
                placeholder="初设评审意见"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="初设批复文件" prop="projectCbsjFile">
              <el-input
                v-model="form.projectCbsjFile"
                placeholder="请输入初设批复文件"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国招物资上报" prop="wzSbTime">
              <el-input
                v-model="form.wzSbTime"
                placeholder="请输入国招物资上报"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上报监理招标时间" prop="sbJlzbTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.sbJlzbTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择上报监理招标时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="监理单位" prop="jlDw">
              <el-input v-model="form.jlDw" placeholder="请输入监理单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上报施工招标时间" prop="sbSgzbTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.sbSgzbTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择上报施工招标时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="施工单位" prop="sgDw">
              <el-input v-model="form.sgDw" placeholder="请输入施工单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键节点铺排临建方案" prop="gjjdRemark">
              <el-input
                v-model="form.gjjdRemark"
                placeholder="请输入关键节点铺排临建方案"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键节点铺排属地对接" prop="sgDw">
              <el-input
                v-model="form.sgDw"
                placeholder="关键节点铺排属地对接"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="施工进度计划" prop="jdSchedule">
              <el-input
                v-model="form.jdSchedule"
                placeholder="请输入施工进度计划"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际投产时间" prop="tcTimeReal">
              <el-date-picker
                clearable
                size="small"
                v-model="form.tcTimeReal"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择实际投产时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际开工时间" prop="kgTimeReal">
              <el-date-picker
                clearable
                size="small"
                v-model="form.kgTimeReal"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择实际开工时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目前进展" prop="projectJd">
              <el-input v-model="form.projectJd" placeholder="请输入目前进展" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存在问题" prop="projectProblem">
              <el-input
                v-model="form.projectProblem"
                placeholder="请输入存在问题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下阶段计划" prop="nextplan">
              <el-input
                v-model="form.nextplan"
                placeholder="请输入下阶段计划"
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
  </div>
</template>

<script>
import * as echarts from "echarts";

import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
// import { getProjectInfo } from "@/api/project/project.js";
import {
  getList,
  delList,
  downloadDefault,
  updateList,
  exportList,
} from "@/api/progress/xmxxb.js";
export default {
  name: "xmxxb",
  data() {
    return {
      // projectId: this.$route.params.projectId,

      // 用户导入参数
      upload: {
        open: false,
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/gjjd/importData",
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
        projectBudget: [
          { required: true, message: "请输入不含税预算(万)", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getLists();
    this.getDict();
  },
  methods: {
   
    getLists() {
      // this.queryParams.projectId = this.projectId;

      getList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getDict() {
      this.getDicts("project_period").then((res) => {
        this.options.projectPeriod = res.data;
      });
      this.getDicts("project_type").then((res) => {
        this.options.projectType = res.data;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getLists();
    },
    handleAdd() {
      getProjectInfo(this.projectId).then((res) => {
        this.form = res.data;
        this.form.projectId = this.form.id;
        delete this.form.id;
        this.dialogVisible = true;
        this.dialogTitle = "新增关键节点计划";
        this.isAdd = true;
        this.getLists();
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改关键节点计划";
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
    // 删除
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
    handleDownload(row) {
      this.download(row.fileName);
    },
    handleImport() {
      this.upload.title = "关键节点计划导入";
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
    importTemplate() {
      downloadDefault().then((res) => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleExport() {
      exportList(this.queryParams).then((res) => {
        this.download(res.msg);
      });
    },
    indexMethod(index) {
      return (this.queryParams.pageNum - 1) * 10 + index + 1;
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
