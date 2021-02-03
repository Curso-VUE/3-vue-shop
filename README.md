# vue-shop

1. [Crear proyecto con Vue UI](#init)
2. [Instalación y configuración de los plugins](#dependencies)
3. [Iniciar un módulo con Vuex para manejar los productos de la aplicación](#prodruct-manage)
4. [Acciones del módulo *products* haciendo petición HTTP con *async* y *await*](#actions)
5. [Definir la lógica del listado de productos](#product-list)
6. [Primera versión del sitado de productos paginados](#pagination)
7. [Componente que representa un producto](#productItem)

<hr>

<a name="init"></a>

## 1. Crear proyecto con Vue UI

Creamos el nuevo proyecto a través de ```vue ui```

Vamos a utilizar los siguientes plugins:

- [vue-paginate](https://github.com/TahaSh/vue-paginate)
- [bootstrap-vue](https://bootstrap-vue.org/)

<hr>

<a name="dependencies"></a>

## 2. Instalación y configuración de los plugins

Instalamos ambos plugins mediante el comando ```npm i bootstrap-vue vue-paginate```

Para cargar los plugins en la aplicación es buena práctica crear un directorio *plugins* en *src* donde incluiremos un archivo .js por cada plugin que vayamos a utilizar.

- bootstrap-vue.js

~~~
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
~~~

- vue-paginate

~~~
import Vue from 'vue'
import VuePaginate from 'vue-paginate'

Vue.use(VuePaginate)
~~~

Crearemos también en la carpeta *plugins* un *index.js* donde requeriremos los dos ficheros que acabamos de crear.

~~~
require ('./bootstrap-vue');
require ('./vue-paginate');
~~~

Finalmente en *main.js* requerimos el *index.js* de *plugins* después de las importaciones.

~~~
import Vue from 'vue'
import App from './App.vue'
import store from './store'

require('./plugins');
...
~~~

<hr>

<a name="product-manage"></a>

## 3. Iniciar un módulo con Vuex para manejar los productos de la aplicación

Para generar el dataset utilizamos [https://www.mockaroo.com/](https://www.mockaroo.com/) que es un generador de datos aleatorios.

Vamos a generar un dataset con elementos que tengan los parámetros siguientes:
- id
- name
- picture
- price
- stock

Guardamos su contenido en un nuevo archivo *public/fixtures/products.json*.

En este proyecto vamos a trabajar con el **store** mediante módulos, así que dentro de *src* creamos una carpeta *modules* y tantas carpetas como módulos necesitemos. En este caso, por ahora únicamente necesitaremos una carpeta *products*.

Dentro de la carpeta *products* creamos un archivo para las actions, otro para los mutations, otro para el state y finalmente un index que importe los anteriores.
- state.js
~~~
export default {
  products: []
}
~~~

- mutations.js
~~~
export function setProducts (state, products) {
  state.products = products;
}
~~~

- actions.js (por ahora vacío)

- index.js
~~~
import state from './state';
import * as mutations from './mutations';
import * as actions from './actions';

const namespaced = true;

export default {
  namespaced,
  state,
  mutations,
  actions
}
~~~

Finalmente importamos el módulo en el **store**.

~~~
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import products from '../modules/products';

export default new Vuex.Store({
  modules: {
    products
  }
})
~~~

<hr>

<a name="actions"></a>

## 4. Acciones del módulo *products* haciendo petición HTTP con *async* y *await*

Vamos a utilizar las acciones para realizar peticiones asíncronas y actualizar el **store**.

Configuramos la acción en */src/modules/products/actions.js*:

~~~
export async function fetchProducts({ commit }) {
  const data = await fetch('/fixtures/products.json');
  const products = await data.json();
  commit('products/setProducts', products, { root: true });
}
~~~

```En el commit hay que especificar la ruta del mutation que vamos a utilizar, el nuevo valor y { root: true} para indicar que el estado se encuentra en la raiz.```

<hr>

<a name="product-list"></a>

## 5. Definir la lógica del listado de productos

Eliminamos el componente *HelloWorld.vue* así como su importación, declaración y renderizado de *app.vue*. Eliminamos también los estilos, de forma que nos quede el componente limpio.

En generamos un nuevo componente *ProductList*. En él configuramos el mapState y el mapActions para acceder al estado y a las acciones del módulo **products**.

Configuramos el hook **mounted** para obtener los productos una vez el componente se haya cargado.

En el template, visualizamos la cantidad de productos que se han cargado para comprobar que funciona correctamente.

~~~
<template>
  <div>{{products.length}}</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  mounted () {
    this.fetchProducts()
  },
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts'])
  }
}
</script>
~~~

Configuramos la paginación en los datos de *ProductList*:

~~~
  data() {
    return {
      paginate: ['products'],
      perPage: 3
    }
  },
~~~

<hr>

<a name="pagination"></a>

## 6. Primera versión del sitado de productos paginados

Creamos una primera aproximación del template de componente *ProductList*.

Primero establecemos que se visualice un alert cuando no haya datos de productos:

~~~
<template>
  <div v-if="products.length">
    
  </div>
  <b-alert v-else show variant="info">No hay productos para mostar</b-alert>

</template>
~~~

Para la lista de productos paginados utilizamos la etiqueta **paginate** en el **div**:

~~~
    <paginate 
      name="products"
      :list="products"
      :per="perPage"
    >
      <p v-for="product in paginated('products')" :key="product.id">{{product.name}}</p>
    </paginate>
~~~

Al mismo nivel que paginate renderizamos los links de las siguientes páginas mediante la etiqueta **paginate-links**:

~~~
    <paginate-links
      for="products"
      :classes="{
        'ul': 'pagination',
        'li': 'page-item',
        'li > a': 'page-link'
      }"
    ></paginate-links>
~~~

Con la configuración de clases podemos añadir una clase a los elementos que decidamos.

<hr>

<a name="ProductItem"></a>

## 7. Componente que representa un producto

Creamos el template del nuevo componente *ProductItem*:

~~~
<template>
  <b-card
    :title="product.name"
    :img-src="product.picture"
    :img-alt="product.name"
    img-top
    style="max-width: 30rem;"
    class="mb-2"
  >
    <b-button
      block
      variant="warning"
      @click="$emit('addToCart', product)"
    >
      Añadir al carrito
    </b-button>
  </b-card>
</template>
~~~

Definimos en el script las props que nos llegarán del componente padre (en este caso product):

~~~
<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    }
  }
}
</script>
~~~

En *ProductList* renderizamos el nuevo componente sustityyendo lo que teníamos dentro de las etiquetas **paginate**:

~~~
      <b-card-group columns>
        <product-item
          v-for="product in paginated('products')" 
          :key="product.id" 
          :product="product"
          @addTOCart="addProductToCart"
        ></product-item>
      </b-card-group>
~~~

Creamos un método para manejar el evento que se genera la hacer click en el botón del componente hijo:

~~~
  methods: {
    ...mapActions('products', ['fetchProducts']),
    addProductToCart (product) {
      console.log(product)
    }
~~~