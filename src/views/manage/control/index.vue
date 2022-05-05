<template>
  <div class="app-container">
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
    </el-row>
    <el-table
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column
        prop="name"
        label="分类名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="department"
        label="所属部门"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="info"
        label="主要内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="times"
        label="时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="rate"
        label="频率"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAdd(scope.row)">新增</el-button>
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
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属部门" prop="department">
              <el-input v-model="form.department" placeholder="所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主要内容" prop="info">
              <el-input
                v-model="form.info"
                type="textarea"
                placeholder="主要内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间" prop="times">
              <el-input v-model="form.times" placeholder="时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="频率" prop="rate">
              <el-input v-model="form.rate" placeholder="频率" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from "@/utils/auth";
import { getControlList, addControl } from "@/api/manage/control.js";
export default {
  name: "liberaryIndex",
  data() {
    return {
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
      parent_id: 0,
      rules: {
        name: [{ required: true, message: "请填写分类名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getControlList().then((res) => {
        console.log(res);
        let oData = res.data;
        let formatObj = oData.reduce((pre, cur) => {
          return { ...pre, [cur.id]: cur };
        }, {});

        let formatArray = oData.reduce((arr, cur) => {
          let pid = cur.parent_id !== "0" ? cur.parent_id : "0";
          let parent = formatObj[pid];
          if (parent) {
            parent.children
              ? parent.children.push(cur)
              : (parent.children = [cur]);
          } else {
            arr.push(cur);
          }
          return arr;
        }, []);

        this.tableData = formatArray;
      });
    },
    handleAdd(row) {
      if (row) {
        this.parent_id = row.id;
      } else {
        this.parent_id = 0;
      }
      this.dialogVisible = true;
      this.dialogTitle = "新增管控卡类型";
      this.isAdd = true;
    },
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          addControl({
            ...this.form,
            parent_id: this.parent_id,
          }).then((res) => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
  },
};
</script>
