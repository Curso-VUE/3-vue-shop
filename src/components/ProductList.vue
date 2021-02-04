<template>
  <div v-if="products.length">
    <paginate 
      name="products"
      :list="products"
      :per="perPage"
    >
      <b-card-group columns>
        <product-item
          v-for="product in paginated('products')" 
          :key="product.id" 
          :product="product"
          @addTOCart="addProductToCart"
        ></product-item>
      </b-card-group>
    </paginate>

    <paginate-links
      for="products"
      :limit="10"
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
import ProductItem from './ProductItem'
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
  components: {
    ProductItem
  },
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    addProductToCart (product) {
      console.log(product)
    }
  }
}
</script>