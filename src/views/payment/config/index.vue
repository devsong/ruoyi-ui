<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="APPID" prop="appId">
        <el-input
          v-model="queryParams.appId"
          placeholder="请输入应用APPID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付渠道" prop="channel">
        <el-select v-model="queryParams.channel" placeholder="请选择支付渠道" clearable size="small">
          <el-option
            v-for="dict in channelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用描述" prop="appDesc">
        <el-input
          v-model="queryParams.appDesc"
          placeholder="请输入应用描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['payment:config:edit']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['payment:config:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['payment:config:edit']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      :cell-class-name="tableCellClassName"
      @selection-change="handleSelectionChange"
      @cell-dblclick="handleCellDbClick"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="应用APPID" align="center" prop="appId" />
      <el-table-column label="支付渠道" align="center" prop="channel" :formatter="channelFormat" />
      <el-table-column label="应用描述" align="center" prop="appDesc" />
      <el-table-column label="应用密钥" align="center" prop="appSecret" />
      <el-table-column label="商户号" align="center" prop="mchId" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
            v-model="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="公钥" align="center" prop="pubKey" />
      <el-table-column :show-overflow-tooltip="true" label="私钥" align="center" prop="privKey" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['payment:config:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['payment:config:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改支付配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="APPID" prop="appId">
              <el-input v-model="form.appId" placeholder="请输入应用APPID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付渠道">
              <el-select v-model="form.channel" placeholder="请选择支付渠道">
                <el-option
                  v-for="dict in channelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用描述" prop="appDesc">
              <el-input v-model="form.appDesc" placeholder="请输入应用描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="secret" prop="appSecret">
              <el-input v-model="form.appSecret" placeholder="请输入应用加密key" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="mchId" prop="mchId">
              <el-input v-model="form.mchId" placeholder="请输入商户号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <template>
                <el-switch :active-value="0" :inactive-value="1" v-model="form.status" />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="公钥" prop="pubKey">
          <el-input type="textarea" :rows="3" v-model="form.pubKey" placeholder="请输入公钥" />
        </el-form-item>
        <el-form-item label="私钥" prop="privKey">
          <el-input type="textarea" :rows="3" v-model="form.privKey" placeholder="请输入私钥" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig, changeStatus } from "@/api/payment/config";
import DetailDialog from '@/components/DetailDialog'
export default {
  name: "Config",
  components:{
    DetailDialog
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 支付配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 支付渠道字典
      channelOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appId: undefined,
        channel: undefined,
        appDesc: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        appId: [
          { required: true, message: "应用APPID不能为空", trigger: "blur" }
        ],
        channel: [
          { required: true, message: "支付渠道不能为空", trigger: "blur" }
        ],
        appDesc: [
          { required: true, message: "应用描述不能为空", trigger: "blur" }
        ],
        appSecret: [
          { required: true, message: "应用加密key不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        pubPrivKey: [
          { required: true, message: "公钥私钥对不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_payment_channel").then(response => {
      this.channelOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询支付配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 支付渠道字典翻译
    channelFormat(row, column) {
      return this.selectDictLabel(this.channelOptions, row.channel);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        appId: undefined,
        channel: undefined,
        appDesc: undefined,
        appSecret: undefined,
        mchId: undefined,
        status: undefined,
        pubKey: undefined,
        privKey: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加支付配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response.data;
        this.form.channel = parseInt(this.form.channel);
        this.open = true;
        this.title = "修改支付配置";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除支付配置编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },

    handleStatusChange(row) {
      const text = row.status == "0" ? "启用" : "停用";
      this.$confirm("确认要" + text + '"' + row.appDesc + '"的支付渠道?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        return changeStatus({'id':row.id, 'status':row.status});
      }).then(() => {
        this.msgSuccess(text + "成功");
        this.getList();
      }).catch(function () {
        row.status = row.status == "0" ? "1" : "0";
      });
    },

    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },

    handleCellDbClick(row, column, cell, event) {
      //8 9列的数据较长,弹出对话框显示
      const index = column.index;
      console.log('index:'+index);
      if (index === 8 || index === 9) {
        let msg = cell.innerText;
        try {
          msg = JSON.parse(msg);
        } catch (error) {
          msg = { 'msg': msg };
        }
        this.$refs.detailDialog.openDialog(msg);
      }
    }
  }
};
</script>