<template>
  <div v-if="products.length">
    <paginate 
      name="products"
      :list="products"
      :per="perPage"
    >
      <p v-for="product in paginated('products')" :key="product.id">{{product.name}}</p>
    </paginate>

    <paginate-links
      for="products"
      :classes="{
        'ul': 'pagination',
        'li': 'page-item',
        'li > a': 'page-link'
      }"
    ></paginate-links>
  </div>
  <b-alert v-else show variant="info">No hay productos para mostar</b-alert>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  mounted () {
    this.fetchProducts()
  },
  data() {
    return {
      paginate: ['products'],
      perPage: 3
    }
  },
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts'])
  }
}
</script>