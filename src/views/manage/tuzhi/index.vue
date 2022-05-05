<template>
  <div class="app-container">
    <!-- 对话框 -->
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
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="paper_ml" label="卷册项目"> </el-table-column>
      <el-table-column prop="paper_ml_code" label="卷册目录"> </el-table-column>
      <el-table-column prop="user_name" label="获取数据详情"> </el-table-column>
      <el-table-column prop="create_time" label="卷册时间"> </el-table-column>
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
            <el-form-item label="卷册项目" prop="paper_ml">
              <el-input v-model="form.paper_ml" placeholder="卷册项目" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷册目录" prop="paper_ml_code">
              <el-input v-model="form.paper_ml_code" placeholder="卷册目录" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="获取数据详情" prop="user_name">
              <el-input v-model="form.user_name" placeholder="获取数据详情" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="button" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getControlList, addControl } from "@/api/manage/tuzhi.js";

export default {
  name: "tuzhi",
  data() {
    return {
      total: 0,
      queryParams: {
        // project_id: "63ffca27-3fb9-4070-a546-59f9b03a6361",
        pageNum: 1,
        pageSize: 10,
      },
      form: {},
      tableData: [
        // {
        //   paper_ml: "大跨越平断面及塔位图",
        //   paper_ml_code: "D0301 ",
        //   user_name: "测试",
        //   create_time: "2022-02-17 19:43:01",
        // },
        // {
        //   paper_ml: "大跨越杆塔明细表",
        //   paper_ml_code: "D0302 ",
        //   user_name: "测试",
        //   create_time: "2022-02-17 19:44:21",
        // },
        // {
        //   paper_ml: "大跨越接地装置施工图",
        //   paper_ml_code: "D0303 ",
        //   user_name: "测试",
        //   create_time: "2022-02-17 20:46:22",
        // },
        // {
        //   paper_ml: "大跨越导线、OPGW金具串施工图",
        //   paper_ml_code: "D0304",
        //   user_name: "测试",
        //   create_time: "2022-02-17 20:46:48",
        // },
        // {
        //   paper_ml: "大跨越导线、OPGW架线施工图",
        //   paper_ml_code: "D0305",
        //   user_name: "测试",
        //   create_time: "2022-02-17 20:51:09",
        // },
        // {
        //   paper_ml: "大跨越导线、OPGW防振施工图",
        //   paper_ml_code: "D0306",
        //   user_name: "测试",
        //   create_time: "2022-02-17 20:51:25",
        // },
        // {
        //   paper_ml: "大跨越拆房分幅图",
        //   paper_ml_code: "D0307 ",
        // },
        // {
        //   paper_ml: "大跨越警航灯与在线监测装置安装图",
        //   paper_ml_code: "D0308",
        // },
        // {
        //   paper_ml: "大跨越南塔建筑物屋内动力、照明及接地布置图",
        //   paper_ml_code: "D0401 ",
        // },
        // {
        //   paper_ml: "大跨越南塔建筑物屋内火灾报警装置",
        //   paper_ml_code: "D0402",
        // },
        // {
        //   paper_ml: "大跨越北塔建筑物屋内动力、照明及接地布置图",
        //   paper_ml_code: "D0403",
        // },
        // {
        //   paper_ml: "大跨越北塔建筑物屋内火灾报警装置",
        //   paper_ml_code: "D0404",
        // },
        // {
        //   paper_ml: "公用部分施工图",
        //   paper_ml_code: "D0501",
        // },
        // {
        //   paper_ml: "智能辅助控制系统施工图",
        //   paper_ml_code: "D0502 ",
        // },
        // {
        //   paper_ml: "大跨越铁塔施工说明书",
        //   paper_ml_code: "T0501 ",
        // },
        // {
        //   paper_ml: "跨越塔结构图",
        //   paper_ml_code: "T0502 ",
        // },
        // {
        //   paper_ml: "跨越塔电梯井筒结构图",
        //   paper_ml_code: "T0503 ",
        // },
        // {
        //   paper_ml: "跨越塔附件结构图",
        //   paper_ml_code: "T0504",
        // },
        // {
        //   paper_ml: "锚塔结构图",
        //   paper_ml_code: "T0505",
        // },
        // {
        //   paper_ml: "基础施工说明书",
        //   paper_ml_code: "T0601 ",
        // },
        // {
        //   paper_ml: "跨越塔基础施工图",
        //   paper_ml_code: "T0602 ",
        // },
        // {
        //   paper_ml: "跨越塔电梯井筒基础施工图",
        //   paper_ml_code: "T0603 ",
        // },
        // {
        //   paper_ml: "锚塔基础施工图",
        //   paper_ml_code: "T0604 ",
        // },
        // {
        //   paper_ml: "试桩基础施工图",
        //   paper_ml_code: "T0701",
        // },
        // {
        //   paper_ml: "北塔土建总平面",
        //   paper_ml_code: "T0801 ",
        // },
        // {
        //   paper_ml: "南塔土建总平面",
        //   paper_ml_code: "T0802 ",
        // },
        // {
        //   paper_ml: "围墙、大门、挡土墙",
        //   paper_ml_code: "T0803",
        // },
        // {
        //   paper_ml: "站内外道路",
        //   paper_ml_code: "T0804",
        // },
        // {
        //   paper_ml: "北塔辅助建筑及结构施工图",
        //   paper_ml_code: "T0805",
        // },
        // {
        //   paper_ml: "南塔辅助建筑施工图",
        //   paper_ml_code: "T0806 ",
        // },
        // {
        //   paper_ml: "南塔辅助建筑结构施工图",
        //   paper_ml_code: "T0807",
        // },
      ],
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
        this.tableData = res.data.design_photo;
      });
    },

    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增卷册项目";
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
          addControl({}).then((res) => {
            // console.log(res);
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
  
<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>