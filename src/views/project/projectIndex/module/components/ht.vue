<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="editHt"
        >修改</el-button>
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
      <el-table-column prop="projectName" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="type" label="类别" :formatter="typeFormat" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="zbDw" label="中标单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="htName" label="合同名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="htFileId" label="合同附件">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.fileName"
            class="item"
            effect="dark"
            :content="scope.row.fileName"
            placement="top"
          >
            <el-button
              size="mini"
              @click="handleDownload(scope.row)"
            >{{scope.row.fileName | emplisisText}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 合同详情对话框 -->
    <el-dialog title="合同详情" :visible.sync="dialogVisibleDetail" width="80%" append-to-body>
      <el-form label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称:">{{form.projectName}}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="type=='4'">
            <el-form-item label="物资名称:">{{form.wzName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:">{{this.typeFormat(form) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="招标计划时间:">{{form.jhzbDate}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中标单位:">{{form.zbDw}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中标时间:">{{form.zbDate}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同签订时间:">{{form.htDate}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称:">{{form.htName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件:">{{form.fileName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额:">{{form.htMoney}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同乙方:">{{form.htYf}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同形式:">{{form.htXs}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款比例:">{{form.fkPercent}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="履约评价:">{{form.lyComment}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人:">{{form.createName}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handelCancelDetail">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 合同详情对话框 -->
    <el-dialog
      title="合同详情"
      :before-close="handelCancelEdit"
      :visible.sync="dialogVisibleEdit"
      width="80%"
      append-to-body
    >
      <el-form ref="upload" :model="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24" v-if="form.projectName">
            <el-form-item label="项目名称">{{form.projectName}}</el-form-item>
          </el-col>

          <el-col :span="24" v-else>
            <el-form-item label="项目名称">{{projectName}}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="type=='4'">
            <el-form-item label="物资名称">
              <el-input v-model="form.wzName" placeholder="物资名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="isHtManage">
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option
                  v-for="item in options.ht_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="招标计划时间">
              <el-date-picker
                clearable
                size="small"
                v-model="form.jhzbDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择招标计划时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中标单位">
              <el-input v-model="form.zbDw" placeholder="中标单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中标时间">
              <el-date-picker
                clearable
                size="small"
                v-model="form.zbDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择中标时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同签订时间">
              <el-date-picker
                clearable
                size="small"
                v-model="form.htDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择合同签订时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="履约时间">
              <el-date-picker
                clearable
                size="small"
                v-model="form.lyDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择履约时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称">
              <el-input v-model="form.htName" placeholder="合同名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件">
              <el-upload
                ref="uploadFile"
                :limit="1"
                v-model="form.file"
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
          <el-col :span="12">
            <el-form-item label="合同金额">
              <el-input v-model="form.htMoney" placeholder="合同金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同乙方">
              <el-input v-model="form.htYf" placeholder="合同乙方" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同形式">
              <el-input v-model="form.htXs" placeholder="合同形式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款比例">
              <el-input v-model="form.fkPercent" placeholder="付款比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="履约评价">
              <el-input v-model="form.lyComment" placeholder="履约评价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input v-model="form.createName" placeholder="创建人" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="addHt" :loading="upload.isUploading">确 定</el-button>
        <el-button v-else type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="handelCancelEdit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getHtList,
  updateHtList,
  addHtList,
  getProjectInfo,
  commonDownload
} from "@/api/project/project.js";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default {
  data() {
    return {
      projectId: this.$route.params.projectId,
      tableData: [],
      options: {},
      typeMap: {
        sjzb: 1,
        jlzb: 2,
        wzjhsb: 4,
        sgzb: 3
      },
      type: "",
      form: {},
      dialogVisibleDetail: false,
      dialogVisibleEdit: false,
      isAdd: false,
      selectedData: [],
      single: true,
      // 用户导入参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        // 上传的文件列表
        fileList: []
      },
      projectName: "",
      isHtManage: this.$route.name === "htgl"
    };
  },
  created() {
    this.getDict();
    if (!this.isHtManage) this.type = this.typeMap[this.$route.name];
    this.getList();
    this.getInfo();
  },
  methods: {
    getList() {
      getHtList({
        type: this.type,
        projectId: this.projectId
      }).then(res => {
        this.tableData = res.rows;
      });
    },

    getInfo() {
      getProjectInfo(this.projectId).then(res => {
        this.projectName = res.data.projectName;
      });
    },
    getDict() {
      this.getDicts("ht_type").then(res => {
        this.options.ht_type = res.data;
      });
    },
    // 详情
    getDetail(row) {
      this.dialogVisibleDetail = true;
      this.form = row;
    },
    handelCancelDetail() {
      this.dialogVisibleDetail = false;
      this.form = {};
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.selectedData = selection;
    },
    // 新增
    handleAdd() {
      this.dialogVisibleEdit = true;
      this.form.projectId = this.projectId;
      if (!this.isHtManage) {
        this.form.type = this.type;
      }
      this.form.projectName = this.projectName;
      this.isAdd = true;
    },
    // 修改
    editHt(row) {
      this.dialogVisibleEdit = true;
      this.form = this.selectedData[0];
      this.isAdd = false;
    },
    handelCancelEdit() {
      this.dialogVisibleEdit = false;
      this.form = {};
      this.$refs.uploadFile.clearFiles();
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$set(this.form, "htFileId", response.fileId);
      this.$refs.upload.clearValidate("htFileId");
      // this.form.projectId = this.projectId;
    },
    // 修改提交
    submitFileForm() {
      updateHtList(this.form).then(res => {
        this.dialogVisibleEdit = false;
        this.form = {};
        this.getList();
      });
    },
    // 新增提交
    addHt() {
      addHtList(this.form).then(res => {
        this.dialogVisibleEdit = false;
        this.form = {};
        this.getList();
      });
    },
    // type格式化
    typeFormat(row, column) {
      if (row.type) return this.selectDictLabel(this.options.ht_type, row.type);
    },

    // 文件下载处理
    handleDownload(row) {
      // console.log(row.htFileId);
      commonDownload(row.htFileId);
    }
  },
  filters: {
    typeFormat(value) {
      return this.selectDictLabel(this.options.ht_type, value);
    },
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

<style>
</style>