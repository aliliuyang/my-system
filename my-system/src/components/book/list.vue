<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>图书管理</el-breadcrumb-item>
        <el-breadcrumb-item>图书列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="书名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getBooks">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="books" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[图书简介]">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="书名" sortable></el-table-column>
        <el-table-column prop="author" label="作者" width="100" sortable></el-table-column>
        <el-table-column prop="publishAt" label="出版日期" width="150" sortable></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="书名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="editForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出版日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.publishAt"></el-date-picker>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="editForm.description" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="书名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="addForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出版日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.publishAt"></el-date-picker>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="addForm.description" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import util from '../../common/util';
  import {reqGetBookListPage, reqDeleteBook, reqEditBook, reqBatchDeleteBook, reqAddBook} from '../../api/api';
    export default {
        data (){
            return {
              filters:{
                name : ''
              },
              books:[],
              total:0,
              page:1,
              listLoading:false,
              sels:[],//列表选中列

              //编辑相关数据
              editFormVisible:false,//编辑界面是否显示
              editLoading:false,
              editFormRules:{
                name: [
                  {required: true, message: '请输入书名', trigger: 'blur'}
                ],
                author: [
                  {required: true, message: '请输入作者', trigger: 'blur'}
                ],
                description: [
                  {required: true, message: '请输入简介', trigger: 'blur'}
                ]
              },
              editForm:{
                id: 0,
                name: '',
                author: '',
                publishAt: '',
                description: ''
              },

              //新增相关数据
              addFormVisible:false,//新增界面是否显示
              addLoading:false,
              addFormRules:{
                name: [
                  {required: true, message: '请输入书名', trigger: 'blur'}
                ],
                author: [
                  {required: true, message: '请输入作者', trigger: 'blur'}
                ],
                description: [
                  {required: true, message: '请输入简介', trigger: 'blur'}
                ]
              },
              addForm:{
                name: '',
                author: '',
                publishAt: '',
                description: ''
              }
            }
        },
        mounted (){
          this.getBooks()
        },
        methods:{
          handleCurrentChange(val){
            this.page = val
          },

          //获取用户列表
          getBooks(){
            let para = {
              page:this.page,//这个需要有，如果没有值是不显示内容的
              name:this.filters.name
            }
            reqGetBookListPage(para).then((res) => {
              this.total = res.data.total
              this.books = res.data.books
            })
          },
          selsChange(sels){
            this.sels = sels
          },
          //删除
          delBook(index,row){
            this.$confirm('确认删除记录吗？','提示',{type:'warning'}).then(() =>{
              this.listLoading = true;
              let para = {
                id: row.id
              }
              reqDeleteBook(para).then((res) => {
                console.log(res)
                this.listLoading = false;
                this.$message({
                  message:'删除成功',
                  type:'success'

                })
                this.getBooks()
              }).catch(() =>{

              })
            })

          },
          //显示编辑界面
          showEditDialog(index,row){
              this.editFormVisible = true;
              this.editForm = Object.assign({}, row);
          },
          //编辑
          editSubmit(){
            this.$refs.editForm.validate((valid) => {
              if(valid){
                this.$confirm('确认提交吗？','提示',{}).then(() =>{
                  this.editLoading = true;
                  let para = Object.assign({}, this.editForm)
                  para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
                  reqEditBook(para).then((res) =>{
                    this.editLoading = false;
                    this.$message({
                      message:'提交成功',
                      type:'success'
                    })
                    this.$refs['editForm'].resetFields();
                    this.editFormVisible = false;
                    this.getBooks();
                  })
                })
              }
            })
          },
          //显示新增界面
          showAddDialog(){
              this.addFormVisible = true;
              let addForm = {
                name: '',
                author: '',
                publishAt: '',
                description: ''
              }
          },
          //新增
          addSubmit(){
            this.$refs.addForm.validate((valid) => {
              if(valid){
                this.addLoading = true;
                let para = Object.assign({}, this.addForm)
                ara.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
                reqAddBook(para).then((res) => {
                  this.addLoading = false;
                  this.$message({
                    message:'提交成功',
                    type:'success'
                  })
                  this.$refs['addForm'].resetFields()
                  this.addFormVisible = false
                  this.getBooks()
                })
              }
            })
          },
          //批量删除
          batchDeleteBook(){
            var ids = this.sels.map(item => item.id).toString()
            this.confirm('确认删除选中记录吗？','提示',{type:'warning'}).then(() =>{
              this.listLoading = true
              let para = {
                ids:ids
              }
              reqBatchDeleteBook(para).then((res) => {
                this.listLoading = false
                this.$message({
                  message:'删除成功',
                  type:'success'
                })
                this.getBooks()
              }).catch(() =>{

              })
            })
          }
        },
        components: {}
    }
</script>

<style>
</style>
