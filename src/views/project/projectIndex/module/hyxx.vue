<template>
  <div class="app-container">
    <!--    <el-form-->
    <!--      :model="queryParams"-->
    <!--      ref="queryForm"-->
    <!--      :inline="true"-->
    <!--      label-width="68px"-->
    <!--    >-->
    <!--      <el-form-item label="经验名称">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.liberary_name"-->
    <!--          placeholder="经验名称"-->
    <!--          clearable-->
    <!--          size="small"-->
    <!--          style="width: 240px"-->
    <!--          @keyup.enter.native="getList"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="关键词">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.key_word"-->
    <!--          placeholder="请输入关键词"-->
    <!--          clearable-->
    <!--          size="small"-->
    <!--          style="width: 240px"-->
    <!--          @keyup.enter.native="getList"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          icon="el-icon-search"-->
    <!--          size="mini"-->
    <!--          @click="getList"-->
    <!--        >搜索</el-button-->
    <!--        >-->
    <!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"-->
    <!--        >重置</el-button-->
    <!--        >-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->

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
        <!-- <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button
        > -->
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--        >删除</el-button-->
      <!--        >-->
      <!--      </el-col>-->
    </el-row>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <!-- <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" label="序号"></el-table-column> -->
      <el-table-column
        prop="meeting_name"
        label="会议名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="meeting_type"
        label="会议类型"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="meeting_duration"
        label="会议时长"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="meet_file_content"
        label="会议内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <!-- <el-table-column label="视频" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.spList.length"
            size="mini"
            @click="downloadFiles(scope.row.spList)"
          >下载</el-button>
        </template>
      </el-table-column>
     <el-table-column label="视频" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.spList.length"
            size="mini"
            @click="downloadFiles(scope.row.spList)"
          >下载</el-button>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="meeting_type"
        label="会议时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="user_name"
        label="发布人"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <!--      <el-table-column-->
      <!--        prop="dk_time"-->
      <!--        label="附件"-->
      <!--        :show-overflow-tooltip="true"-->
      <!--        width="200"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tooltip-->
      <!--            class="item"-->
      <!--            effect="dark"-->
      <!--            :content="scope.row.file_name"-->
      <!--            placement="top"-->
      <!--          >-->
      <!--            <el-button size="mini" @click="handleDownload(scope.row)">{{-->
      <!--              scope.row.file_name | emplisisText-->
      <!--              }}</el-button>-->
      <!--          </el-tooltip>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetalis(scope.row)"
            >查看</el-button
          >
          <el-button size="mini" @click="handleUpdate(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
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
            <el-form-item label="会议名称" prop="meeting_name">
              <el-input
                v-model="form.meeting_name"
                placeholder="请输入会议名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议类型" prop="meeting_type">
              <el-input
                v-model="form.meeting_type"
                placeholder="请输入会议类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议时长" prop="meeting_duration">
              <el-input
                v-model="form.meeting_duration"
                placeholder="请输入会议时长"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议内容" prop="meet_file_content">
              <el-input
                type="textarea"
                :rows="4"
                v-model="form.meet_file_content"
                placeholder="请输入会议内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议时间" prop="meeting_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.meeting_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="发布人" prop="user_name">
              <el-input
                v-model="form.user_name"
                placeholder="请输入分享人账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件" prop="meetting_papers_id">
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
          @click="submitForm"
          :loading="upload.isUploading"
          >确 定</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="updateForm"
          :loading="upload.isUploading"
          >确 定</el-button
        >
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="dislogDetails">
      <el-form ref="form" :model="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="会议名称" prop="meeting_name">
              <el-input v-model="form.meeting_name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议类型" prop="meeting_type">
              <el-input v-model="form.meeting_type" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议时长" prop="meeting_duration">
              <el-input v-model="form.meeting_duration" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议内容" prop="meet_file_content">
              <el-input
                type="textarea"
                :rows="4"
                v-model="form.meet_file_content"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议时间" prop="meeting_time">
              <el-date-picker
                clearable
                size="small"
                v-model="form.meeting_time"
                type="date"
                value-format="yyyy-MM-dd"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="发布人" prop="user_name">
              <el-input v-model="form.user_name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="查看照片" prop="meeting_file_path">
              <el-image
                style="width: 100px; height: 100px"
                :src="form.meeting_file_path"
                :preview-src-list="srcList"
              >
              </el-image>
            </el-form-item>
          </el-col>
           <el-col :span="24">
            <el-form-item label="查看视频" prop="meeting_file_path">
              <video-player class="video-player vjs-custom-skin" 
            ref="videoPlayer" 
            :playsinline="true" 
            :options="playerOptions">
      </video-player>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handelCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { parseTime } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
