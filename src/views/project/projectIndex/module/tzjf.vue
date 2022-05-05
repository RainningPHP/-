<template>
  <div class="app-container">
    <div class="btn-group">
      <div class="btn-group-single">
        <div class="btn-group-single-title">卷册名称</div>
        <el-input
          v-model="queryParams.paperName"
          placeholder="卷册名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <div class="btn-group-single">
        <div class="btn-group-single-title">卷册负责人</div>
        <el-input
          v-model="queryParams.paperFzr"
          placeholder="卷册负责人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        />
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>
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
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
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
    <!-- <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />

      <el-table-column prop="name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperMl" label="卷册目录" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperName" label="卷册名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperFzr" label="卷册负责人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperCtr" label="卷册催图人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperTime" label="出图时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table
      :data="tableData.data"
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column type="selection" width="50" align="center" />

      <el-table-column prop="draw_name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperMl" label="卷册目录" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperName" label="卷册名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperFzr" label="卷册负责人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paperCtr" label="卷册催图人" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="paperTime" label="出图时间" :show-overflow-tooltip="true"></el-table-column>
      
    </el-table>
    </el-table> -->


    <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="name"
    border
    default-expand-all
    :tree-props="{children: 'data', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
     <el-table-column
      prop="number"
      label="姓名"
      sortable
      width="180">
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
            <el-form-item label="项目名称">{{form.projectName}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷册目录" prop="paperMl">
              <el-input v-model="form.paperMl" placeholder="请输入卷册目录" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷册名称" prop="paperName">
              <el-input v-model="form.paperName" placeholder="请输入卷册名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷册负责人" prop="paperFzr">
              <el-input v-model="form.paperFzr" placeholder="请输入卷册负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷册催图人" prop="paperCtr">
              <el-input v-model="form.paperCtr" placeholder="请输入卷册催图人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出图时间" prop="paperTime">
              <el-date-picker
                clearable
                size="small"
                v-model="form.paperTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择时间"
              ></el-date-picker>
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
import { getToken } from "@/utils/auth";
import {
  getProjectInfo,
  getTzjfList,
  addTzjfList,
  updateTzjfList,
  delTzjfList
} from "@/api/project/project.js";
import {
  getLiberaryDrawingsList,
  getLiberaryDrawingsFileList
} from "@/api/manage/meetings.js";
export default {
  name: "tzjf",
  data() {
    return {
      projectId: this.$route.params.projectId,
      projectName: "",
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

        updateSupport: false
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
        paperMl: [
          { required: true, message: "请输入卷册目录", trigger: "blur" }
        ],
        paperName: [
          { required: true, message: "请输入卷册名称", trigger: "blur" }
        ],

        paperFzr: [
          { required: true, message: "请输入卷册负责人", trigger: "blur" }
        ],

        paperCtr: [
          { required: true, message: "请输入卷册催图人", trigger: "blur" }
        ],
        paperTime: [
          { required: true, message: "请选择出图时间", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDict();
    this.getInfo();
  },
  methods: {
    getList() {
      this.queryParams.projectId = this.projectId;
      getLiberaryDrawingsList(this.queryParams).then(res => {
           this.tableData = res.data;
        for(let i=0;i<this.tableData.length;i++){
        for (let k = 0; k <this.tableData[i].data.length; k++) {
         getLiberaryDrawingsFileList({book_id:this.tableData[i].data[k].id}).then(res=>{
          this.tableData[i].data[k].data=res.data.data
         })
        }
        }
        console.log(this.tableData,1234);
      });
    },
    getDict() {},
    getInfo() {
      getProjectInfo(this.projectId).then(res => {
        this.projectName = res.data.projectName;
      });
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增经图纸交付";
      this.isAdd = true;
      this.form.projectId = this.projectId;
      this.form.projectName = this.projectName;
    },
    handleUpdate() {
      this.dialogVisible = true;
      this.dialogTitle = "修改图纸交付";
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
      this.$refs.form.clearValidate();
    },
    submitForm() {
      this.$refs.form.validate(value => {
        if (value) {
          addTzjfList(this.form).then(res => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    updateForm() {
      updateTzjfList(this.form).then(res => {
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
          return delTzjfList(this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDownload() {
      this.download(row.fileId);
    }
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