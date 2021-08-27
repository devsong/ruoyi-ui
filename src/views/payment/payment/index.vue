<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="流水号" prop="serial">
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

    <el-table v-loading="loading" :data="paymentList" >
      <el-table-column label="支付流水号" align="center" prop="serial" />
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="订单来源" align="center" prop="orderFrom" :formatter="orderFromFormat" />
      <el-table-column label="会员ID" align="center" prop="memberId" />
      <el-table-column label="支付渠道" align="center" prop="channel" :formatter="channelFormat" />
      <el-table-column label="支付金额" align="center" prop="amt" />
      <el-table-column label="支付商品描述" align="center" prop="subject" />
      <el-table-column label="支付状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="调用方" align="center" prop="clientName" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作来源IP" align="center" prop="operatorIp" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listPayment, getPayment} from "@/api/payment/payment";

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
    }
  }
};
</script>