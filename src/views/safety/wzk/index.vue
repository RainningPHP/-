<template>
  <div class="app-container">
    <div class="echarts" id="echarts"></div>
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">类别</div>
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类别"
          clearable
          size="small"
          @change="getList"
        >
          <el-option
            v-for="dict in options.breakrule_type"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">违章分类</div>
        <el-select
          v-model="queryParams.peccancyType"
          placeholder="请选择违章分类"
          clearable
          size="small"
          @change="getList"
        >
          <el-option
            v-for="dict in options.peccancy_type"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">违章等级</div>
        <el-select
          v-model="queryParams.peccancyLevel"
          placeholder="请选择违章分类"
          clearable
          @change="getList"
          size="small"
        >
          <el-option
            v-for="dict in options.peccancy_level"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
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
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
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
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        prop="type"
        label="类别"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="peccancyType"
        label="违章分类"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="peccancyContent"
        label="违章内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="peccancyLevel"
        label="违章等级"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="peccancyRule"
        label="违反规定条款"
        :show-overflow-tooltip="true"
      ></el-table-column>
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
      width="60%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="类别">
              <el-select
                v-model="form.type"
                placeholder="请选择类别"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in options.breakrule_type"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违章分类">
              <el-select
                v-model="form.peccancyType"
                placeholder="请选择违章分类"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in options.peccancy_type"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违章内容" prop="peccancyContent">
              <el-input
                v-model="form.peccancyContent"
                placeholder="请输入作业类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违章等级" prop="peccancyLevel">
              <el-select
                v-model="form.peccancyLevel"
                placeholder="请选择违章等级"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in options.peccancy_level"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违反规定条款" prop="peccancyRule">
              <el-input
                v-model="form.peccancyRule"
                placeholder="请输入违反规定条款"
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
import * as echarts from "echarts";

import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
// import { getProjectInfo } from "@/api/project/project.js";
import {
  getWzkList,
  updateWzkList,
  addWzkList,
  delWzkList,
  downloadWzkDefault,
} from "@/api/manage/breakrule.js";
export default {
  name: "wzk",
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
        url: process.env.VUE_APP_BASE_API + "/system/peccancy/importData",
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
      dialogVisibleDetail: false,
      dialogTitle: "",
      dialogTitleDetail: "",
      isAdd: false,
      ids: [],
      single: true,
      multiple: true,
      currentForm: {},
      formDetail: {},
      rules: {
        // projectBudget: [
        //   { required: true, message: "请输入不含税预算(万)", trigger: "blur" }
        // ],
      },
    };
  },
  created() {
    this.getList();
    this.getDict();
  },
  beforeUpdate() {
    this.getEcharts();
  },
  methods: {
    getEcharts() {
      var mCharts = echarts.init(document.getElementById("echarts"));
      var options = {
       
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          data: ["管理类", "行为类", "装置类"],
        },
        series: [
          {
            type: "bar",
            data: ["114", "209", "190"],
            barWidth: 50,
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16,
                  },
                },
              },
            },
          },
        ],
      };
      mCharts.setOption(options);
    },
    getList() {
      // this.queryParams.projectId = this.projectId;
      getWzkList(this.queryParams).then((res) => {
        this.tableData = res.rows;
      });
    },
    getDict() {
      this.getDicts("peccancy_level").then((res) => {
        this.options.peccancy_level = res.data;
      });
      this.getDicts("peccancy_type").then((res) => {
        this.options.peccancy_type = res.data;
      });
      this.getDicts("breakrule_type").then((res) => {
        this.options.breakrule_type = res.data;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增违章库";
      this.isAdd = true;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改违章库";
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
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },

    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    getDetail(row) {
      this.dialogVisibleDetail = true;
      this.dialogTitleDetail = "风险等级详情";
      this.formDetail = row;
    },
    handelCancelDetail() {
      this.dialogVisibleDetail = false;
      this.dialogTitleDetail = "";
      this.formDetail = {};
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          addWzkList(this.form).then((res) => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateWzkList(this.form).then((res) => {
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
          return delWzkList(this.ids);
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
      this.download(row.fileName);
    },

    handleImport() {
      this.upload.title = "风险等级导入";
      this.upload.open = true;
    },
    // 文件上传
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    importTemplate() {
      downloadWzkDefault().then((res) => {
        this.download(res.msg);
      });
    },
    submitFileForm() {
      this.$refs.upload.submit();
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
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 400px;
  border: 1px solid #dfe6ec;
  margin-bottom: 20px;
}
</style>