// import { commonDownload } from "@/utils/index";
import { getDicts } from "@/api/system/dict/data";
import {
  getLiberaryListdetails,
  getLiberaryListmeetingList,
  getLiberaryListadd,
  updateLiberaryList,
  delLiberaryList,
} from "@/api/manage/meetings.js";
export default {
  name: "hyxx",
   components: {
    videoPlayer
  },
  data() {
    return {
       playerOptions: {
            playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
            autoplay: false, // 如果为true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 是否视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
              type: "video/mp4", // 类型
              src: '' // url地址
            }],
            poster: '', // 封面地址
            notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
              timeDivider: true, // 当前时间和持续时间的分隔符
              durationDisplay: true, // 显示持续时间
              remainingTimeDisplay: false, // 是否显示剩余时间功能
              fullscreenToggle: true // 是否显示全屏按钮
            }
          },
      srcList:[],
      dislogDetails: false,
      projectId: this.$route.params.projectId,
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
        page: 1,
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
        meeting_name: [
          { required: true, message: "请输入会议名称", trigger: "blur" },
        ],
        meeting_type: [
          { required: true, message: "请输入会议类型", trigger: "blur" },
        ],
        // meeting_duration: [
        //   { required: true, message: "请输入会议时长", trigger: "change" },
        // ],
        meet_file_content: [
          { required: true, message: "请输入会议内容", trigger: "blur" },
        ],
        meeting_time: [
          { required: true, message: "请输入会议时间", trigger: "blur" },
        ],
        // user_name: [
        //   { required: true, message: "请输入会议发布人", trigger: "change" },
        // ],
      },
    };
  },
  created() {
    this.getList();
    // this.getDict();
  },
  methods: {
    // 查看详情
    handleDetalis(item) {
      this.dislogDetails = true;
      getLiberaryListdetails({ id:item.id}).then((res) => {
        this.form = res.data;
        this.srcList.push(this.form.meeting_file_path)
        this.playerOptions.sources[0].src=res.data.meeting_av_path
        console.log(this.playerOptions.sources[0], 321);
        // console.log(res.data, 321);
      });
    },
    // 获取列表详情
    getList() {
      this.loading = true;
      getLiberaryListmeetingList({ id: this.projectId })
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // getDict() {
    //   getDicts("liberary_type").then((res) => {
    //     this.options.liberary_type = res.data;
    //   });
    // },
    // liberaryTypeFormat(row) {
    //   if (this.options.liberary_type)
    //     return this.selectDictLabel(
    //       this.options.liberary_type,
    //       row.liberary_type
    //     );
    // },
    // 重置
    // resetQuery() {
    //   this.queryParams = { page: 1, pageSize: 10 };
    //   this.getList();
    // },
    // 打开新增弹框
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增会议";
      this.isAdd = true;
      this.$refs.upload.clearFiles();
    },
    // 打开修改弹框
    handleUpdate(item) {
      this.dialogVisible = true;
      this.dialogTitle = "修改会议";
      this.isAdd = false;
      this.form = item;
    },
    // handleSelectionChange(selection) {
    //   this.single = selection.length !== 1;
    //   if (this.single) {
    //     this.currentForm = {};
    //   } else {
    //     this.currentForm = selection[0];
    //   }
    //   this.multiple = selection.length === 0;
    //   if (this.multiple) {
    //     this.ids = [];
    //   } else {
    //     this.ids = selection.map((item) => item.id);
    //   }
    // },
    // 取消按钮
    handelCancel() {
      this.dialogVisible = false;
      this.dialogTitle = "";
      this.form = {};
    },
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$set(this.form, "meetting_papers_id", response.data.file_id);
      let time = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      this.form.oper_time = time;
    },
    // 新增确定
    submitForm() {
      this.$refs.form.validate((value) => {
        if (value) {
          this.form.project_id = this.projectId;
          getLiberaryListadd(this.form).then((res) => {
            this.handelCancel();
            this.getList();
            this.msgSuccess(res.msg);
          });
        }
      });
    },
    // 修改
    updateForm() {
      updateLiberaryList(this.form).then((res) => {
        this.handelCancel();
        this.getList();
        this.msgSuccess(res.msg);
      });
    },
    // 删除
    // handleDelete() {
    //   this.$confirm("是否确认删除数据?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then((res) => {
    //       return delLiberaryList(this.ids);
    //     })
    //     .then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // handleDownload(row) {
    //   commonDownload(row.file_id);
    // },
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
<style scoped>
.video-player{
  width: 400px;
}
</style>

