<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="姓名">
        <el-input v-model="queryParams.name" placeholder="姓名" clearable size="small" style="width: 120px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item label="公司">
        <el-input v-model="queryParams.company_name" placeholder="公司" clearable size="small" style="width: 120px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="queryParams.department" placeholder="部门" clearable size="small" style="width: 120px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="queryParams.position" placeholder="职位" clearable size="small" style="width: 120px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="queryParams.city" placeholder="地区" clearable size="small" style="width: 120px"
          @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; margin-bottom: 20px"
      row-key="id" border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="company_name" label="公司" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="department" label="部门" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="position" label="职位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="city" label="地区" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="phone" label="电话" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="in_tel" label="内线" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="out_tel" label="外线" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加修改对话框 -->
    <el-dialog :title="dialogTitle" :before-close="handelCancel" :visible.sync="dialogVisible" width="50%"
      append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="姓名" prop="keyWord">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公司" prop="company_name">
              <el-input v-model="form.company_name" placeholder="请输入公司" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门" prop="keyWord">
              <el-input v-model="form.department" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职位" prop="keyWord">
              <el-input v-model="form.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区" prop="keyWord">
              <el-input v-model="form.city" placeholder="请输入地区" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="电话" prop="keyWord">
              <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内线" prop="keyWord">
              <el-input v-model="form.in_tel" placeholder="请输入内线" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="外线" prop="keyWord">
              <el-input v-model="form.out_tel" placeholder="请输入外线" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addMail,
    updateMail,
    delMail,
    mailList,
  } from "@/api/manage/maillist.js";
  export default {
    name: "liberaryIndex",
    data() {
      return {
        total: 0,
        queryParams: {
          page: 1,
          pageSize: 15,
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
          name: [{
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }]
        },
      };
    },
    created() {
      this.getList();
      this.getDict();
    },

    methods: {
      getList() {
        mailList(this.queryParams).then((res) => {
          console.log("列表信息", res)
          this.tableData = res.data.data;
          this.total = res.data.total;
          console.log("数量", this.total)
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
        this.queryParams = {
          page: 1,
          pageSize: 15
        };
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.dialogTitle = "新增人员";
        this.isAdd = true;
      },
      handleUpdate() {
        this.dialogVisible = true;
        this.dialogTitle = "修改人员";
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
      submitForm() {
        this.$refs.form.validate((value) => {
          if (value) {
            addMail(this.form).then((res) => {
              this.handelCancel();
              this.getList();
              this.msgSuccess(res.msg);
            });
          }
        });
      },
      updateForm() {
        updateMail(this.form).then((res) => {
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
            return delMail(this.ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch((err) => {
            console.log(err);
          });
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
