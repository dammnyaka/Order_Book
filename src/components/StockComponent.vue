<template>
   <div class="order-book">
      <div v-if="loading">Загрузка...</div>
      <div v-else>
         <h2>Биржевой стакан</h2>
         <div style="display: flex; justify-content: center">
            <table>
               <thead>
                  <tr>
                     <th>Цена</th>
                     <th>Количество</th>
                  </tr>
               </thead>
               <tbody>
                  <tr
                     v-for="bid in bids"
                     :key="bid[0]"
                     :class="{ 'our-order_bid': isOurOrder(bid) }"
                  >
                     <td class="bid_price">{{ bid[0] }}</td>
                     <td class="bid_quantity">{{ bid[1] }}</td>
                  </tr>
               </tbody>
            </table>
         </div>
         <p>Спред: {{ spread.toPrecision(1) }}</p>
         <div style="display: flex; justify-content: center">
            <table>
               <thead>
                  <tr>
                     <th>Цена</th>
                     <th>Количество</th>
                  </tr>
               </thead>
               <tbody>
                  <tr
                     v-for="ask in asks"
                     :key="ask[0]"
                     :class="{ 'our-order_ask': isOurOrder(ask) }"
                  >
                     <td class="ask_price">{{ ask[0] }}</td>
                     <td class="ask_quantity">{{ ask[1] }}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
   name: "StockComponent",
   computed: {
      ...mapState("orderBook", ["bids", "asks", "spread", "loading"]),
      ...mapGetters("orderBook", ["isOurOrder"]),
   },
   mounted() {
      this.getOurOrders();
      this.startOrderBookStream();
   },
   methods: {
      ...mapActions("orderBook", ["getOurOrders", "startOrderBookStream"]),
   },
};
</script>

<style>
.order-book {
   max-width: 300px;
   margin: 0 auto;
   font-size: small;
   color: white;

   background-color: rgb(31, 31, 35);
}
.our-order_bid {
   background: rgb(93, 10, 16);
}
.our-order_ask {
   background: rgb(17, 90, 84);
}
table {
   width: 70%;
}
.bid_price {
   color: red;
}
.ask_price {
   color: green;
}
td:nth-child(1) {
   text-align: start;
}
td:nth-child(2) {
   text-align: end;
}
</style>
