<template>
  <div class="app-container">
     <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="数据库链接">
        <el-input v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="数据库端口">
        <el-input v-model="form.port"></el-input>
      </el-form-item>
       <el-form-item label="数据库名称">
        <el-input v-model="form.database"></el-input>
      </el-form-item>
      <el-form-item label="数据库账号">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="数据库密码">
        <el-input type="textarea" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>

    <!-- sql执行界面 -->
    <el-dialog
      title="sql执行"
      :fullscreen="true"
      :visible.sync="dialogVisible"
      >
      sql语句<el-input v-model="sql"></el-input>
      <el-button type="primary" @click="execSql">执行sql</el-button>
       <el-table
        border
        :data="tableData"
        style="width: 100%;margin-top:2%;">
        <el-table-column
          v-for="(item, index) in tableField"
          :key="item" 
          :prop="index" 
          :label="index"
        >
        </el-table-column>
      </el-table>
      <!-- width="30%" -->
      <!-- :before-close="handleClose" -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mongoose from 'mongoose'
import { connect } from '@/api/mysql'
export default {
  data() {
    return {
      form: {
        host: '',
        port: '',
        database: '',
        user: '',
        password: ''
      },
      sql: '',
      connection: {},
      tableData: [],
      tableField: {},
      dialogVisible: false
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    openDB: async function() {
      await mongoose.disconnect()
      mongoose.connect('mongodb://armandox:Tt469000Xx@192.168.1.21:27017/gk_project', { useNewUrlParser: true })
      return new Promise((resolve) => {
        mongoose.connection.on('open', function() {
          resolve(true)
        })
      })
    },
    showUsers: async function() {
      const openDB = await this.openDB()
      if (!openDB) return
      const collections = await mongoose.connection.db.collections()
      for (const collection of collections) {
        console.log(collection.collectionName)
      }
    },
    onCancel: async function() {
      console.log(this.form)
    },
    onSubmit: async function() {
      const { connection, err } = await connect(this.form)
      if (err) {
        this.$message({
          type: 'error',
          message: '链接失败' + err
        })
        return
      } else {
        this.$message({
          type: 'success',
          message: '链接成功'
        })
      }
      this.connection = connection
      this.dialogVisible = true
    },
    execSql: async function() {
      // 'SELECT * FROM user'
      const that = this
      this.connection.query(this.sql, function(error, results, fields) {
        if (error) throw error
        // const fields = []
        // for (let key of results[0]) {

        // }
        that.tableField = results[0]
        that.tableData = results
        console.log('The solution is: ', results)
      })
    }
  }
}
</script>
