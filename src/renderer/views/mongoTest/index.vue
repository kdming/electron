<template>
  <div class="app-container">
    <h2>test</h2>
    <button @click="showUsers">展示user表用户数量</button>
  </div>
</template>

<script>
import mongoose from 'mongoose'
export default {
  data() {
    return {}
  },
  mounted() {
  },
  created() {
    this.fetchData()
  },
  methods: {
    openDB() {
      mongoose.connect('mongodb://armandox:Tt469000Xx@192.168.1.21:27017/gk_project')
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
        console.log(collection)
      }
    }
  }
}
</script>
