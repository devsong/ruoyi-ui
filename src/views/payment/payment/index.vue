<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="支付流水号" prop="serial">
        <el-input
          v-model="queryParams.serial"
          placeholder="请输入支付流水号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单来源" prop="orderFrom">
        <el-select v-model="queryParams.orderFrom" placeholder="请选择订单来源" clearable size="small">
          <el-option
            v-for="dict in orderFromOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会员ID" prop="memberId">
        <el-input
          v-model="queryParams.memberId"
          placeholder="请输入会员ID"
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
      <el-form-item label="支付状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择支付状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
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
          v-hasPermi="['payment:payment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['payment:payment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['payment:payment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['payment:payment:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="paymentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="支付流水号" align="center" prop="serial" />
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="订单来源" align="center" prop="orderFrom" :formatter="orderFromFormat" />
      <el-table-column label="会员ID" align="center" prop="memberId" />
      <el-table-column label="支付渠道" align="center" prop="channel" :formatter="channelFormat" />
      <el-table-column label="支付金额(以分为单位)" align="center" prop="amt" />
      <el-table-column label="支付商品描述" align="center" prop="subject" />
      <el-table-column label="支付状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="调用方名称" align="center" prop="clientName" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作来源IP" align="center" prop="operatorIp" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['payment:payment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['payment:payment:remove']"
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

    <!-- 添加或修改支付请求对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select v-model="form.orderFrom" placeholder="请选择订单来源">
            <el-option
              v-for="dict in orderFromOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员ID" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入会员ID" />
        </el-form-item>
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
        <el-form-item label="支付金额(以分为单位)" prop="amt">
          <el-input v-model="form.amt" placeholder="请输入支付金额(以分为单位)" />
        </el-form-item>
        <el-form-item label="支付商品描述" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入支付商品描述" />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.status" placeholder="请选择支付状态">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调用方名称" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入调用方名称" />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="操作来源IP" prop="operatorIp">
          <el-input v-model="form.operatorIp" placeholder="请输入操作来源IP" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPayment, getPayment, delPayment, addPayment, updatePayment, exportPayment, changeStatus} from "@/api/payment/payment";

export default {
  name: "Payment",
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
      // 支付请求表格数据
      paymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 订单来源字典
      orderFromOptions: [],
      // 支付渠道字典
      channelOptions: [],
      // 支付状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serial: undefined,
        orderId: undefined,
        orderFrom: undefined,
        memberId: undefined,
        channel: undefined,
        status: undefined,
        createTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderId: [
          { required: true, message: "订单号不能为空", trigger: "blur" }
        ],
        orderFrom: [
          { required: true, message: "订单来源不能为空", trigger: "blur" }
        ],
        memberId: [
          { required: true, message: "会员ID不能为空", trigger: "blur" }
        ],
        channel: [
          { required: true, message: "支付渠道不能为空", trigger: "blur" }
        ],
        amt: [
          { required: true, message: "支付金额(以分为单位)不能为空", trigger: "blur" }
        ],
        subject: [
          { required: true, message: "支付商品描述不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "支付状态不能为空", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "调用方名称不能为空", trigger: "blur" }
        ],
        operator: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        operatorIp: [
          { required: true, message: "操作来源IP不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间戳不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_order_from").then(response => {
      this.orderFromOptions = response.data;
    });
    this.getDicts("sys_payment_channel").then(response => {
      this.channelOptions = response.data;
    });
    this.getDicts("sys_payment_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询支付请求列表 */
    getList() {
      this.loading = true;
      listPayment(this.queryParams).then(response => {
        this.paymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单来源字典翻译
    orderFromFormat(row, column) {
      return this.selectDictLabel(this.orderFromOptions, row.orderFrom);
    },
    // 支付渠道字典翻译
    channelFormat(row, column) {
      return this.selectDictLabel(this.channelOptions, row.channel);
    },
    // 支付状态字典翻译
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
        serial: undefined,
        orderId: undefined,
        orderFrom: undefined,
        memberId: undefined,
        channel: undefined,
        amt: undefined,
        subject: undefined,
        status: undefined,
        clientName: undefined,
        operator: undefined,
        operatorIp: undefined,
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
      this.ids = selection.map(item => item.serial)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加支付请求";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const serial = row.serial || this.ids
      getPayment(serial).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付请求";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.serial != undefined) {
            updatePayment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPayment(this.form).then(response => {
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
      const serials = row.serial || this.ids;
      this.$confirm('是否确认删除支付请求编号为"' + serials + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPayment(serials);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有支付请求数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPayment(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    handleStatusChange(row) {
      const text = row.status == "0" ? "启用" : "停用";
      this.$confirm("确认要" + text + '"' + row.key + '"的业务key?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        return changeStatus(row.key, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
        this.getList();
      }).catch(function () {
        row.status = row.status == "0" ? "1" : "0";
      });
    }
  }
};
</script>